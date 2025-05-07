from rest_framework import permissions
from django.db.models import Q
from investigators.models import DetEvento, DetArticulo

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso que permite lectura a cualquier usuario, pero solo los administradores
    pueden realizar operaciones de escritura (crear, actualizar, eliminar).
    
    Este permiso es útil para recursos que deben ser visibles para todos pero
    solo modificables por administradores.
    """
    def has_permission(self, request, view):
        # Permite operaciones de solo lectura (GET, HEAD, OPTIONS) a cualquier usuario
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para operaciones de escritura, verifica que sea un administrador
        return hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin'

class IsInvestigadorOrReadOnly(permissions.BasePermission):
    """
    Permiso que permite lectura a cualquier usuario, pero solo los investigadores
    o administradores pueden realizar operaciones de escritura.
    
    Este permiso es útil para recursos que cualquiera puede ver pero solo
    deben ser modificados por los roles adecuados.
    """
    def has_permission(self, request, view):
        # Permite operaciones de solo lectura a cualquier usuario
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Los administradores siempre tienen permisos
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
            
        # Los investigadores tienen permisos de escritura
        return (
            hasattr(request, 'usuario') and 
            request.usuario and 
            request.usuario.rol == 'investigador'
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso que verifica si el usuario es propietario del objeto o un administrador.
    
    Este permiso es más específico y trabaja a nivel de objeto individual. Permite que
    un usuario solo pueda modificar sus propios recursos, mientras que los
    administradores pueden modificar cualquier recurso.
    
    Se adapta a diferentes tipos de objetos (usuarios, investigadores, proyectos o artículos).
    """
    def has_object_permission(self, request, view, obj):
        # Los administradores siempre tienen permisos
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
        
        # Verifica si el objeto tiene un campo 'usuario' y si coincide con el usuario actual
        if hasattr(obj, 'usuario'):
            return obj.usuario == request.usuario
        
        # Verifica si el objeto tiene un campo 'investigador' y si coincide con el investigador del usuario
        elif hasattr(obj, 'investigador'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                request.usuario.investigador and  # Asegurarse de que tiene investigador asociado
                obj.investigador == request.usuario.investigador
            )
        
        # Verifica si el objeto tiene un campo 'lider' (para proyectos) y si coincide con el investigador del usuario
        elif hasattr(obj, 'lider'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                request.usuario.investigador and
                obj.lider == request.usuario.investigador
            )
        
        # Verifica si el objeto es un artículo y si el investigador está asociado a él
        elif hasattr(obj, 'detarticulo_set'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                request.usuario.investigador and
                DetArticulo.objects.filter(
                    articulo=obj,
                    investigador=request.usuario.investigador
                ).exists()
            )
            
        return False

class CanCreateArticuloPermission(permissions.BasePermission):
    """
    Permiso especializado para la creación y gestión de artículos científicos.
    
    Permite que tanto administradores como investigadores creen artículos, pero
    solo el autor del artículo o un administrador pueden modificarlo.
    """
    def has_permission(self, request, view):
        # Permite operaciones de lectura y creación a investigadores y administradores
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            if hasattr(request, 'usuario') and request.usuario:
                return request.usuario.rol in ['admin', 'investigador']
                
        return True
        
    def has_object_permission(self, request, view, obj):
        # Los administradores siempre tienen permisos sobre los artículos
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
            
        # Un investigador solo puede modificar un artículo si es uno de sus autores
        if (hasattr(request, 'usuario') and request.usuario and 
            request.usuario.rol == 'investigador' and request.usuario.investigador):
            return DetArticulo.objects.filter(
                articulo=obj,
                investigador=request.usuario.investigador
            ).exists()
            
        return False
    
class CanManageEventosPermission(permissions.BasePermission):
    """
    Permiso especializado para la gestión de eventos académicos.
    
    Permite que cualquier usuario pueda ver eventos, pero solo los organizadores
    (investigadores asociados al evento) o administradores pueden modificarlos.
    """
    def has_permission(self, request, view):
        # Cualquiera puede ver los eventos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Solo investigadores y administradores pueden crear eventos
        if request.method == 'POST':
            if hasattr(request, 'usuario') and request.usuario:
                return request.usuario.rol in ['admin', 'investigador']
                
        return True
    
    def has_object_permission(self, request, view, obj):
        # Cualquiera puede ver los eventos
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Los administradores pueden modificar cualquier evento
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
            
        # Un investigador solo puede modificar un evento si está asociado a él
        if (hasattr(request, 'usuario') and request.usuario and 
            request.usuario.rol == 'investigador' and request.usuario.investigador):
            return DetEvento.objects.filter(
                evento=obj, 
                investigador=request.usuario.investigador
            ).exists()
            
        return False
