from django.db import models
from django.utils import timezone
import datetime

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
    nivel = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"{self.nivel}"
    
    class Meta:
        verbose_name_plural = "Niveles de Educación"

class NivelSNII(models.Model):
    nivel = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nivel
    
    class Meta:
        verbose_name_plural = "Niveles SNII"

class Carrera(models.Model):
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
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
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE, null=True, blank=True)
    nivel_snii = models.ForeignKey(NivelSNII, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_asignacion_snii = models.DateField(null=True, blank=True)
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
        return f"{self.investigador} - Jefe de {self.area}"
    
    class Meta:
        verbose_name_plural = "Jefes de Área"

class Estudiante(models.Model):
    ESTATUS_CHOICES = [
        ('Desertor', 'Desertor'),
        ('Egresado', 'Egresado'),
        ('Titulado', 'Titulado'),
    ]
    
    tipo_estudiante = models.ForeignKey(TipoEstudiante, on_delete=models.CASCADE)
    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, null=True, blank=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    area = models.ForeignKey(Area, on_delete=models.CASCADE, null=True, blank=True)
    escuela = models.CharField(max_length=100, null=True, blank=True)
    fecha_inicio = models.DateField()
    fecha_termino = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    estatus = models.CharField(max_length=50, choices=ESTATUS_CHOICES, null=True, blank=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Estudiantes"

class Linea(models.Model):
    nombre = models.CharField(max_length=100)
    reconocimiento_institucional = models.BooleanField(default=False)
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
    ESTADO_CHOICES = [
        ('En Proceso', 'En Proceso'),
        ('Terminado', 'Terminado'),
        ('En Revista', 'En Revista'),
        ('Publicado', 'Publicado'),
    ]
    
    nombre_articulo = models.CharField(max_length=200)
    nombre_revista = models.CharField(max_length=100, blank=True, null=True)  # Modificado aquí
    abstracto = models.TextField(blank=True, null=True)
    pais_publicacion = models.CharField(max_length=100)
    fecha_publicacion = models.DateField()
    doi = models.CharField(max_length=100, blank=True, null=True)
    url = models.URLField(max_length=200, blank=True, null=True)
    estatus = models.BooleanField(default=True)
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='En Proceso')
    investigadores = models.ManyToManyField(Investigador, through='DetArticulo')
    
    def __str__(self):
        return self.nombre_articulo
    
    @property
    def ano_publicacion(self):
        if self.fecha_publicacion:
            return self.fecha_publicacion.year
        return None
    
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
    ROLES = (
        ('admin', 'Administrador'),
        ('investigador', 'Investigador'),
        ('estudiante', 'Estudiante'),
    )
    
    nombre_usuario = models.CharField(max_length=50, unique=True, default="usuario_temporal")
    contrasena = models.CharField(max_length=255, null=True, blank=True)
    rol = models.CharField(max_length=15, choices=ROLES)
    investigador = models.ForeignKey('Investigador', on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')
    estudiante = models.ForeignKey('Estudiante', on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)
    intentos_login = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_usuario
    
    class Meta:
        verbose_name_plural = "Usuarios"
    
    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.contrasena)
    
    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.contrasena = make_password(raw_password)
    
    def actualizar_ultimo_acceso(self):
        self.ultimo_acceso = timezone.now()
        self.save(update_fields=['ultimo_acceso'])
    
    def incrementar_intentos_login(self):
        self.intentos_login += 1
        if self.intentos_login >= 5:
            self.activo = False
        self.save(update_fields=['intentos_login', 'activo'])
    
    def resetear_intentos_login(self):
        if self.intentos_login > 0:
            self.intentos_login = 0
            self.save(update_fields=['intentos_login'])
    
    def get_nombre(self):
        if self.rol == 'investigador' and self.investigador:
            return self.investigador.nombre
        elif self.rol == 'estudiante' and self.estudiante:
            return self.estudiante.nombre
        return self.nombre_usuario
    
    def get_correo(self):
        if self.rol == 'investigador' and self.investigador:
            return self.investigador.correo
        elif self.rol == 'estudiante' and self.estudiante:
            return self.estudiante.correo
        return None
    
    @property
    def is_anonymous(self):
        return False
    
    @property
    def is_authenticated(self):
        return True
        
    @property
    def is_staff(self):
        return self.rol == 'admin'
    
    @property
    def is_active(self):
        return self.activo
    
    def get_username(self):
        return self.nombre_usuario
    
    @property
    def username(self):
        return self.nombre_usuario
    
    def has_perm(self, perm, obj=None):
        return self.is_staff
    
    def has_module_perms(self, app_label):
        return self.is_staff
    
    def get_all_permissions(self, obj=None):
        if self.is_staff:
            return {'*'}
        return set()

class PuntajeInvestigador(models.Model):
    investigador = models.OneToOneField(Investigador, on_delete=models.CASCADE, related_name='puntaje')
    puntos_estudiantes_maestria = models.IntegerField(default=0)
    puntos_estudiantes_doctorado = models.IntegerField(default=0)
    puntos_lineas_investigacion = models.IntegerField(default=0)
    puntos_proyectos = models.IntegerField(default=0)
    puntos_articulos = models.IntegerField(default=0)
    puntos_eventos = models.IntegerField(default=0)
    puntos_totales = models.IntegerField(default=0)
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Puntaje de {self.investigador.nombre}"
    
    class Meta:
        verbose_name_plural = "Puntajes de Investigadores"
