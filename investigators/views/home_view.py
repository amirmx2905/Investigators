from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required  # Esta decoración asegura que solo usuarios autenticados puedan acceder
def home_view(request):
    """
    Vista para la página principal después del inicio de sesión.
    Muestra un dashboard con información relevante para el investigador.
    """
    context = {
        'nombre_usuario': request.user.get_full_name() or request.user.username,
    }
    
    return render(request, 'home.html', context)