from rest_framework import viewsets
from investigators.models import (
    Investigador,
    Usuario,
    Proyecto,
    Area,
    Especialidad, 
    NivelEducacion,
    NivelSNII,
    Carrera,
    TipoEstudiante, 
    Estudiante,
    Linea,
    TipoHerramienta,
    Herramienta, 
    Articulo,
    TipoEvento,
    RolEvento,
    Evento,
    Unidad,
    JefeArea
)
from investigators.serializers import (
    InvestigadorSerializer,
    UsuarioSerializer,
    ProyectoSerializer,
    AreaSerializer,
    EspecialidadSerializer,
    NivelEducacionSerializer,
    NivelSNIISerializer,
    CarreraSerializer,
    TipoEstudianteSerializer,
    EstudianteSerializer,
    LineaSerializer,
    TipoHerramientaSerializer, 
    HerramientaSerializer,
    ArticuloSerializer,
    TipoEventoSerializer,
    RolEventoSerializer,
    EventoSerializer,
    UnidadSerializer,
    JefeAreaSerializer
)
# Esto es pa que sigan un orden explicito en el CRUD
class OrderedModelViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # Obtiene el queryset original
        queryset = super().get_queryset()
        # Aplica ordenamiento por ID
        return queryset.order_by('id')

# ViewSets pal buen CRUD con ordenamiento por ID
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
    
class ProyectoViewSet(OrderedModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

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

class TipoEventoViewSet(OrderedModelViewSet):
    queryset = TipoEvento.objects.all()
    serializer_class = TipoEventoSerializer

class RolEventoViewSet(OrderedModelViewSet):
    queryset = RolEvento.objects.all()
    serializer_class = RolEventoSerializer

class EventoViewSet(OrderedModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

class UnidadViewSet(OrderedModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer

class JefeAreaViewSet(OrderedModelViewSet):
    queryset = JefeArea.objects.all()
    serializer_class = JefeAreaSerializer