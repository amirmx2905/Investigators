from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample, OpenApiResponse

from investigators.models import (
    Investigador, Usuario, Proyecto, Area, Especialidad, 
    NivelEducacion, NivelSNII, Carrera, TipoEstudiante, 
    Estudiante, Linea, TipoHerramienta, Herramienta, 
    Articulo, TipoEvento, RolEvento, Evento, Unidad, JefeArea,
    DetEvento
)
from investigators.serializers import (
    InvestigadorSerializer, UsuarioSerializer, ProyectoSerializer,
    AreaSerializer, EspecialidadSerializer, NivelEducacionSerializer,
    NivelSNIISerializer, CarreraSerializer, TipoEstudianteSerializer,
    EstudianteSerializer, LineaSerializer, TipoHerramientaSerializer, 
    HerramientaSerializer, ArticuloSerializer, TipoEventoSerializer,
    RolEventoSerializer, EventoSerializer, UnidadSerializer,
    JefeAreaSerializer, InvestigadorDetalleSerializer
)
from investigators.permissions import (
    IsAdminOrReadOnly, IsInvestigadorOrReadOnly, IsOwnerOrAdmin, 
    CanCreateArticuloPermission, CanManageEventosPermission
)

@extend_schema_view(
    list=extend_schema(summary="Listar todos los registros", description="Retorna una lista de registros ordenados por ID"),
    retrieve=extend_schema(summary="Obtener registro por ID", description="Retorna un registro específico por su ID"),
    create=extend_schema(summary="Crear nuevo registro", description="Crea un nuevo registro con los datos proporcionados"),
    update=extend_schema(summary="Actualizar registro completo", description="Actualiza todos los campos de un registro existente"),
    partial_update=extend_schema(summary="Actualizar registro parcialmente", description="Actualiza solo los campos proporcionados"),
    destroy=extend_schema(summary="Eliminar registro", description="Elimina un registro existente")
)
class OrderedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if hasattr(queryset.model, 'id'):
            return queryset.order_by('id')
        return queryset

# ViewSets para el CRUD con ordenamiento por ID
@extend_schema_view(
    list=extend_schema(summary="Listar todos los investigadores", tags=["Investigadores"]),
    retrieve=extend_schema(summary="Obtener investigador por ID", tags=["Investigadores"]),
    create=extend_schema(summary="Crear nuevo investigador", tags=["Investigadores"]),
    update=extend_schema(summary="Actualizar investigador completo", tags=["Investigadores"]),
    partial_update=extend_schema(summary="Actualizar investigador parcial", tags=["Investigadores"]),
    destroy=extend_schema(summary="Eliminar investigador", tags=["Investigadores"])
)
class InvestigadorViewSet(OrderedModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer
    
    @extend_schema(
        summary="Obtener eventos del investigador",
        description="Retorna todos los eventos en los que ha participado un investigador",
        parameters=[
            OpenApiParameter(name="rol", description="Filtrar por rol en evento", required=False, type=int)
        ],
        tags=["Investigadores"]
    )
    @action(detail=True, methods=['get'])
    def eventos(self, request, pk=None):
        investigador = self.get_object()
        eventos = Evento.objects.filter(detevento__investigador=investigador)
        
        rol_id = request.query_params.get('rol', None)
        if rol_id:
            eventos = eventos.filter(detevento__rol_evento_id=rol_id)
        
        page = self.paginate_queryset(eventos)
        if page is not None:
            serializer = EventoSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Obtener artículos del investigador",
        description="Retorna todos los artículos en los que ha participado un investigador",
        tags=["Investigadores"]
    )
    @action(detail=True, methods=['get'])
    def articulos(self, request, pk=None):
        investigador = self.get_object()
        articulos = Articulo.objects.filter(detarticulo__investigador=investigador)
        
        serializer = ArticuloSerializer(articulos, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Obtener detalle completo del investigador",
        description="Retorna información detallada del investigador incluyendo relaciones",
        tags=["Investigadores"]
    )
    @action(detail=True, methods=['get'])
    def detalle(self, request, pk=None):
        investigador = self.get_object()
        serializer = InvestigadorDetalleSerializer(investigador)
        return Response(serializer.data)

