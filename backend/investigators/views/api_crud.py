from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from investigators.models import (
    Investigador, Usuario, Proyecto, Area, Especialidad, 
    NivelEducacion, NivelSNII, Carrera, TipoEstudiante, 
    Estudiante, Linea, TipoHerramienta, Herramienta, 
    Articulo, TipoEvento, RolEvento, Evento, Unidad, JefeArea
)
from investigators.serializers import (
    InvestigadorSerializer, UsuarioSerializer, ProyectoSerializer,
    AreaSerializer, EspecialidadSerializer, NivelEducacionSerializer,
    NivelSNIISerializer, CarreraSerializer, TipoEstudianteSerializer,
    EstudianteSerializer, LineaSerializer, TipoHerramientaSerializer, 
    HerramientaSerializer, ArticuloSerializer, TipoEventoSerializer,
    RolEventoSerializer, EventoSerializer, UnidadSerializer,
    JefeAreaSerializer
)
from investigators.permissions import IsAdminOrReadOnly, IsInvestigadorOrReadOnly, IsOwnerOrAdmin

# ViewSet base con ordenamiento
class OrderedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        # Obtiene el queryset original
        queryset = super().get_queryset()
        # Aplica ordenamiento por ID si el modelo tiene este campo
        if hasattr(queryset.model, 'id'):
            return queryset.order_by('id')
        return queryset

# ViewSets para el CRUD con ordenamiento por ID
class InvestigadorViewSet(OrderedModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer

class UsuarioViewSet(OrderedModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_queryset(self):
        # Primero obtenemos todos los usuarios
        queryset = Usuario.objects.all()
        # Aplicamos prefetch_related y luego ordenamos por ID
        return queryset.prefetch_related('investigador', 'estudiante').order_by('id')
    
    # Endpoint para obtener el usuario actual
    @action(detail=False, methods=['get'], permission_classes=[])
    def me(self, request):
        if hasattr(request, 'usuario') and request.usuario:
            serializer = self.get_serializer(request.usuario)
            return Response(serializer.data)
        return Response(
            {"detail": "No se encontró perfil de usuario para esta cuenta."}, 
            status=status.HTTP_404_NOT_FOUND
        )

class ProyectoViewSet(OrderedModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsInvestigadorOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Si el usuario no es admin, ver solo los proyectos en los que participa
        if hasattr(self.request, 'usuario') and self.request.usuario and self.request.usuario.rol != 'admin':
            try:
                if self.request.usuario.rol == 'investigador' and self.request.usuario.investigador:
                    investigador = self.request.usuario.investigador
                    # Filtrar proyectos donde el usuario es líder o investigador
                    return queryset.filter(
                        models.Q(lider=investigador) | 
                        models.Q(detproyecto__investigador=investigador)
                    ).distinct()
            except:
                return queryset.none()
        return queryset

class AreaViewSet(OrderedModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class EspecialidadViewSet(OrderedModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer

class NivelEducacionViewSet(OrderedModelViewSet):
    queryset = NivelEducacion.objects.all()
    serializer_class = NivelEducacionSerializer

class NivelSNIIViewSet(OrderedModelViewSet):
    queryset = NivelSNII.objects.all()
    serializer_class = NivelSNIISerializer

class CarreraViewSet(OrderedModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer

class TipoEstudianteViewSet(OrderedModelViewSet):
    queryset = TipoEstudiante.objects.all()
    serializer_class = TipoEstudianteSerializer

class EstudianteViewSet(OrderedModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

class LineaViewSet(OrderedModelViewSet):
    queryset = Linea.objects.all()
    serializer_class = LineaSerializer

class TipoHerramientaViewSet(OrderedModelViewSet):
    queryset = TipoHerramienta.objects.all()
    serializer_class = TipoHerramientaSerializer

class HerramientaViewSet(OrderedModelViewSet):
    queryset = Herramienta.objects.all()
    serializer_class = HerramientaSerializer

class ArticuloViewSet(OrderedModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer
    permission_classes = [IsInvestigadorOrReadOnly, IsOwnerOrAdmin]

class TipoEventoViewSet(OrderedModelViewSet):
    queryset = TipoEvento.objects.all()
    serializer_class = TipoEventoSerializer

class RolEventoViewSet(OrderedModelViewSet):
    queryset = RolEvento.objects.all()
    serializer_class = RolEventoSerializer

class EventoViewSet(OrderedModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [IsInvestigadorOrReadOnly, IsOwnerOrAdmin]

class UnidadViewSet(OrderedModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer

class JefeAreaViewSet(OrderedModelViewSet):
    queryset = JefeArea.objects.all()
    serializer_class = JefeAreaSerializer