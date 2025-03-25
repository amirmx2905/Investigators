from django.urls import path
from .views.api_view import investigadores_list, usuarios_list, proyectos_list
from .views.token_view import CustomTokenObtainView


urlpatterns = [
    path('api/proyectos/', proyectos_list, name='proyectos_list'),
    path('api/usuarios/', usuarios_list, name='usuarios_list'),
    path('api/investigadores/', investigadores_list, name='investigadores_list'),
    path('api/token/', CustomTokenObtainView.as_view(), name='custom_token_obtain'),
]