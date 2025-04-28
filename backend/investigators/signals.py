from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import (
    Usuario, Investigador, Estudiante, Proyecto, 
    Articulo, DetArticulo, DetEvento, Evento, DetLinea, Linea
)
from .views.puntaje_view import PuntajeInvestigadorViewSet

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        try:
            investigador = Investigador.objects.get(correo=instance.email)
            Usuario.objects.create(
                nombre_usuario=instance.username,
                user=instance,
                rol='investigador',
                investigador=investigador
            )
        except Investigador.DoesNotExist:
            pass

@receiver([post_save, post_delete], sender=Estudiante)
def actualizar_puntaje_estudiante(sender, instance, **kwargs):
    """Actualiza el puntaje cuando hay cambios en estudiantes"""
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

@receiver([post_save, post_delete], sender=DetLinea)
def actualizar_puntaje_linea(sender, instance, **kwargs):
    """Actualiza el puntaje cuando hay cambios en las líneas de investigación"""
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

@receiver([post_save], sender=Linea)
def actualizar_puntaje_cambio_linea(sender, instance, **kwargs):
    """Actualiza los puntajes cuando cambia el reconocimiento de una línea"""
    view = PuntajeInvestigadorViewSet()
    # Actualizar puntajes de todos los investigadores asociados a esta línea
    for det_linea in instance.detlinea_set.all():
        view._calcular_puntaje_investigador(det_linea.investigador)

@receiver([post_save, post_delete], sender=Proyecto)
def actualizar_puntaje_proyecto(sender, instance, **kwargs):
    """Actualiza el puntaje cuando hay cambios en proyectos"""
    if instance.lider:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.lider)

@receiver([post_save, post_delete], sender=DetArticulo)
def actualizar_puntaje_articulo(sender, instance, **kwargs):
    """Actualiza el puntaje cuando hay cambios en la participación en artículos"""
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

@receiver([post_save], sender=Articulo)
def actualizar_puntaje_cambio_articulo(sender, instance, **kwargs):
    """Actualiza el puntaje cuando cambia el estado de un artículo"""
    # Obtener todos los investigadores relacionados con este artículo
    for det_articulo in instance.detarticulo_set.all():
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(det_articulo.investigador)

@receiver([post_save, post_delete], sender=DetEvento)
def actualizar_puntaje_evento(sender, instance, **kwargs):
    """Actualiza el puntaje cuando hay cambios en la participación en eventos"""
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

@receiver([post_save], sender=Investigador)
def crear_puntaje_investigador(sender, instance, created, **kwargs):
    """Crea o actualiza el puntaje cuando se crea o modifica un investigador"""
    if instance.activo:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance)
