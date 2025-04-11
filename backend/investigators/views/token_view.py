from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from investigators.serializers.token_serializer import CustomTokenObtainSerializer
from investigators.authentication import UsuarioRefreshToken, UsuarioToken
from investigators.models import Usuario
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError
from datetime import datetime, timedelta
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

@extend_schema(
    summary="Obtener token de autenticación",
    description="Autentica al usuario y devuelve tokens de acceso y refresco como cookies HTTP",
    tags=["Autenticación"],
    request=CustomTokenObtainSerializer,
    examples=[
        OpenApiExample(
            'Ejemplo de solicitud de login',
            summary='Credenciales de usuario',
            value={
                'nombre_usuario': 'usuario_ejemplo',
                'password': 'contraseña_segura'
            },
            request_only=True,
        )
    ],
    responses={
        200: OpenApiResponse(
            description="Login exitoso, tokens establecidos en cookies",
            examples=[
                OpenApiExample(
                    'Respuesta de login exitoso',
                    value={"detail": "Login exitoso"},
                    response_only=True,
                )
            ]
        ),
        400: OpenApiResponse(description="Credenciales inválidas")
    }
)
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

@extend_schema(
    summary="Refrescar token de autenticación",
    description="Utiliza el token de refresco en cookies para obtener un nuevo token de acceso",
    tags=["Autenticación"],
    responses={
        200: OpenApiResponse(
            description="Token refrescado exitosamente",
            examples=[
                OpenApiExample(
                    'Respuesta de token refrescado',
                    value={"detail": "Token refrescado exitosamente"},
                    response_only=True,
                )
            ]
        ),
        400: OpenApiResponse(description="No se proporcionó un token de refresco"),
        401: OpenApiResponse(description="Token inválido o expirado"),
        500: OpenApiResponse(description="Error interno al refrescar token")
    }
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

@extend_schema(
    summary="Cerrar sesión",
    description="Elimina las cookies de token de acceso y refresco",
    tags=["Autenticación"],
    responses={
        200: OpenApiResponse(
            description="Sesión cerrada exitosamente",
            examples=[
                OpenApiExample(
                    'Respuesta de logout exitoso',
                    value={"detail": "Sesión cerrada exitosamente"},
                    response_only=True,
                )
            ]
        )
    }
)
class TokenLogoutView(APIView):    
    def post(self, request):
        response = Response({"detail": "Sesión cerrada exitosamente"})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response