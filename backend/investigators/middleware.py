from .models import Usuario
from .authentication import UsuarioJWTAuthentication

class UsuarioMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_auth = UsuarioJWTAuthentication()

    def __call__(self, request):
        request.usuario = None
        
        try:
            auth_result = self.jwt_auth.authenticate(request)
            if auth_result:
                usuario, token = auth_result
                request.usuario = usuario
        except Exception:
            pass
        
        response = self.get_response(request)
        return response