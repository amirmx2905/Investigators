from django.db import models
from django.utils import timezone
import datetime

class Unidad(models.Model):
    """
    Modelo que representa una unidad académica o institución.
    Ejemplo: Facultad, Centro de Investigación, etc.
    """
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Unidades"

class Area(models.Model):
    """
    Modelo que representa un área de conocimiento o departamento.
    Cada área pertenece a una unidad académica específica.
    """
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Áreas"

class Especialidad(models.Model):
    """
    Modelo que representa una especialidad académica o de investigación.
    Ejemplo: Inteligencia Artificial, Robótica, etc.
    """
    nombre_especialidad = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre_especialidad
    
    class Meta:
        verbose_name_plural = "Especialidades"

class NivelEducacion(models.Model):
    """
    Modelo que representa el nivel educativo de un investigador.
    Ejemplo: Licenciatura, Maestría, Doctorado, etc.
    """
    nivel = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"{self.nivel}"
    
    class Meta:
        verbose_name_plural = "Niveles de Educación"

class NivelSNII(models.Model):
    """
    Modelo que representa el nivel en el Sistema Nacional de Investigadores.
    Ejemplo: Candidato, Nivel I, Nivel II, etc.
    """
    nivel = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nivel
    
    class Meta:
        verbose_name_plural = "Niveles SNII"

class Carrera(models.Model):
    """
    Modelo que representa una carrera o programa académico.
    """
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Carreras"

class TipoEstudiante(models.Model):
    """
    Modelo que define el tipo de estudiante.
    Ejemplo: Servicio Social, Licenciatura, Maestría, Doctorado, etc.
    """
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Tipos de Estudiantes"

class Investigador(models.Model):
    """
    Modelo principal que representa a un investigador académico.
    Contiene información personal y profesional del investigador.
    """
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
    """
    Modelo que representa la asignación de un investigador como jefe de área.
    Registra el periodo durante el cual el investigador ocupa este cargo.
    """
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
    """
    Modelo que representa a un estudiante bajo la tutoría de un investigador.
    Incluye información académica y de contacto del estudiante.
    """
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
    """
    Modelo que representa una línea de investigación.
    Las líneas pueden tener reconocimiento institucional y están asociadas a investigadores.
    """
    nombre = models.CharField(max_length=100)
    reconocimiento_institucional = models.BooleanField(default=False)
    investigadores = models.ManyToManyField(Investigador, through='DetLinea')
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Líneas"

