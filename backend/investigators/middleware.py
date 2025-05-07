from .models import Usuario
from .authentication import UsuarioJWTAuthentication

class UsuarioMiddleware:
    """
    Middleware personalizado que procesa cada solicitud HTTP para extraer y verificar
    la autenticación del usuario mediante tokens JWT.
    
    Este middleware permite que todas las vistas de la aplicación tengan acceso al
    usuario autenticado a través de request.usuario sin necesidad de implementar
    lógica de autenticación en cada vista.
    """
    def __init__(self, get_response):
        """
        Inicializa el middleware con el siguiente middleware o vista en la cadena.
        También crea una instancia del autenticador JWT que se usará para verificar tokens.
        
        Args:
            get_response: El siguiente middleware o la vista final que procesará la solicitud
        """
        self.get_response = get_response
        self.jwt_auth = UsuarioJWTAuthentication()

    def __call__(self, request):
        """
        Método principal que se ejecuta en cada solicitud HTTP.
        
        Este método:
        1. Intenta autenticar al usuario mediante JWT
        2. Si tiene éxito, adjunta el usuario a la solicitud como request.usuario
        3. Actualiza el tiempo de último acceso del usuario
        4. Continúa con el procesamiento normal de la solicitud
        
        Si la autenticación falla, la solicitud continúa pero request.usuario será None.
        
        Args:
            request: Objeto de solicitud HTTP de Django
            
        Returns:
            La respuesta HTTP generada por el siguiente middleware o vista
        """
        request.usuario = None
        
        try:
            # Intenta autenticar al usuario usando JWT
            auth_result = self.jwt_auth.authenticate(request)
            if auth_result:
                usuario, token = auth_result
                request.usuario = usuario
                
                # Actualiza el tiempo de último acceso si el método está disponible
                if hasattr(usuario, 'actualizar_ultimo_acceso'):
                    usuario.actualizar_ultimo_acceso()
        except Exception as e:
            # Si hay algún error en la autenticación, continúa sin usuario (anónimo)
            pass
        
        # Procesa la solicitud con el siguiente middleware o vista
        response = self.get_response(request)
        return response
