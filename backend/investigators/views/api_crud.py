from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models

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
    JefeAreaSerializer
)
from investigators.permissions import (
    IsAdminOrReadOnly, IsInvestigadorOrReadOnly, IsOwnerOrAdmin, 
    CanCreateArticuloPermission, CanManageEventosPermission
)

# ViewSet base con ordenamiento
class OrderedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if hasattr(queryset.model, 'id'):
            return queryset.order_by('id')
        return queryset

# ViewSets para el CRUD con ordenamiento por ID
class InvestigadorViewSet(OrderedModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer
    
    @action(detail=True, methods=['get'])
    def eventos(self, request, pk=None):
        """Obtener eventos en los que participa un investigador"""
        investigador = self.get_object()
        eventos = Evento.objects.filter(detevento__investigador=investigador)
        
        # Opcionalmente filtrar por rol
        rol_id = request.query_params.get('rol', None)
        if rol_id:
            eventos = eventos.filter(detevento__rol_evento_id=rol_id)
        
        page = self.paginate_queryset(eventos)
        if page is not None:
            serializer = EventoSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def articulos(self, request, pk=None):
        """Obtener artículos en los que participa un investigador"""
        investigador = self.get_object()
        articulos = Articulo.objects.filter(detarticulo__investigador=investigador)
        
        serializer = ArticuloSerializer(articulos, many=True)
        return Response(serializer.data)

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
    permission_classes = [CanCreateArticuloPermission]

class TipoEventoViewSet(OrderedModelViewSet):
    queryset = TipoEvento.objects.all()
    serializer_class = TipoEventoSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas por tipo de evento"""
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

class RolEventoViewSet(OrderedModelViewSet):
    queryset = RolEvento.objects.all()
    serializer_class = RolEventoSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas por rol de evento"""
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
        ).order_by('id')  # Cambiado a ordenamiento ascendente por ID
    
    @action(detail=True, methods=['get'])
    def investigadores(self, request, pk=None):
        """Obtener los investigadores de un evento con sus roles"""
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
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas sobre eventos"""
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
    
    @action(detail=False, methods=['get'])
    def años_disponibles(self, request):
        """Obtener los años disponibles para filtrado"""
        años = Evento.objects.dates('fecha_inicio', 'year').values_list('fecha_inicio__year', flat=True)
        return Response(sorted(list(set(años)), reverse=True))

class UnidadViewSet(OrderedModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer

class JefeAreaViewSet(OrderedModelViewSet):
    queryset = JefeArea.objects.all()
    serializer_class = JefeAreaSerializer