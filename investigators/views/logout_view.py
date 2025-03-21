from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages

def logout_view(request):
    """
    Vista para cerrar la sesión del usuario actual.
    Redirecciona a la página de login después de cerrar sesión.
    """
    logout(request)
    messages.success(request, 'Has cerrado sesión correctamente.')
    return redirect('login')