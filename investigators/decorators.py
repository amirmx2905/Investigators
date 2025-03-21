from django.shortcuts import redirect
from functools import wraps
from .models import Usuario

def login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if 'usuario_id' not in request.session:
            return redirect('login')
        
        try:
            # Verificar que el usuario existe y está activo
            usuario = Usuario.objects.get(id=request.session['usuario_id'])
            if not usuario.activo:
                # Si el usuario fue desactivado, limpiar sesión
                request.session.flush()
                return redirect('login')
        except Usuario.DoesNotExist:
            # Si el usuario no existe, limpiar sesión
            request.session.flush()
            return redirect('login')
        
        # Usuario autenticado, continuar a la vista
        return view_func(request, *args, **kwargs)
    
    return wrapper