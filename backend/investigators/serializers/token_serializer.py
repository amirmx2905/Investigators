from rest_framework import serializers
from investigators.models import Usuario
from investigators.authentication import UsuarioRefreshToken

class CustomTokenObtainSerializer(serializers.Serializer):
    nombre_usuario = serializers.CharField()
    contrasena = serializers.CharField(trim_whitespace=False)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)

    def validate(self, attrs):
        nombre_usuario = attrs.get('nombre_usuario')
        contrasena = attrs.get('contrasena')

        try:
            usuario = Usuario.objects.get(nombre_usuario=nombre_usuario, activo=True)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas.")

        if not usuario.check_password(contrasena):
            usuario.incrementar_intentos_login()
            raise serializers.ValidationError("Credenciales inválidas.")

        usuario.resetear_intentos_login()
        usuario.actualizar_ultimo_acceso()
        
        refresh = UsuarioRefreshToken.for_usuario(usuario)
        
        return {
            'access': refresh['access_token'],
            'refresh': str(refresh),
            'role': usuario.rol,
            'username': usuario.nombre_usuario,
        }