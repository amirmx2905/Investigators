from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view

from investigators.models import (
    PuntajeInvestigador, Investigador, Estudiante, 
    DetLinea, Linea, Proyecto, DetProyecto, 
    Articulo, DetArticulo, DetEvento, Evento
)
from investigators.serializers.puntaje_serializer import PuntajeInvestigadorSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los puntajes", tags=["Puntajes"]),
    retrieve=extend_schema(summary="Obtener puntaje por ID", tags=["Puntajes"]),
    create=extend_schema(summary="Crear nuevo puntaje", tags=["Puntajes"]),
    update=extend_schema(summary="Actualizar puntaje completo", tags=["Puntajes"]),
    partial_update=extend_schema(summary="Actualizar puntaje parcial", tags=["Puntajes"]),
    destroy=extend_schema(summary="Eliminar puntaje", tags=["Puntajes"])
)
class PuntajeInvestigadorViewSet(OrderedModelViewSet):
    queryset = PuntajeInvestigador.objects.all()
    serializer_class = PuntajeInvestigadorSerializer
    
    @extend_schema(
        summary="Recalcular todos los puntajes",
        description="Recalcula los puntajes de todos los investigadores activos",
        tags=["Puntajes"]
    )
    @action(detail=False, methods=['post'])
    def recalcular_todos(self, request):
        # Obtenemos todos los investigadores activos
        investigadores = Investigador.objects.filter(activo=True)
        
        for investigador in investigadores:
            self._calcular_puntaje_investigador(investigador)
        
        return Response({"status": "Puntajes recalculados con éxito"}, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Recalcular puntaje de un investigador",
        description="Recalcula el puntaje de un investigador específico",
        tags=["Puntajes"]
    )
    @action(detail=True, methods=['post'])
    def recalcular(self, request, pk=None):
        investigador = self.get_object().investigador
        self._calcular_puntaje_investigador(investigador)
        
        return Response({"status": "Puntaje recalculado con éxito"}, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Obtener resumen por área",
        description="Obtiene un resumen de puntajes agrupados por área",
        tags=["Puntajes"]
    )
    @action(detail=False, methods=['get'])
    def resumen_por_area(self, request):
        # Implementación para obtener resumen por área
        areas = {}
        
        for puntaje in PuntajeInvestigador.objects.select_related('investigador__area').all():
            area_nombre = puntaje.investigador.area.nombre
            area_id = puntaje.investigador.area.id
            
            if area_id not in areas:
                areas[area_id] = {
                    'id': area_id,
                    'nombre': area_nombre,
                    'puntos_totales': 0,
                    'puntos_estudiantes_maestria': 0,
                    'puntos_estudiantes_doctorado': 0,
                    'puntos_lineas_investigacion': 0,
                    'puntos_proyectos': 0,
                    'puntos_articulos': 0,
                    'puntos_eventos': 0,
                    'investigadores': 0
                }
            
            areas[area_id]['puntos_totales'] += puntaje.puntos_totales
            areas[area_id]['puntos_estudiantes_maestria'] += puntaje.puntos_estudiantes_maestria
            areas[area_id]['puntos_estudiantes_doctorado'] += puntaje.puntos_estudiantes_doctorado
            areas[area_id]['puntos_lineas_investigacion'] += puntaje.puntos_lineas_investigacion
            areas[area_id]['puntos_proyectos'] += puntaje.puntos_proyectos
            areas[area_id]['puntos_articulos'] += puntaje.puntos_articulos
            areas[area_id]['puntos_eventos'] += puntaje.puntos_eventos
            areas[area_id]['investigadores'] += 1
        
        return Response(list(areas.values()))
    
    @extend_schema(
        summary="Obtener estadísticas por categoría",
        description="Obtiene estadísticas detalladas para una categoría específica, agrupadas por área",
        tags=["Puntajes"]
    )
    @action(detail=False, methods=['get'])
    def stats_por_categoria(self, request):
        categoria = request.query_params.get('categoria', 'total')
        
        # Mapeo de categorías a campos de puntaje
        campo_puntaje = {
            'estudiantes_maestria': 'puntos_estudiantes_maestria',
            'estudiantes_doctorado': 'puntos_estudiantes_doctorado',
            'lineas': 'puntos_lineas_investigacion',
            'proyectos': 'puntos_proyectos',
            'articulos': 'puntos_articulos',
            'eventos': 'puntos_eventos',
            'total': 'puntos_totales'
        }
        
        # Verificar que la categoría sea válida
        if categoria not in campo_puntaje:
            return Response(
                {"error": f"Categoría inválida. Opciones válidas: {', '.join(campo_puntaje.keys())}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Datos agrupados por área
        datos_por_area = {}
        
        # Para cada puntaje, obtener el investigador y su área
        for puntaje in PuntajeInvestigador.objects.select_related('investigador__area').all():
            area_nombre = puntaje.investigador.area.nombre
            area_id = puntaje.investigador.area.id
            
            if area_id not in datos_por_area:
                datos_por_area[area_id] = {
                    'id': area_id,
                    'nombre': area_nombre,
                    'investigadores': []
                }
            
            # Agregar datos del investigador
            datos_por_area[area_id]['investigadores'].append({
                'id': puntaje.investigador.id,
                'nombre': puntaje.investigador.nombre,
                'puntaje': getattr(puntaje, campo_puntaje[categoria])
            })
        
        # Convertir el diccionario a una lista
        resultado = []
        for area_id, area_data in datos_por_area.items():
            # Ordenar investigadores por puntaje (de mayor a menor)
            area_data['investigadores'].sort(key=lambda x: x['puntaje'], reverse=True)
            resultado.append(area_data)
        
        # Ordenar áreas por cantidad de investigadores
        resultado.sort(key=lambda x: len(x['investigadores']), reverse=True)
        
        return Response(resultado)
    
    def _calcular_puntaje_investigador(self, investigador):
        """
        Calcula y guarda el puntaje de un investigador según los criterios establecidos
        """
        # Inicializar puntajes
        puntos_estudiantes_maestria = 0
        puntos_estudiantes_doctorado = 0
        puntos_lineas_investigacion = 0
        puntos_proyectos = 0
        puntos_articulos = 0
        puntos_eventos = 0
        
        # 1. Calcular puntos por estudiantes de maestría
        estudiantes_maestria = Estudiante.objects.filter(
            investigador=investigador,
            tipo_estudiante__nombre__icontains='Maestría'
        )
        
        for estudiante in estudiantes_maestria:
            if estudiante.activo:
                puntos_estudiantes_maestria += 1
            elif estudiante.estatus == 'Desertor':
                puntos_estudiantes_maestria += 2
            elif estudiante.estatus == 'Egresado':
                puntos_estudiantes_maestria += 3
            elif estudiante.estatus == 'Titulado':
                puntos_estudiantes_maestria += 5
        
        # 2. Calcular puntos por estudiantes de doctorado
        estudiantes_doctorado = Estudiante.objects.filter(
            investigador=investigador,
            tipo_estudiante__nombre__icontains='Doctorado'
        )
        
        for estudiante in estudiantes_doctorado:
            if estudiante.activo:
                puntos_estudiantes_doctorado += 1
            elif estudiante.estatus == 'Desertor':
                puntos_estudiantes_doctorado += 3
            elif estudiante.estatus == 'Egresado':
                puntos_estudiantes_doctorado += 5
            elif estudiante.estatus == 'Titulado':
                puntos_estudiantes_doctorado += 8
        
        # 3. Calcular puntos por líneas de investigación con reconocimiento institucional
        lineas_reconocidas = DetLinea.objects.filter(
            investigador=investigador,
            linea__reconocimiento_institucional=True
        ).count()
        
        puntos_lineas_investigacion = lineas_reconocidas * 5
        
        # 4. Calcular puntos por proyectos
        proyectos_liderados = Proyecto.objects.filter(lider=investigador)
        
        for proyecto in proyectos_liderados:
            if proyecto.estado == 'En Proceso':
                puntos_proyectos += 3
            elif proyecto.estado == 'Terminado':
                puntos_proyectos += 7
            elif proyecto.estado == 'Instalado en Sitio':
                puntos_proyectos += 10
        
        # 5. Calcular puntos por artículos
        articulos_participados = DetArticulo.objects.filter(investigador=investigador)
        
        for det_articulo in articulos_participados:
            articulo = det_articulo.articulo
            
            # Verificar si es el primer autor
            es_primer_autor = det_articulo.orden_autor == 1
            
            if es_primer_autor:
                if articulo.estado == 'En Proceso':
                    puntos_articulos += 3
                elif articulo.estado == 'Terminado':
                    puntos_articulos += 5
                elif articulo.estado == 'En Revista':
                    puntos_articulos += 7
                elif articulo.estado == 'Publicado':
                    puntos_articulos += 10
            else:
                # Si no es el primer autor, siempre son 3 puntos
                puntos_articulos += 3
        
        # 6. Calcular puntos por eventos
        eventos_participados = DetEvento.objects.filter(investigador=investigador)
        
        for det_evento in eventos_participados:
            evento = det_evento.evento
            tipo_evento = evento.tipo_evento.nombre if evento.tipo_evento else ""
            rol_evento = det_evento.rol_evento.nombre if det_evento.rol_evento else ""
            
            if tipo_evento == "Congreso" and "Ponente" in rol_evento:
                puntos_eventos += 3
            elif tipo_evento == "Taller":
                puntos_eventos += 1
            elif tipo_evento == "Conferencia" and "Ponente" in rol_evento:
                puntos_eventos += 5
            elif tipo_evento == "Diplomado":
                puntos_eventos += 3
            elif tipo_evento == "Charla":
                puntos_eventos += 1
            else:
                puntos_eventos += 1  # Punto por cualquier otro tipo de evento
        
        # Calcular puntaje total
        puntos_totales = (
            puntos_estudiantes_maestria +
            puntos_estudiantes_doctorado +
            puntos_lineas_investigacion +
            puntos_proyectos +
            puntos_articulos +
            puntos_eventos
        )
        
        # Guardar o actualizar el registro de puntaje
        puntaje, created = PuntajeInvestigador.objects.update_or_create(
            investigador=investigador,
            defaults={
                'puntos_estudiantes_maestria': puntos_estudiantes_maestria,
                'puntos_estudiantes_doctorado': puntos_estudiantes_doctorado,
                'puntos_lineas_investigacion': puntos_lineas_investigacion,
                'puntos_proyectos': puntos_proyectos,
                'puntos_articulos': puntos_articulos,
                'puntos_eventos': puntos_eventos,
                'puntos_totales': puntos_totales
            }
        )
        
        return puntaje
