from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import (
    Usuario, Investigador, Estudiante, Proyecto, 
    Articulo, DetArticulo, DetEvento, Evento, DetLinea, Linea
)
from .views.puntaje_view import PuntajeInvestigadorViewSet

# Esta señal se activa después de guardar un nuevo usuario en el sistema Django
# Su propósito es crear automáticamente un perfil de Usuario personalizado
# cuando se registra un nuevo usuario en el sistema, asociándolo con un investigador existente
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Crea automáticamente un perfil de Usuario para investigadores registrados.
    Cuando se crea un usuario nuevo en Django, busca si existe un investigador
    con el mismo correo electrónico y crea un perfil de usuario asociado.
    """
    if created:  # Solo ejecutar cuando se crea un usuario nuevo, no al actualizar
        try:
            # Intenta encontrar un investigador con el mismo correo
            investigador = Investigador.objects.get(correo=instance.email)
            # Crea un perfil de usuario asociado al investigador encontrado
            Usuario.objects.create(
                nombre_usuario=instance.username,
                user=instance,
                rol='investigador',
                investigador=investigador
            )
        except Investigador.DoesNotExist:
            # Si no existe un investigador con ese correo, no hace nada
            pass

# Esta señal se activa cuando se crea, actualiza o elimina un estudiante
# Recalcula el puntaje del investigador asociado, ya que los estudiantes
# aportan puntos a la evaluación del investigador
@receiver([post_save, post_delete], sender=Estudiante)
def actualizar_puntaje_estudiante(sender, instance, **kwargs):
    """
    Actualiza el puntaje de un investigador cuando hay cambios en sus estudiantes.
    Los investigadores reciben puntos según los estudiantes que dirigen.
    Se ejecuta cuando un estudiante es creado, modificado o eliminado.
    """
    if instance.investigador:
        # Crea instancia del viewset y llama al método para calcular puntajes
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

# Esta señal se activa cuando se modifica la relación entre investigadores y líneas de investigación
# Las líneas de investigación también aportan al puntaje del investigador
@receiver([post_save, post_delete], sender=DetLinea)
def actualizar_puntaje_linea(sender, instance, **kwargs):
    """
    Actualiza el puntaje cuando un investigador se asocia o desasocia de una línea de investigación.
    DetLinea es la tabla intermedia que relaciona investigadores con líneas de investigación.
    Se ejecuta cuando se crea o elimina esta relación.
    """
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

# Esta señal se activa cuando se modifica una línea de investigación
# Si cambia el reconocimiento de la línea, afecta a todos los investigadores asociados
@receiver([post_save], sender=Linea)
def actualizar_puntaje_cambio_linea(sender, instance, **kwargs):
    """
    Actualiza los puntajes de todos los investigadores asociados cuando cambia una línea de investigación.
    Es particularmente importante cuando cambia el estado de 'reconocimiento_institucional' de la línea,
    ya que esto puede afectar los puntos de todos los investigadores vinculados.
    """
    view = PuntajeInvestigadorViewSet()
    # Busca todas las relaciones entre esta línea e investigadores y actualiza cada uno
    for det_linea in instance.detlinea_set.all():
        view._calcular_puntaje_investigador(det_linea.investigador)

# Esta señal se activa cuando se crea, actualiza o elimina un proyecto
# Los proyectos aportan al puntaje del investigador líder
@receiver([post_save, post_delete], sender=Proyecto)
def actualizar_puntaje_proyecto(sender, instance, **kwargs):
    """
    Actualiza el puntaje cuando hay cambios en los proyectos liderados por un investigador.
    Solo actualiza el puntaje del líder del proyecto, no de todos los participantes.
    """
    if instance.lider:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.lider)

# Esta señal se activa cuando se modifica la relación entre investigadores y artículos
@receiver([post_save, post_delete], sender=DetArticulo)
def actualizar_puntaje_articulo(sender, instance, **kwargs):
    """
    Actualiza el puntaje cuando un investigador se asocia o desasocia de un artículo científico.
    DetArticulo es la tabla intermedia que relaciona investigadores con artículos.
    La posición del autor (orden_autor) también puede influir en los puntos asignados.
    """
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

# Esta señal se activa cuando se modifica un artículo científico
# Si cambia el estado del artículo (ej: de "En Proceso" a "Publicado"), 
# se deben recalcular los puntajes de todos los autores
@receiver([post_save], sender=Articulo)
def actualizar_puntaje_cambio_articulo(sender, instance, **kwargs):
    """
    Actualiza el puntaje de todos los investigadores asociados cuando cambia un artículo.
    Es especialmente relevante cuando cambia el estado del artículo (ej: de "En Revista" a "Publicado"),
    ya que esto puede modificar significativamente los puntos asignados.
    """
    # Obtiene todos los investigadores relacionados con este artículo
    for det_articulo in instance.detarticulo_set.all():
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(det_articulo.investigador)

# Esta señal se activa cuando se modifica la relación entre investigadores y eventos
@receiver([post_save, post_delete], sender=DetEvento)
def actualizar_puntaje_evento(sender, instance, **kwargs):
    """
    Actualiza el puntaje cuando un investigador se asocia o desasocia de un evento académico.
    DetEvento es la tabla intermedia que relaciona investigadores con eventos.
    El rol del investigador en el evento (organizador, ponente, etc.) puede influir en los puntos.
    """
    if instance.investigador:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance.investigador)

# Esta señal se activa cuando se crea o actualiza un investigador
# Asegura que todos los investigadores tengan un puntaje calculado
@receiver([post_save], sender=Investigador)
def crear_puntaje_investigador(sender, instance, created, **kwargs):
    """
    Crea o actualiza el puntaje cuando se crea o modifica un investigador.
    Garantiza que cada investigador activo tenga un registro de puntaje actualizado.
    Este cálculo considera todas las contribuciones: estudiantes, proyectos, artículos, etc.
    """
    if instance.activo:
        view = PuntajeInvestigadorViewSet()
        view._calcular_puntaje_investigador(instance)
