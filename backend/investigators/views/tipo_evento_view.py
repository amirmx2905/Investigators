from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import TipoEvento, Evento
from investigators.serializers import TipoEventoSerializer
from investigators.views.base_view import OrderedModelViewSet

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