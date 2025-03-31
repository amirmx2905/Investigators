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
                obj.investigador == request.usuario.investigador
            )
        elif hasattr(obj, 'lider'):
            return (
                hasattr(request, 'usuario') and 
                request.usuario and 
                request.usuario.rol == 'investigador' and 
                obj.lider == request.usuario.investigador
            )
            
        return False