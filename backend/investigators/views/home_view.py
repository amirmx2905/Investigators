from django.shortcuts import render
from django.views.decorators.cache import cache_control
from investigators.decorators import login_required

@login_required
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def home_view(request):
    return render(request, 'home.html', {'usuario_nombre': request.session['usuario_nombre']})