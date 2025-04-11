from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('investigators.urls')),  

    # Endpoints de OpenAPI 3
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Opcional: UI de Swagger
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Opcional: UI de ReDoc (alternativa a Swagger)
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]