from .models import Usuario

class UsuarioMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.usuario = None
        if 'usuario_id' in request.session:
            try:
                request.usuario = Usuario.objects.get(id=request.session['usuario_id'])
            except Usuario.DoesNotExist:
                pass
        
        response = self.get_response(request)
        return response