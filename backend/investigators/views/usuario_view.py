from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse

from investigators.models import Usuario
from investigators.serializers import UsuarioSerializer
from investigators.views.base_view import OrderedModelViewSet

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