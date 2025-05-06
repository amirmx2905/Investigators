from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from investigators.models import Usuario
from datetime import timedelta
from django.conf import settings
import jwt

class UsuarioToken(Token):
    """
    Clase personalizada para generar tokens JWT de acceso.
    
    Extiende la clase Token de SimpleJWT para incluir información específica
    del usuario en el payload del token, como su ID, nombre de usuario y rol.
    
    Los tokens de acceso tienen una duración de 30 minutos por defecto.
    """
    token_type = 'access'
    lifetime = timedelta(minutes=30)
    
    @classmethod
    def for_usuario(cls, usuario):
        """
        Crea un nuevo token de acceso para un usuario específico.
        
        Args:
            usuario: Instancia del modelo Usuario para quien se crea el token
            
        Returns:
            Un token JWT con los datos del usuario incorporados
        """
        token = cls()
        token.set_exp()  # Establece la fecha de expiración
        token.set_iat()  # Establece la fecha de emisión
        token.set_jti()  # Establece un identificador único para el token
        
        # Incorpora información del usuario en el payload del token
        token['usuario_id'] = usuario.id
        token['nombre_usuario'] = usuario.nombre_usuario
        token['rol'] = usuario.rol
        
        return token

class UsuarioRefreshToken(UsuarioToken):
    """
    Clase personalizada para generar tokens JWT de refresco.
    
    Extiende UsuarioToken pero con mayor duración (1 día) y tipo 'refresh'.
    Esta clase genera tanto el token de refresco como un nuevo token de acceso,
    que se incluye dentro del payload del token de refresco.
    """
    token_type = 'refresh'
    lifetime = timedelta(days=1)
    
    @classmethod
    def for_usuario(cls, usuario):
        """
        Crea un nuevo token de refresco para un usuario específico.
        
        El token de refresco contiene un token de acceso embebido que puede
        extraerse cuando el token de acceso original expire.
        
        Args:
            usuario: Instancia del modelo Usuario para quien se crea el token
            
        Returns:
            Un token de refresco que incluye un nuevo token de acceso
        """
        refresh = cls()
        refresh.set_exp()
        refresh.set_iat()
        refresh.set_jti()
        
        # Incorpora información del usuario en el token de refresco
        refresh['usuario_id'] = usuario.id
        refresh['nombre_usuario'] = usuario.nombre_usuario
        refresh['rol'] = usuario.rol
        
        # Genera un nuevo token de acceso y lo incluye en el token de refresco
        access_token = UsuarioToken()
        access_token.set_exp()
        access_token.set_iat()
        access_token.set_jti()
        access_token['usuario_id'] = usuario.id
        access_token['nombre_usuario'] = usuario.nombre_usuario
        access_token['rol'] = usuario.rol
        
        # El token de acceso se guarda como una cadena dentro del token de refresco
        refresh['access_token'] = str(access_token)
        
        return refresh

class UsuarioJWTAuthentication(JWTAuthentication):
    """
    Clase personalizada para autenticar usuarios mediante tokens JWT.
    
    Esta clase extiende JWTAuthentication de DRF SimpleJWT y añade funcionalidades como:
    - Buscar tokens en cookies además de en cabeceras HTTP
    - Usar tokens de refresco automáticamente si el token de acceso no está disponible
    - Validar usuarios contra el modelo personalizado Usuario
    """
    def authenticate(self, request):
        """
        Autentica una solicitud HTTP usando tokens JWT.
        
        El método busca un token JWT válido en el siguiente orden:
        1. En la cookie 'access_token'
        2. En el token de refresco (cookie 'refresh_token') si existe
        3. En la cabecera de autorización HTTP
        
        Args:
            request: Objeto de solicitud HTTP de Django
            
        Returns:
            Tupla (usuario, token) si la autenticación es exitosa, None en caso contrario
        """
        # Intenta obtener el token de la cookie de acceso
        token = request.COOKIES.get('access_token')
        
        # Si no hay token de acceso pero sí hay token de refresco, extrae el token de acceso de él
        if not token and 'refresh_token' in request.COOKIES:
            refresh_token = request.COOKIES.get('refresh_token')
            decoded_refresh = jwt.decode(
                refresh_token, 
                settings.SECRET_KEY, 
                algorithms=['HS256']
            )
            if 'access_token' in decoded_refresh:
                token = decoded_refresh['access_token']
                
        # Si no hay token en cookies, busca en la cabecera HTTP
        if not token:
            header = self.get_header(request)
            if header is None:
                return None
            
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None
            token = raw_token.decode() 
            
        try:
            # Valida el token y obtiene el usuario asociado
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)
            return user, validated_token
        except Exception as e:
            # Si hay algún error en la validación, devuelve None (no autenticado)
            return None
    
    def get_user(self, validated_token):
        """
        Obtiene el usuario asociado con un token JWT validado.
        
        Args:
            validated_token: Token JWT ya validado que contiene el ID del usuario
            
        Returns:
            Instancia del modelo Usuario correspondiente al ID en el token
            
        Raises:
            InvalidToken: Si el token no contiene un ID de usuario
            AuthenticationFailed: Si no se encuentra el usuario o está inactivo
        """
        try:
            usuario_id = validated_token['usuario_id']
        except KeyError:
            raise InvalidToken(_('El token no contiene información de identificación de usuario reconocible'))

        try:
            # Busca el usuario y verifica que esté activo
            usuario = Usuario.objects.get(id=usuario_id, activo=True)
            return usuario
        except Usuario.DoesNotExist:
            raise AuthenticationFailed(_('Usuario no encontrado o inactivo'), code='user_not_found')
