from rest_framework import permissions
from django.db.models import Q
from investigators.models import DetEvento, DetArticulo

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
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            if hasattr(request, 'usuario') and request.usuario:
                return request.usuario.rol in ['admin', 'investigador']
                
        return True
        
    def has_object_permission(self, request, view, obj):
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
            
        if (hasattr(request, 'usuario') and request.usuario and 
            request.usuario.rol == 'investigador' and request.usuario.investigador):
            return DetArticulo.objects.filter(
                articulo=obj,
                investigador=request.usuario.investigador
            ).exists()
            
        return False
    
class CanManageEventosPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.method == 'POST':
            if hasattr(request, 'usuario') and request.usuario:
                return request.usuario.rol in ['admin', 'investigador']
                
        return True
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
            
        if hasattr(request, 'usuario') and request.usuario and request.usuario.rol == 'admin':
            return True
            
        if (hasattr(request, 'usuario') and request.usuario and 
            request.usuario.rol == 'investigador' and request.usuario.investigador):
            return DetEvento.objects.filter(
                evento=obj, 
                investigador=request.usuario.investigador
            ).exists()
            
        return False