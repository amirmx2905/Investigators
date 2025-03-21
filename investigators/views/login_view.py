from django.shortcuts import render, redirect
from django.contrib import messages
from ..models import Usuario

def login_view(request):
    """
    Vista personalizada para manejar la autenticación de usuarios
    """
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            # Buscar el usuario por nombre_usuario
            usuario = Usuario.objects.get(nombre_usuario=username)
            
            # Verificar si la cuenta está activa
            if not usuario.activo:
                messages.error(request, 'Cuenta desactivada. Contacte al administrador.')
                return render(request, 'login.html')
            
            # Verificar la contraseña
            if usuario.check_password(password):
                # Autenticación exitosa
                request.session['usuario_id'] = usuario.id  # Almacenar ID en la sesión
                request.session['usuario_rol'] = usuario.rol  # Almacenar rol en la sesión
                
                # Actualizar último acceso y resetear intentos de login
                usuario.actualizar_ultimo_acceso()
                usuario.resetear_intentos_login()
                
                return redirect('home')  # Redirigir a la página principal
            else:
                # Contraseña incorrecta
                usuario.incrementar_intentos_login()
                
                if not usuario.activo:
                    messages.error(request, 'Su cuenta ha sido bloqueada por múltiples intentos fallidos.')
                else:
                    messages.error(request, f'Credenciales inválidas. Intento {usuario.intentos_login} de 5.')
        except Usuario.DoesNotExist:
            # Usuario no existe
            messages.error(request, 'Credenciales inválidas.')
    
    return render(request, 'login.html')

def logout_view(request):
    """
    Vista para cerrar sesión
    """
    if 'usuario_id' in request.session:
        del request.session['usuario_id']
    if 'usuario_rol' in request.session:
        del request.session['usuario_rol']
    
    request.session.flush()  # Limpiar toda la sesión
    
    return redirect('login')  # Redirigir a la página de login