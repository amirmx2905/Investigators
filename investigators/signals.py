from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Usuario, Investigador

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        try:
            investigador = Investigador.objects.get(correo=instance.email)
            Usuario.objects.create(
                nombre_usuario=instance.username,
                user=instance,
                rol='investigador',
                id_investigador=investigador.id
            )
        except Investigador.DoesNotExist:
            pass