from rest_framework import serializers
from investigators.models import Usuario, Investigador, Estudiante

class UsuarioSerializer(serializers.ModelSerializer):
    # Añadimos campos de solo lectura para mostrar información de perfiles
    investigador_nombre = serializers.SerializerMethodField(read_only=True)
    estudiante_nombre = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre_usuario', 'contrasena', 'rol', 
            'investigador', 'investigador_nombre',
            'estudiante', 'estudiante_nombre',
            'fecha_creacion', 'ultimo_acceso', 'intentos_login', 'activo'
        ]
        extra_kwargs = {
            'rol': {'required': True},
            'contrasena': {'write_only': True}
        }
    
    def get_investigador_nombre(self, obj):
        if obj.investigador:
            return obj.investigador.nombre
        return None
    
    def get_estudiante_nombre(self, obj):
        if obj.estudiante:
            return obj.estudiante.nombre
        return None

    def create(self, validated_data):
        password = validated_data.pop('contrasena', None)
        usuario = Usuario.objects.create(**validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop('contrasena', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance