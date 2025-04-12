from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from investigators.models import Evento, DetEvento, Investigador, TipoEvento, RolEvento
from investigators.serializers import EventoSerializer
from investigators.permissions import CanManageEventosPermission
from investigators.views.base_view import OrderedModelViewSet

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