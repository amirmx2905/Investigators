from django.urls import path
from .views.api_view import investigadores_list, usuarios_list, proyectos_list

urlpatterns = [
    path('api/proyectos/', proyectos_list, name='proyectos_list'),  # Nueva ruta para proyectos
    path('api/usuarios/', usuarios_list, name='usuarios_list'),  # Nueva ruta para usuarios
    path('api/investigadores/', investigadores_list, name='investigadores_list'),
]