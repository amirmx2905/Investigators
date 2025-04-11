from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from investigators.models import Investigador, Evento, Articulo
from investigators.serializers import InvestigadorSerializer, EventoSerializer, ArticuloSerializer, InvestigadorDetalleSerializer
from investigators.views.base_view import OrderedModelViewSet

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