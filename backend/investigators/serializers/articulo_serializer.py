from rest_framework import serializers
from investigators.models import Articulo, DetArticulo, Investigador
from django.db import transaction

class ArticuloListSerializer(serializers.ModelSerializer):
    primer_autor = serializers.SerializerMethodField()
    num_autores = serializers.SerializerMethodField()
    ano_publicacion = serializers.IntegerField(read_only=True)
    autores = serializers.SerializerMethodField()
    
    class Meta:
        model = Articulo
        fields = ['id', 'nombre_articulo', 'nombre_revista', 'pais_publicacion', 
                  'fecha_publicacion', 'ano_publicacion', 'doi', 'url', 
                  'estatus', 'primer_autor', 'num_autores', 'autores']
    
    def get_primer_autor(self, obj):
        primer_autor = DetArticulo.objects.filter(
            articulo=obj, orden_autor=1
        ).first()
        
        if primer_autor:
            return primer_autor.investigador.nombre
        return None
    
    def get_num_autores(self, obj):
        return obj.investigadores.count()
    
    def get_autores(self, obj):
        detalles = DetArticulo.objects.filter(articulo=obj).select_related('investigador')
        result = []
        for det in detalles:
            result.append({
                'investigador': det.investigador_id,
                'investigador_nombre': det.investigador.nombre,
                'orden_autor': det.orden_autor
            })
        return result

class InvestigadorArticuloSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='investigador.nombre', read_only=True)
    correo = serializers.EmailField(source='investigador.correo', read_only=True)
    
    class Meta:
        model = DetArticulo
        fields = ['investigador_id', 'orden_autor', 'nombre', 'correo']

class ArticuloDetailSerializer(serializers.ModelSerializer):
    autores = serializers.SerializerMethodField()
    ano_publicacion = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Articulo
        fields = ['id', 'nombre_articulo', 'nombre_revista', 'abstracto',
                  'pais_publicacion', 'fecha_publicacion', 'ano_publicacion',
                  'doi', 'url', 'estatus', 'autores']
    
    def get_autores(self, obj):
        detalles = DetArticulo.objects.filter(articulo=obj).select_related('investigador')
        result = []
        for det in detalles:
            result.append({
                'investigador': det.investigador_id,
                'investigador_nombre': det.investigador.nombre,
                'orden_autor': det.orden_autor
            })
        return sorted(result, key=lambda x: x['orden_autor'])

class ArticuloSerializer(serializers.ModelSerializer):
    autores = serializers.SerializerMethodField(read_only=True)
    ano_publicacion = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Articulo
        fields = ['id', 'nombre_articulo', 'nombre_revista', 'abstracto',
                  'pais_publicacion', 'fecha_publicacion', 'ano_publicacion',
                  'doi', 'url', 'estatus', 'autores']
    
    def get_autores(self, obj):
        detalles = DetArticulo.objects.filter(articulo=obj).select_related('investigador')
        result = []
        for det in detalles:
            result.append({
                'investigador': det.investigador_id,
                'investigador_nombre': det.investigador.nombre,
                'orden_autor': det.orden_autor
            })
        return sorted(result, key=lambda x: x['orden_autor'])
    
    @transaction.atomic
    def create(self, validated_data):
        investigadores_ids = self.context.get('request').data.get('investigadores_ids', [])
        ordenes_autores = self.context.get('request').data.get('ordenes_autores', [])
        
        if len(investigadores_ids) != len(ordenes_autores):
            raise serializers.ValidationError("La cantidad de investigadores y órdenes debe ser igual")
        
        articulo = Articulo.objects.create(**validated_data)
        
        for i in range(len(investigadores_ids)):
            inv_id = investigadores_ids[i]
            orden = ordenes_autores[i]
            
            if inv_id:
                DetArticulo.objects.create(
                    articulo=articulo,
                    investigador_id=inv_id,
                    orden_autor=orden
                )
        
        return articulo
    
    @transaction.atomic
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        investigadores_ids = self.context.get('request').data.get('investigadores_ids', [])
        ordenes_autores = self.context.get('request').data.get('ordenes_autores', [])
        
        if investigadores_ids is not None and ordenes_autores is not None:
            if len(investigadores_ids) != len(ordenes_autores):
                raise serializers.ValidationError("La cantidad de investigadores y órdenes debe ser igual")
            
            relaciones_existentes = {
                detalle.investigador_id: detalle
                for detalle in DetArticulo.objects.filter(articulo=instance)
            }
            
            investigadores_actualizados = set()
            
            for i in range(len(investigadores_ids)):
                inv_id = investigadores_ids[i]
                orden = ordenes_autores[i]
                
                if not inv_id:
                    continue
                
                if inv_id in relaciones_existentes:
                    detalle = relaciones_existentes[inv_id]
                    if detalle.orden_autor != orden:
                        detalle.orden_autor = orden
                        detalle.save(update_fields=['orden_autor'])
                    investigadores_actualizados.add(inv_id)
                else:
                    DetArticulo.objects.create(
                        articulo=instance,
                        investigador_id=inv_id,
                        orden_autor=orden
                    )
                    investigadores_actualizados.add(inv_id)
            
            for inv_id, detalle in relaciones_existentes.items():
                if inv_id not in investigadores_actualizados:
                    detalle.delete()
        
        return instance