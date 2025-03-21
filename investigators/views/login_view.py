from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages

def login_view(request):
    """
    Vista para manejar la autenticación de usuarios mediante el sistema de autenticación de Django.
    Actualiza también el último acceso del perfil del investigador asociado.
    """
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                if hasattr(user, 'usuario'):
                    user.usuario.ultimo_acceso = timezone.now()
                    user.usuario.intentos_login = 0  
                    user.usuario.save() 
                return redirect('home')  # Cambiado de 'admin:index' a 'home'
            else:
                messages.error(request, 'Cuenta desactivada. Contacte al administrador.')
        else:
            try:
                from ..models import Usuario
                perfil = Usuario.objects.get(user__username=username)
                perfil.intentos_login += 1                
                if perfil.intentos_login >= 5:
                    perfil.activo = False
                    messages.error(request, 'Cuenta bloqueada por múltiples intentos fallidos.')
                else:
                    messages.error(request, 'Credenciales inválidas. Por favor, intente nuevamente.')
                
                perfil.save()
            except:
                messages.error(request, 'Credenciales inválidas. Por favor, intente nuevamente.')
            
        return render(request, 'login.html', {'username': username})
    
    return render(request, 'login.html')