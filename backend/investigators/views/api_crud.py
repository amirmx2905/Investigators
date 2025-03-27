from rest_framework import viewsets
from investigators.models import (
    Investigador,
    Usuario,
    Proyecto,
    Area,
    Especialidad, 
    NivelEducacion,
    NivelSNII,
    SNII,
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
    SNIISerializer,
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

# ViewSets pal buen CRUD
class InvestigadorViewSet(viewsets.ModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer

class NivelEducacionViewSet(viewsets.ModelViewSet):
    queryset = NivelEducacion.objects.all()
    serializer_class = NivelEducacionSerializer

class NivelSNIIViewSet(viewsets.ModelViewSet):
    queryset = NivelSNII.objects.all()
    serializer_class = NivelSNIISerializer

class SNIIViewSet(viewsets.ModelViewSet):
    queryset = SNII.objects.all()
    serializer_class = SNIISerializer

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer

class TipoEstudianteViewSet(viewsets.ModelViewSet):
    queryset = TipoEstudiante.objects.all()
    serializer_class = TipoEstudianteSerializer

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

class LineaViewSet(viewsets.ModelViewSet):
    queryset = Linea.objects.all()
    serializer_class = LineaSerializer

class TipoHerramientaViewSet(viewsets.ModelViewSet):
    queryset = TipoHerramienta.objects.all()
    serializer_class = TipoHerramientaSerializer

class HerramientaViewSet(viewsets.ModelViewSet):
    queryset = Herramienta.objects.all()
    serializer_class = HerramientaSerializer

class ArticuloViewSet(viewsets.ModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer

class TipoEventoViewSet(viewsets.ModelViewSet):
    queryset = TipoEvento.objects.all()
    serializer_class = TipoEventoSerializer

class RolEventoViewSet(viewsets.ModelViewSet):
    queryset = RolEvento.objects.all()
    serializer_class = RolEventoSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

class UnidadViewSet(viewsets.ModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer

class JefeAreaViewSet(viewsets.ModelViewSet):
    queryset = JefeArea.objects.all()
    serializer_class = JefeAreaSerializer