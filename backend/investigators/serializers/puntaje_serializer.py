from rest_framework import serializers
from investigators.models import PuntajeInvestigador, Investigador

class PuntajeInvestigadorSerializer(serializers.ModelSerializer):
    nombre_investigador = serializers.CharField(source='investigador.nombre', read_only=True)
    area_nombre = serializers.CharField(source='investigador.area.nombre', read_only=True)
    
    class Meta:
        model = PuntajeInvestigador
        fields = [
            'id', 'investigador', 'nombre_investigador', 'area_nombre',
            'puntos_estudiantes_maestria', 'puntos_estudiantes_doctorado',
            'puntos_lineas_investigacion', 'puntos_proyectos', 
            'puntos_articulos', 'puntos_eventos', 'puntos_totales',
            'ultima_actualizacion'
        ]
