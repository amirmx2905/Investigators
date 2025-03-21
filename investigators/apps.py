from django.apps import AppConfig

class InvestigatorsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'investigators'

    def ready(self):
        import investigators.signals