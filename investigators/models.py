from django.db import models
from django.contrib.auth.models import User

class Unidad(models.Model):
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Unidades"

class Area(models.Model):
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Áreas"

class Especialidad(models.Model):
    nombre_especialidad = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre_especialidad
    
    class Meta:
        verbose_name_plural = "Especialidades"

class NivelEducacion(models.Model):
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Nivel en {self.especialidad}"
    
    class Meta:
        verbose_name_plural = "Niveles de Educación"

class NivelSNII(models.Model):
    nivel = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nivel
    
    class Meta:
        verbose_name_plural = "Niveles SNII"

class SNII(models.Model):
    nivel_snii = models.ForeignKey(NivelSNII, on_delete=models.CASCADE)
    fecha_asignacion = models.DateField()
    
    def __str__(self):
        return f"{self.nivel_snii} ({self.fecha_asignacion})"
    
    class Meta:
        verbose_name_plural = "SNII"

class Carrera(models.Model):
    nombre = models.CharField(max_length=100)
    escuela = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.nombre} - {self.escuela}"
    
    class Meta:
        verbose_name_plural = "Carreras"

class TipoEstudiante(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Tipos de Estudiantes"

class Investigador(models.Model):
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    nivel_edu = models.ForeignKey(NivelEducacion, on_delete=models.CASCADE)
    snii = models.ForeignKey(SNII, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100)
    celular = models.CharField(max_length=20, blank=True, null=True)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Investigadores"

class JefeArea(models.Model):
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.investigador} - {self.area}"
    
    class Meta:
        verbose_name_plural = "Jefes de Área"

class Estudiante(models.Model):
    tipo_estudiante = models.ForeignKey(TipoEstudiante, on_delete=models.CASCADE)
    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_termino = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Estudiantes"

class Linea(models.Model):
    nombre = models.CharField(max_length=100)
    investigadores = models.ManyToManyField(Investigador, through='DetLinea')
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Líneas"

class DetLinea(models.Model):
    linea = models.ForeignKey(Linea, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('linea', 'investigador')

class TipoHerramienta(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Tipos de Herramientas"

class Herramienta(models.Model):
    nombre = models.CharField(max_length=100)
    tipo_herramienta = models.ForeignKey(TipoHerramienta, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Herramientas"

class Proyecto(models.Model):
    nombre = models.CharField(max_length=200)
    lider = models.ForeignKey(Investigador, on_delete=models.CASCADE, related_name='proyectos_liderados')
    estado = models.CharField(max_length=50)
    explicacion = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    investigadores = models.ManyToManyField(Investigador, through='DetProyecto')
    herramientas = models.ManyToManyField(Herramienta, through='DetHerramienta')
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Proyectos"

class DetProyecto(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    orden_importancia = models.IntegerField()
    
    class Meta:
        unique_together = ('proyecto', 'investigador')

class DetHerramienta(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    herramienta = models.ForeignKey(Herramienta, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('proyecto', 'herramienta')

class Articulo(models.Model):
    nombre_articulo = models.CharField(max_length=200)
    nombre_revista = models.CharField(max_length=100)
    abstracto = models.TextField(blank=True, null=True)
    pais_publicacion = models.CharField(max_length=100)
    ano_publicacion = models.IntegerField()
    fecha_publicacion = models.DateField()
    doi = models.CharField(max_length=100, blank=True, null=True)
    url = models.URLField(max_length=200, blank=True, null=True)
    estatus = models.BooleanField(default=True)
    investigadores = models.ManyToManyField(Investigador, through='DetArticulo')
    
    def __str__(self):
        return self.nombre_articulo
    
    class Meta:
        verbose_name_plural = "Artículos"

class DetArticulo(models.Model):
    articulo = models.ForeignKey(Articulo, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    orden_autor = models.IntegerField()
    
    class Meta:
        unique_together = ('articulo', 'investigador')

class TipoEvento(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Tipos de Eventos"

class RolEvento(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Roles de Evento"

class Evento(models.Model):
    tipo_evento = models.ForeignKey(TipoEvento, on_delete=models.CASCADE)
    nombre_evento = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    lugar = models.CharField(max_length=200)
    empresa_invita = models.CharField(max_length=100)
    investigadores = models.ManyToManyField(Investigador, through='DetEvento')
    
    def __str__(self):
        return self.nombre_evento
    
    class Meta:
        verbose_name_plural = "Eventos"

class DetEvento(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    rol_evento = models.ForeignKey(RolEvento, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('evento', 'investigador')

class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)  # Permite valores nulos por ahora
    investigador = models.OneToOneField(Investigador, on_delete=models.CASCADE)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)
    intentos_login = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Usuario de {self.investigador.nombre}"
    
    class Meta:
        verbose_name_plural = "Usuarios"