@extend_schema_view(
    list=extend_schema(summary="Listar todos los usuarios", tags=["Usuarios"]),
    retrieve=extend_schema(summary="Obtener usuario por ID", tags=["Usuarios"]),
    create=extend_schema(summary="Crear nuevo usuario", tags=["Usuarios"]),
    update=extend_schema(summary="Actualizar usuario completo", tags=["Usuarios"]),
    partial_update=extend_schema(summary="Actualizar usuario parcial", tags=["Usuarios"]),
    destroy=extend_schema(summary="Eliminar usuario", tags=["Usuarios"])
)
class UsuarioViewSet(OrderedModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_queryset(self):
        queryset = Usuario.objects.all()
        return queryset.prefetch_related('investigador', 'estudiante').order_by('id')
    
    @extend_schema(
        summary="Obtener usuario actual",
        description="Retorna los datos del usuario autenticado actualmente",
        tags=["Usuarios"],
        responses={
            200: UsuarioSerializer,
            404: OpenApiResponse(description="No se encontró perfil de usuario")
        }
    )
    @action(detail=False, methods=['get'], permission_classes=[], url_path='me', url_name='me')
    def me(self, request):
        if hasattr(request, 'usuario') and request.usuario:
            serializer = self.get_serializer(request.usuario)
            return Response(serializer.data)
        return Response(
            {"detail": "No se encontró perfil de usuario para esta cuenta."}, 
            status=status.HTTP_404_NOT_FOUND
        )

@extend_schema_view(
    list=extend_schema(summary="Listar todos los proyectos", tags=["Proyectos"]),
    retrieve=extend_schema(summary="Obtener proyecto por ID", tags=["Proyectos"]),
    create=extend_schema(summary="Crear nuevo proyecto", tags=["Proyectos"]),
    update=extend_schema(summary="Actualizar proyecto completo", tags=["Proyectos"]),
    partial_update=extend_schema(summary="Actualizar proyecto parcial", tags=["Proyectos"]),
    destroy=extend_schema(summary="Eliminar proyecto", tags=["Proyectos"])
)
class ProyectoViewSet(OrderedModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsInvestigadorOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        if hasattr(self.request, 'usuario') and self.request.usuario:
            if self.request.usuario.rol == 'admin':
                return queryset
            elif self.request.usuario.rol == 'investigador' and self.request.usuario.investigador:
                investigador = self.request.usuario.investigador
                return queryset.filter(
                    models.Q(lider=investigador) | 
                    models.Q(investigadores=investigador)
                ).distinct()
        
        return queryset
    
    @extend_schema(
        summary="Obtener herramientas del proyecto",
        description="Retorna todas las herramientas asociadas a un proyecto",
        tags=["Proyectos"]
    )
    @action(detail=True, methods=['get'])
    def herramientas(self, request, pk=None):
        proyecto = self.get_object()
        herramientas = proyecto.herramientas.all()
        serializer = HerramientaSerializer(herramientas, many=True)
        return Response(serializer.data)

@extend_schema_view(
    list=extend_schema(summary="Listar todas las áreas", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener área por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva área", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar área completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar área parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar área", tags=["Catálogos"])
)
class AreaViewSet(OrderedModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todas las especialidades", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener especialidad por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva especialidad", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar especialidad completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar especialidad parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar especialidad", tags=["Catálogos"])
)
class EspecialidadViewSet(OrderedModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los niveles de educación", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener nivel de educación por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo nivel de educación", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar nivel de educación completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar nivel de educación parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar nivel de educación", tags=["Catálogos"])
)
class NivelEducacionViewSet(OrderedModelViewSet):
    queryset = NivelEducacion.objects.all()
    serializer_class = NivelEducacionSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los niveles SNI", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener nivel SNI por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo nivel SNI", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar nivel SNI completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar nivel SNI parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar nivel SNI", tags=["Catálogos"])
)
class NivelSNIIViewSet(OrderedModelViewSet):
    queryset = NivelSNII.objects.all()
    serializer_class = NivelSNIISerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todas las carreras", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener carrera por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva carrera", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar carrera completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar carrera parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar carrera", tags=["Catálogos"])
)
class CarreraViewSet(OrderedModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los tipos de estudiante", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener tipo de estudiante por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo tipo de estudiante", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar tipo de estudiante completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar tipo de estudiante parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar tipo de estudiante", tags=["Catálogos"])
)
class TipoEstudianteViewSet(OrderedModelViewSet):
    queryset = TipoEstudiante.objects.all()
    serializer_class = TipoEstudianteSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los estudiantes", tags=["Estudiantes"]),
    retrieve=extend_schema(summary="Obtener estudiante por ID", tags=["Estudiantes"]),
    create=extend_schema(summary="Crear nuevo estudiante", tags=["Estudiantes"]),
    update=extend_schema(summary="Actualizar estudiante completo", tags=["Estudiantes"]),
    partial_update=extend_schema(summary="Actualizar estudiante parcial", tags=["Estudiantes"]),
    destroy=extend_schema(summary="Eliminar estudiante", tags=["Estudiantes"])
)
class EstudianteViewSet(OrderedModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todas las líneas de investigación", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener línea de investigación por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva línea de investigación", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar línea de investigación completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar línea de investigación parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar línea de investigación", tags=["Catálogos"])
)
class LineaViewSet(OrderedModelViewSet):
    queryset = Linea.objects.all()
    serializer_class = LineaSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los tipos de herramienta", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener tipo de herramienta por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo tipo de herramienta", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar tipo de herramienta completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar tipo de herramienta parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar tipo de herramienta", tags=["Catálogos"])
)
class TipoHerramientaViewSet(OrderedModelViewSet):
    queryset = TipoHerramienta.objects.all()
    serializer_class = TipoHerramientaSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todas las herramientas", tags=["Herramientas"]),
    retrieve=extend_schema(summary="Obtener herramienta por ID", tags=["Herramientas"]),
    create=extend_schema(summary="Crear nueva herramienta", tags=["Herramientas"]),
    update=extend_schema(summary="Actualizar herramienta completa", tags=["Herramientas"]),
    partial_update=extend_schema(summary="Actualizar herramienta parcial", tags=["Herramientas"]),
    destroy=extend_schema(summary="Eliminar herramienta", tags=["Herramientas"])
)
class HerramientaViewSet(OrderedModelViewSet):
    queryset = Herramienta.objects.all()
    serializer_class = HerramientaSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los artículos", tags=["Artículos"]),
    retrieve=extend_schema(summary="Obtener artículo por ID", tags=["Artículos"]),
    create=extend_schema(summary="Crear nuevo artículo", tags=["Artículos"]),
    update=extend_schema(summary="Actualizar artículo completo", tags=["Artículos"]),
    partial_update=extend_schema(summary="Actualizar artículo parcial", tags=["Artículos"]),
    destroy=extend_schema(summary="Eliminar artículo", tags=["Artículos"])
)
class ArticuloViewSet(OrderedModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer
    permission_classes = [CanCreateArticuloPermission]

@extend_schema_view(
    list=extend_schema(summary="Listar todos los tipos de evento", tags=["Eventos"]),
    retrieve=extend_schema(summary="Obtener tipo de evento por ID", tags=["Eventos"]),
    create=extend_schema(summary="Crear nuevo tipo de evento", tags=["Eventos"]),
    update=extend_schema(summary="Actualizar tipo de evento completo", tags=["Eventos"]),
    partial_update=extend_schema(summary="Actualizar tipo de evento parcial", tags=["Eventos"]),
    destroy=extend_schema(summary="Eliminar tipo de evento", tags=["Eventos"])
)
class TipoEventoViewSet(OrderedModelViewSet):
    queryset = TipoEvento.objects.all()
    serializer_class = TipoEventoSerializer
    
    @extend_schema(
        summary="Estadísticas por tipo de evento",
        description="Retorna el conteo de eventos por cada tipo",
        tags=["Estadísticas"]
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        tipos = TipoEvento.objects.all()
        result = []
        for tipo in tipos:
            count = Evento.objects.filter(tipo_evento=tipo).count()
            result.append({
                'id': tipo.id,
                'nombre': tipo.nombre,
                'eventos_count': count
            })
        return Response(result)

@extend_schema_view(
    list=extend_schema(summary="Listar todos los roles en eventos", tags=["Eventos"]),
    retrieve=extend_schema(summary="Obtener rol en evento por ID", tags=["Eventos"]),
    create=extend_schema(summary="Crear nuevo rol en evento", tags=["Eventos"]),
    update=extend_schema(summary="Actualizar rol en evento completo", tags=["Eventos"]),
    partial_update=extend_schema(summary="Actualizar rol en evento parcial", tags=["Eventos"]),
    destroy=extend_schema(summary="Eliminar rol en evento", tags=["Eventos"])
)
class RolEventoViewSet(OrderedModelViewSet):
    queryset = RolEvento.objects.all()
    serializer_class = RolEventoSerializer
    
    @extend_schema(
        summary="Estadísticas por rol en evento",
        description="Retorna el conteo de participaciones por cada rol",
        tags=["Estadísticas"]
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        roles = RolEvento.objects.all()
        result = []
        for rol in roles:
            count = DetEvento.objects.filter(rol_evento=rol).count()
            result.append({
                'id': rol.id,
                'nombre': rol.nombre,
                'participaciones': count
            })
        return Response(result)

@extend_schema_view(
    list=extend_schema(
        summary="Listar todos los eventos",
        parameters=[
            OpenApiParameter(name="tipo_evento", description="Filtrar por ID de tipo de evento", required=False, type=int),
            OpenApiParameter(name="year", description="Filtrar por año", required=False, type=int),
            OpenApiParameter(name="investigador", description="Filtrar por ID de investigador", required=False, type=int),
            OpenApiParameter(name="rol", description="Filtrar por ID de rol", required=False, type=int),
        ],
        tags=["Eventos"]
    ),
    retrieve=extend_schema(summary="Obtener evento por ID", tags=["Eventos"]),
    create=extend_schema(summary="Crear nuevo evento", tags=["Eventos"]),
    update=extend_schema(summary="Actualizar evento completo", tags=["Eventos"]),
    partial_update=extend_schema(summary="Actualizar evento parcial", tags=["Eventos"]),
    destroy=extend_schema(summary="Eliminar evento", tags=["Eventos"])
)
class EventoViewSet(OrderedModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [CanManageEventosPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre_evento', 'descripcion', 'lugar', 'empresa_invita']
    ordering_fields = ['id', 'fecha_inicio', 'fecha_fin', 'nombre_evento']
    ordering = ['id']
    
    def get_queryset(self):
        queryset = Evento.objects.all()
        
        tipo_evento_id = self.request.query_params.get('tipo_evento', None)
        if tipo_evento_id:
            queryset = queryset.filter(tipo_evento_id=tipo_evento_id)
        
        year = self.request.query_params.get('year', None)
        if year:
            queryset = queryset.filter(fecha_inicio__year=year)
        
        investigador_id = self.request.query_params.get('investigador', None)
        if investigador_id:
            queryset = queryset.filter(detevento__investigador_id=investigador_id)
        
        rol_evento_id = self.request.query_params.get('rol', None)
        if rol_evento_id:
            queryset = queryset.filter(detevento__rol_evento_id=rol_evento_id)
        
        if hasattr(self.request, 'usuario') and self.request.usuario and self.request.usuario.rol != 'admin':
            try:
                if self.request.usuario.rol == 'investigador' and self.request.usuario.investigador:
                    investigador = self.request.usuario.investigador
                    queryset = queryset.filter(detevento__investigador=investigador)
            except:
                return queryset.none()
        
        return queryset.distinct().prefetch_related(
            'tipo_evento', 
            'detevento_set__investigador',
            'detevento_set__rol_evento'
        ).order_by('id')
    
    @extend_schema(
        summary="Obtener investigadores participantes en evento",
        description="Retorna todos los investigadores que participan en un evento y su rol",
        tags=["Eventos"]
    )
    @action(detail=True, methods=['get'])
    def investigadores(self, request, pk=None):
        evento = self.get_object()
        detalle_eventos = DetEvento.objects.filter(evento=evento).select_related('investigador', 'rol_evento')
        
        result = []
        for det in detalle_eventos:
            result.append({
                'investigador_id': det.investigador.id,
                'nombre': det.investigador.nombre,
                'correo': det.investigador.correo,
                'rol_evento_id': det.rol_evento.id,
                'rol_nombre': det.rol_evento.nombre
            })
        
        return Response(result)
    
    @extend_schema(
        summary="Estadísticas generales de eventos",
        description="Retorna estadísticas generales sobre eventos, tipos y participación",
        tags=["Estadísticas"]
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_eventos = Evento.objects.count()
        eventos_por_tipo = Evento.objects.values('tipo_evento__nombre').annotate(
            count=models.Count('id')
        ).order_by('-count')
        
        eventos_por_anio = Evento.objects.annotate(
            anio=models.functions.ExtractYear('fecha_inicio')
        ).values('anio').annotate(
            count=models.Count('id')
        ).order_by('-anio')
        
        investigadores_activos = Investigador.objects.filter(
            id__in=DetEvento.objects.values('investigador_id').distinct()
        ).count()
        
        return Response({
            'total_eventos': total_eventos,
            'eventos_por_tipo': eventos_por_tipo,
            'eventos_por_anio': list(eventos_por_anio),
            'investigadores_activos': investigadores_activos
        })
    
    @extend_schema(
        summary="Obtener años con eventos",
        description="Retorna una lista de años que tienen eventos registrados",
        tags=["Eventos"]
    )
    @action(detail=False, methods=['get'])
    def años_disponibles(self, request):
        años = Evento.objects.dates('fecha_inicio', 'year').values_list('fecha_inicio__year', flat=True)
        return Response(sorted(list(set(años)), reverse=True))

@extend_schema_view(
    list=extend_schema(summary="Listar todas las unidades", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener unidad por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva unidad", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar unidad completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar unidad parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar unidad", tags=["Catálogos"])
)
class UnidadViewSet(OrderedModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer

@extend_schema_view(
    list=extend_schema(summary="Listar todos los jefes de área", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener jefe de área por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo jefe de área", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar jefe de área completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar jefe de área parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar jefe de área", tags=["Catálogos"])
)
class JefeAreaViewSet(OrderedModelViewSet):
    queryset = JefeArea.objects.all()
    serializer_class = JefeAreaSerializer