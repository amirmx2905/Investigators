from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from investigators.serializers.token_serializer import CustomTokenObtainSerializer
from investigators.authentication import UsuarioRefreshToken, UsuarioToken
from investigators.models import Usuario
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError
from datetime import datetime, timedelta

class CustomTokenObtainView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = CustomTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.validated_data
            refresh = UsuarioRefreshToken.for_usuario(usuario)
            
            response = Response({'detail': 'Login exitoso'})
            
            response.set_cookie(
                'refresh_token',
                str(refresh),
                httponly=True,
                samesite='Lax',
                expires=datetime.fromtimestamp(refresh['exp'])
            )
            
            response.set_cookie(
                'access_token',
                str(refresh['access_token']),
                httponly=True,
                samesite='Lax',
                expires=datetime.fromtimestamp(refresh['exp'])
            )
            
            if hasattr(usuario, 'actualizar_ultimo_acceso'):
                usuario.actualizar_ultimo_acceso()
            
            return response
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "No se proporcionó un token de refresco"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = UsuarioRefreshToken(refresh_token)
            usuario_id = token.get('usuario_id')
            
            usuario = Usuario.objects.get(id=usuario_id, activo=True)
            
            access_token = UsuarioToken.for_usuario(usuario)
            
            response = Response({"detail": "Token refrescado exitosamente"}, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='access_token',
                value=str(access_token),
                expires=datetime.now() + timedelta(minutes=30),
                httponly=True,
                secure=False,  # Cambiar a True en producción
                samesite='Lax'
            )
            
            return response
        
        except TokenError:
            return Response({"detail": "Token de refresco inválido o expirado"}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario no encontrado o inactivo"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"detail": f"Error al refrescar el token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TokenLogoutView(APIView):    
    def post(self, request):
        response = Response({"detail": "Sesión cerrada exitosamente"})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response