from django.core.management.base import BaseCommand
from investigators.models import Investigador
from investigators.views.puntaje_view import PuntajeInvestigadorViewSet

class Command(BaseCommand):
    help = 'Calcula y actualiza los puntajes de todos los investigadores'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando cálculo de puntajes...'))
        
        # Obtener todos los investigadores activos
        investigadores = Investigador.objects.filter(activo=True)
        total = investigadores.count()
        
        self.stdout.write(f'Procesando {total} investigadores activos')
        
        # Calcular puntajes para cada investigador
        view = PuntajeInvestigadorViewSet()
        for i, investigador in enumerate(investigadores, 1):
            view._calcular_puntaje_investigador(investigador)
            self.stdout.write(f'Procesado {i}/{total}: {investigador.nombre}')
        
        self.stdout.write(self.style.SUCCESS('Puntajes actualizados correctamente'))
