from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import RolEvento, DetEvento
from investigators.serializers import RolEventoSerializer
from investigators.views.base_view import OrderedModelViewSet

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