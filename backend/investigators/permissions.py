from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin'

class IsInvestigadorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
            
        return (
            hasattr(request, 'usuario') and 
            request.usuario and 
            request.usuario.rol == 'investigador'
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
        
        if hasattr(obj, 'usuario'):
            return obj.usuario == request.usuario
        
        elif hasattr(obj, 'investigador'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                request.usuario.investigador and  # Asegurarse de que tiene investigador asociado
                obj.investigador == request.usuario.investigador
            )
        
        elif hasattr(obj, 'lider'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                request.usuario.investigador and
                obj.lider == request.usuario.investigador
            )
        
        elif hasattr(obj, 'investigadores') and hasattr(obj, 'investigadores_articulo'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                request.usuario.investigador and
                request.usuario.investigador.id in [inv.investigador.id for inv in obj.investigadores_articulo.all()]
            )
            
        return False

class CanCreateArticuloPermission(permissions.BasePermission):
    """
    Permiso personalizado para permitir la creación de artículos a investigadores y administradores
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
                return True
                
            if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'investigador':
                return True
                
        return False
        
    def has_object_permission(self, request, view, obj):
        return IsOwnerOrAdmin().has_object_permission(request, view, obj)