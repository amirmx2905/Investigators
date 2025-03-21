from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.cache import cache_control
from investigators.models import Usuario

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def login_view(request):
    # Si el usuario ya está autenticado, redirigir al home
    if 'usuario_id' in request.session:
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            # Busca al usuario en la base de datos
            usuario = Usuario.objects.get(nombre_usuario=username)

            # Verifica la contraseña
            if usuario.check_password(password):
                if usuario.activo:
                    # Almacena los datos del usuario en la sesión
                    request.session['usuario_id'] = usuario.id
                    request.session['usuario_nombre'] = usuario.nombre_usuario
                    return redirect('home')
                else:
                    messages.error(request, 'La cuenta está desactivada. Contacte al administrador.')
            else:
                messages.error(request, 'Credenciales inválidas. Por favor, inténtelo de nuevo.')
        except Usuario.DoesNotExist:
            messages.error(request, 'Credenciales inválidas. Por favor, inténtelo de nuevo.')

    return render(request, 'login.html')