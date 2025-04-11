from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from investigators.models import Usuario
from datetime import timedelta
from django.conf import settings
import jwt

class UsuarioToken(Token):
    token_type = 'access'
    lifetime = timedelta(minutes=30)
    
    @classmethod
    def for_usuario(cls, usuario):
        token = cls()
        token.set_exp()
        token.set_iat()
        token.set_jti()
        
        token['usuario_id'] = usuario.id
        token['nombre_usuario'] = usuario.nombre_usuario
        token['rol'] = usuario.rol
        
        return token

class UsuarioRefreshToken(UsuarioToken):
    token_type = 'refresh'
    lifetime = timedelta(days=1)
    
    @classmethod
    def for_usuario(cls, usuario):
        refresh = cls()
        refresh.set_exp()
        refresh.set_iat()
        refresh.set_jti()
        
        refresh['usuario_id'] = usuario.id
        refresh['nombre_usuario'] = usuario.nombre_usuario
        refresh['rol'] = usuario.rol
        
        access_token = UsuarioToken()
        access_token.set_exp()
        access_token.set_iat()
        access_token.set_jti()
        access_token['usuario_id'] = usuario.id
        access_token['nombre_usuario'] = usuario.nombre_usuario
        access_token['rol'] = usuario.rol
        
        refresh['access_token'] = str(access_token)
        
        return refresh

class UsuarioJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('access_token')        
        if not token and 'refresh_token' in request.COOKIES:
            refresh_token = request.COOKIES.get('refresh_token')
            decoded_refresh = jwt.decode(
                refresh_token, 
                settings.SECRET_KEY, 
                algorithms=['HS256']
            )
            if 'access_token' in decoded_refresh:
                token = decoded_refresh['access_token']
        if not token:
            header = self.get_header(request)
            if header is None:
                return None
            
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None
            token = raw_token.decode() 
        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)
            return user, validated_token
        except Exception as e:
            return None
    
    def get_user(self, validated_token):
        try:
            usuario_id = validated_token['usuario_id']
        except KeyError:
            raise InvalidToken(_('El token no contiene información de identificación de usuario reconocible'))

        try:
            usuario = Usuario.objects.get(id=usuario_id, activo=True)
            return usuario
        except Usuario.DoesNotExist:
            raise AuthenticationFailed(_('Usuario no encontrado o inactivo'), code='user_not_found')