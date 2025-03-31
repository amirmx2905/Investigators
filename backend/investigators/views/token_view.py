from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from investigators.serializers.token_serializer import CustomTokenObtainSerializer
from investigators.authentication import UsuarioRefreshToken, UsuarioToken
from investigators.models import Usuario
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError

class CustomTokenObtainView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny] 
    
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"detail": "No se proporcionó un token de refresco"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = UsuarioRefreshToken(refresh_token)
            usuario_id = token.get('usuario_id')
            
            usuario = Usuario.objects.get(id=usuario_id, activo=True)
            
            access_token = UsuarioToken.for_usuario(usuario)
            
            return Response({
                'access': str(access_token),
            })
        except TokenError:
            return Response({"detail": "Token de refresco inválido o expirado"}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario no encontrado o inactivo"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"detail": f"Error al refrescar el token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)