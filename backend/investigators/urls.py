from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.token_view import CustomTokenObtainView, TokenRefreshView, TokenLogoutView
from .views.api_crud import (
    InvestigadorViewSet, UsuarioViewSet, ProyectoViewSet,
    AreaViewSet, EspecialidadViewSet, NivelEducacionViewSet,
    NivelSNIIViewSet, CarreraViewSet,
    TipoEstudianteViewSet, EstudianteViewSet, LineaViewSet,
    TipoHerramientaViewSet, HerramientaViewSet, ArticuloViewSet,
    TipoEventoViewSet, RolEventoViewSet, EventoViewSet, UnidadViewSet,
    JefeAreaViewSet
)

# Router para las vistas del api_crud
router = DefaultRouter()
router.register(r'investigadores', InvestigadorViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'proyectos', ProyectoViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'niveleducacion', NivelEducacionViewSet)
router.register(r'nivelsnii', NivelSNIIViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'tiposestudiante', TipoEstudianteViewSet)
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'lineas', LineaViewSet)
router.register(r'tiposherramienta', TipoHerramientaViewSet)
router.register(r'herramientas', HerramientaViewSet)
router.register(r'articulos', ArticuloViewSet)
router.register(r'tiposeventos', TipoEventoViewSet)
router.register(r'roleseventos', RolEventoViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'unidades', UnidadViewSet)
router.register(r'jefesareas', JefeAreaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', CustomTokenObtainView.as_view(), name='custom_token_obtain'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/logout/', TokenLogoutView.as_view(), name='token_logout'),
]