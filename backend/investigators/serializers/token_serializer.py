from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from investigators.models import Usuario

class CustomTokenObtainSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        try:
            user = Usuario.objects.get(nombre_usuario=username, activo=True)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas.")

        if not user.check_password(password):
            raise serializers.ValidationError("Credenciales inválidas.")

        refresh = RefreshToken.for_user(user)
        
        refresh['role'] = user.rol
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.rol,
        }