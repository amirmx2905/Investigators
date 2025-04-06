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
    permission_classes = [AllowAny] 
    
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            response = Response(
                {"username": serializer.validated_data['username'], "role": serializer.validated_data['role']},
                status=status.HTTP_200_OK
            )
            
            self._set_cookie(
                response=response,
                key='access_token',
                value=serializer.validated_data['access'],
                expires=datetime.now() + timedelta(minutes=30),
                httponly=True,
                samesite='Lax'
            )
            
            self._set_cookie(
                response=response,
                key='refresh_token',
                value=serializer.validated_data['refresh'],
                expires=datetime.now() + timedelta(days=1),
                httponly=True,
                samesite='Lax'
            )
            
            return response
        
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
    def _set_cookie(self, response, key, value, expires, httponly=True, samesite='Lax'):
        response.set_cookie(
            key=key,
            value=value,
            expires=expires,
            httponly=httponly,
            secure=False,  # Cambir a True en producción
            samesite=samesite 
        )

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