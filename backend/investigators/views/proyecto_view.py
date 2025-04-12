from django.db import models
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view

from investigators.models import Proyecto
from investigators.serializers import ProyectoSerializer, HerramientaSerializer
from investigators.permissions import IsInvestigadorOrReadOnly
from investigators.views.base_view import OrderedModelViewSet

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