from rest_framework import serializers
from investigators.models import Usuario
from investigators.authentication import UsuarioRefreshToken
from django.contrib.auth.hashers import check_password

class CustomTokenObtainSerializer(serializers.Serializer):
    nombre_usuario = serializers.CharField()
    contrasena = serializers.CharField(write_only=True)

    def validate(self, attrs):
        nombre_usuario = attrs.get('nombre_usuario')
        contrasena = attrs.get('contrasena')
        
        try:
            usuario = Usuario.objects.get(nombre_usuario=nombre_usuario, activo=True)
            
            if check_password(contrasena, usuario.contrasena):
                return usuario
            else:
                raise serializers.ValidationError(
                    {"contrasena": "Contraseña incorrecta."}
                )
        except Usuario.DoesNotExist:
            raise serializers.ValidationError(
                {"nombre_usuario": "No se encontró usuario con este nombre o está inactivo."}
            )