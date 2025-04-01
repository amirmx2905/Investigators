from rest_framework import serializers
from investigators.models import Articulo, DetArticulo, Investigador

class InvestigadorBasicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        fields = ['id', 'nombre']

class DetArticuloSerializer(serializers.ModelSerializer):
    investigador_nombre = serializers.CharField(source='investigador.nombre', read_only=True)
    
    class Meta:
        model = DetArticulo
        fields = ['investigador', 'investigador_nombre', 'orden_autor']

class ArticuloSerializer(serializers.ModelSerializer):
    autores = DetArticuloSerializer(source='detarticulo_set', many=True, read_only=True)
    investigadores_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    ordenes_autores = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    # Añadir el campo calculado para el año
    ano_publicacion = serializers.SerializerMethodField()
    
    class Meta:
        model = Articulo
        fields = [
            'id', 'nombre_articulo', 'nombre_revista', 'abstracto',
            'pais_publicacion', 'fecha_publicacion', 'ano_publicacion',
            'doi', 'url', 'estatus', 'autores',
            'investigadores_ids', 'ordenes_autores'
        ]
    
    def get_ano_publicacion(self, obj):
        """Obtener el año de la fecha de publicación"""
        if obj.fecha_publicacion:
            return obj.fecha_publicacion.year
        return None
    
    def create(self, validated_data):
        investigadores_ids = validated_data.pop('investigadores_ids', [])
        ordenes_autores = validated_data.pop('ordenes_autores', [])
        
        articulo = Articulo.objects.create(**validated_data)
        
        if investigadores_ids and ordenes_autores and len(investigadores_ids) == len(ordenes_autores):
            for inv_id, orden in zip(investigadores_ids, ordenes_autores):
                DetArticulo.objects.create(
                    articulo=articulo,
                    investigador_id=inv_id,
                    orden_autor=orden
                )
        
        return articulo
    
    def update(self, instance, validated_data):
        investigadores_ids = validated_data.pop('investigadores_ids', None)
        ordenes_autores = validated_data.pop('ordenes_autores', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if investigadores_ids is not None and ordenes_autores is not None:
            instance.detarticulo_set.all().delete()
            
            if len(investigadores_ids) == len(ordenes_autores):
                for inv_id, orden in zip(investigadores_ids, ordenes_autores):
                    DetArticulo.objects.create(
                        articulo=instance,
                        investigador_id=inv_id,
                        orden_autor=orden
                    )
        
        return instance