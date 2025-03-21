"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from investigators.views import login_view, home_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', login_view, name='login'),  # La vista de login será la raíz (/)
    path('home/', home_view, name='home'),  # La vista de home estará en /home
    path('', include('investigators.urls')),  # Incluye las URLs de la app
]