class DetLinea(models.Model):
    """
    Modelo intermedio (tabla de relación muchos a muchos) entre líneas de investigación e investigadores.
    Permite asociar investigadores a líneas de investigación específicas.
    """
    linea = models.ForeignKey(Linea, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('linea', 'investigador')

class TipoHerramienta(models.Model):
    """
    Modelo que clasifica los tipos de herramientas utilizadas en proyectos.
    Ejemplo: Software, Hardware, Metodología, etc.
    """
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Tipos de Herramientas"

class Herramienta(models.Model):
    """
    Modelo que representa una herramienta específica utilizada en proyectos de investigación.
    Cada herramienta pertenece a un tipo específico.
    """
    nombre = models.CharField(max_length=100)
    tipo_herramienta = models.ForeignKey(TipoHerramienta, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Herramientas"

class Proyecto(models.Model):
    """
    Modelo que representa un proyecto de investigación.
    Incluye detalles del proyecto, fechas, estado y relaciones con investigadores y herramientas.
    """
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
    """
    Modelo intermedio entre proyectos e investigadores.
    Almacena la relación y el orden de importancia del investigador en el proyecto.
    """
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    orden_importancia = models.IntegerField()
    
    class Meta:
        unique_together = ('proyecto', 'investigador')

class DetHerramienta(models.Model):
    """
    Modelo intermedio entre proyectos y herramientas.
    Relaciona las herramientas utilizadas en cada proyecto.
    """
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    herramienta = models.ForeignKey(Herramienta, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('proyecto', 'herramienta')

class Articulo(models.Model):
    """
    Modelo que representa un artículo científico o publicación académica.
    Contiene información bibliográfica y estado de publicación.
    """
    ESTADO_CHOICES = [
        ('En Proceso', 'En Proceso'),
        ('Terminado', 'Terminado'),
        ('En Revista', 'En Revista'),
        ('Publicado', 'Publicado'),
    ]
    
    nombre_articulo = models.CharField(max_length=200)
    nombre_revista = models.CharField(max_length=100, blank=True, null=True)
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
        """
        Propiedad calculada que extrae el año de la fecha de publicación.
        Útil para reportes y filtros por año.
        """
        if self.fecha_publicacion:
            return self.fecha_publicacion.year
        return None
    
    class Meta:
        verbose_name_plural = "Artículos"

class DetArticulo(models.Model):
    """
    Modelo intermedio entre artículos e investigadores.
    Registra el orden de los autores en el artículo, importante para determinar
    la contribución de cada investigador.
    """
    articulo = models.ForeignKey(Articulo, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    orden_autor = models.IntegerField()
    
    class Meta:
        unique_together = ('articulo', 'investigador')

class TipoEvento(models.Model): 
    """
    Modelo que clasifica los tipos de eventos académicos.
    Ejemplo: Conferencia, Congreso, Taller, Seminario, etc.
    """
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Tipos de Eventos"

class RolEvento(models.Model):
    """
    Modelo que define los roles que un investigador puede tener en un evento.
    Ejemplo: Organizador, Ponente, Asistente, etc.
    """
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Roles de Evento"

class Evento(models.Model):
    """
    Modelo que representa un evento académico o profesional.
    Incluye detalles del evento y su relación con investigadores.
    """
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
    """
    Modelo intermedio entre eventos e investigadores.
    Define el rol específico que un investigador tuvo en un evento particular.
    """
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    investigador = models.ForeignKey(Investigador, on_delete=models.CASCADE)
    rol_evento = models.ForeignKey(RolEvento, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('evento', 'investigador')

class Usuario(models.Model):
    """
    Modelo que representa a un usuario del sistema.
    Implementa funcionalidades básicas de autenticación y gestión de credenciales.
    Puede estar asociado a un investigador o estudiante según su rol.
    """
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
        """
        Verifica si la contraseña proporcionada coincide con la almacenada.
        Utiliza el sistema de hash de Django para seguridad.
        """
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.contrasena)
    
    def set_password(self, raw_password):
        """
        Establece una nueva contraseña, aplicando hash para seguridad.
        """
        from django.contrib.auth.hashers import make_password
        self.contrasena = make_password(raw_password)
    
    def actualizar_ultimo_acceso(self):
        """
        Actualiza la fecha y hora del último acceso del usuario.
        """
        self.ultimo_acceso = timezone.now()
        self.save(update_fields=['ultimo_acceso'])
    
    def incrementar_intentos_login(self):
        """
        Incrementa el contador de intentos fallidos de inicio de sesión.
        Desactiva la cuenta después de 5 intentos fallidos.
        """
        self.intentos_login += 1
        if self.intentos_login >= 5:
            self.activo = False
        self.save(update_fields=['intentos_login', 'activo'])
    
    def resetear_intentos_login(self):
        """
        Reinicia el contador de intentos fallidos de inicio de sesión.
        Se llama después de un inicio de sesión exitoso.
        """
        if self.intentos_login > 0:
            self.intentos_login = 0
            self.save(update_fields=['intentos_login'])
    
    def get_nombre(self):
        """
        Devuelve el nombre real del usuario según su rol.
        """
        if self.rol == 'investigador' and self.investigador:
            return self.investigador.nombre
        elif self.rol == 'estudiante' and self.estudiante:
            return self.estudiante.nombre
        return self.nombre_usuario
    
    def get_correo(self):
        """
        Devuelve el correo electrónico del usuario según su rol.
        """
        if self.rol == 'investigador' and self.investigador:
            return self.investigador.correo
        elif self.rol == 'estudiante' and self.estudiante:
            return self.estudiante.correo
        return None
    
    @property
    def is_anonymous(self):
        """
        Propiedad requerida por Django para sistemas de autenticación.
        """
        return False
    
    @property
    def is_authenticated(self):
        """
        Propiedad requerida por Django para sistemas de autenticación.
        """
        return True
        
    @property
    def is_staff(self):
        """
        Determina si el usuario tiene acceso al panel de administración.
        """
        return self.rol == 'admin'
    
    @property
    def is_active(self):
        """
        Determina si la cuenta del usuario está activa.
        """
        return self.activo
    
    def get_username(self):
        """
        Método requerido por Django para sistemas de autenticación.
        """
        return self.nombre_usuario
    
    @property
    def username(self):
        """
        Propiedad requerida por Django para sistemas de autenticación.
        """
        return self.nombre_usuario
    
    def has_perm(self, perm, obj=None):
        """
        Método para verificar si el usuario tiene un permiso específico.
        """
        return self.is_staff
    
    def has_module_perms(self, app_label):
        """
        Método para verificar si el usuario tiene permisos en un módulo específico.
        """
        return self.is_staff
    
    def get_all_permissions(self, obj=None):
        """
        Método para obtener todos los permisos del usuario.
        """
        if self.is_staff:
            return {'*'}
        return set()

class PuntajeInvestigador(models.Model):
    """
    Modelo que registra y calcula el puntaje de desempeño de un investigador.
    Considera diferentes aspectos como estudiantes dirigidos, proyectos, artículos, etc.
    """
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
