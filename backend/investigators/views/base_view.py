from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.permissions import IsAdminOrReadOnly

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