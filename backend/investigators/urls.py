from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InvestigadorViewSet, 
    UsuarioViewSet,
    ProyectoViewSet,
    AreaViewSet,
    EspecialidadViewSet,
    NivelEducacionViewSet,
    NivelSNIIViewSet,
    CarreraViewSet,
    TipoEstudianteViewSet,
    EstudianteViewSet,
    LineaViewSet,
    TipoHerramientaViewSet,
    HerramientaViewSet,
    ArticuloViewSet,
    TipoEventoViewSet,
    RolEventoViewSet, 
    EventoViewSet, 
    UnidadViewSet,
    JefeAreaViewSet, 
    CustomTokenObtainView, 
    TokenRefreshView, 
    TokenLogoutView,
    PuntajeInvestigadorViewSet,
)
from .views.import_view import JSONImportView

# Router para crear automáticamente URLs para las vistas basadas en ViewSets
router = DefaultRouter(trailing_slash=True)

router.register(r'investigadores', InvestigadorViewSet)  # Endpoints para gestionar investigadores
router.register(r'usuarios', UsuarioViewSet)  # Endpoints para gestionar usuarios del sistema
router.register(r'proyectos', ProyectoViewSet)  # Endpoints para gestionar proyectos de investigación
router.register(r'areas', AreaViewSet)  # Endpoints para gestionar áreas de conocimiento
router.register(r'especialidades', EspecialidadViewSet)  # Endpoints para gestionar especialidades
router.register(r'niveleducacion', NivelEducacionViewSet)  # Endpoints para niveles educativos
router.register(r'nivelsnii', NivelSNIIViewSet)  # Endpoints para niveles del Sistema Nacional de Investigadores
router.register(r'carreras', CarreraViewSet)  # Endpoints para gestionar carreras académicas
router.register(r'tiposestudiante', TipoEstudianteViewSet)  # Endpoints para tipos de estudiantes
router.register(r'estudiantes', EstudianteViewSet)  # Endpoints para gestionar estudiantes
router.register(r'lineas', LineaViewSet)  # Endpoints para líneas de investigación
router.register(r'tiposherramienta', TipoHerramientaViewSet)  # Endpoints para categorías de herramientas
router.register(r'herramientas', HerramientaViewSet)  # Endpoints para gestionar herramientas
router.register(r'articulos', ArticuloViewSet)  # Endpoints para gestionar artículos científicos
router.register(r'tiposeventos', TipoEventoViewSet)  # Endpoints para tipos de eventos académicos
router.register(r'roleseventos', RolEventoViewSet)  # Endpoints para roles en eventos
router.register(r'eventos', EventoViewSet)  # Endpoints para gestionar eventos
router.register(r'unidades', UnidadViewSet)  # Endpoints para unidades académicas
router.register(r'jefesareas', JefeAreaViewSet)  # Endpoints para jefes de área
router.register(r'puntajes', PuntajeInvestigadorViewSet)  # Endpoints para puntajes de investigadores

# Patrones de URL para la aplicación
urlpatterns = [
    path('api/', include(router.urls)),  # Incluye todas las rutas generadas por el router
    path('api/token/', CustomTokenObtainView.as_view(), name='token_obtain'),  # Endpoint para obtener token de autenticación
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para refrescar token expirado
    path('api/token/logout/', TokenLogoutView.as_view(), name='token_logout'),  # Endpoint para cerrar sesión (invalidar token)
    path('api/import-json/', JSONImportView.as_view(), name='import-json'),  # Endpoint para importar datos desde JSON
]
