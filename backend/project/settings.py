from pathlib import Path
# Importa load_dotenv para cargar variables de entorno desde un archivo .env
from dotenv import load_dotenv
# Importa timedelta para definir períodos de tiempo en la configuración de JWT
from datetime import timedelta
import os

# Autores:
# Alan Omar Hernández Bella,
# Amir Sebastián Flores Cardona

# Notas:
# 1. En el archivo token_view.py, cambiar la linea 50 y 77 a true para producción

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# Define la ruta base del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Clave secreta para cifrado y seguridad (obtenida de variables de entorno)
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key')

# Modo de depuración (desactivar en producción)
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Hosts permitidos para acceder a la aplicación
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Aplicaciones instaladas en el proyecto
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'investigators',  # Aplicación principal
    'rest_framework',  # Framework para API REST
    'corsheaders',  # Manejo de CORS
    'drf_spectacular',  # Documentación de API
]

# Middleware: componentes que procesan las peticiones/respuestas
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Manejo de solicitudes CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'investigators.middleware.UsuarioMiddleware',  # Middleware personalizado
]

# Configuración de seguridad para CORS (Cross-Origin Resource Sharing)
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True

# Configuración de REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'investigators.authentication.UsuarioJWTAuthentication',  # Autenticación JWT personalizada
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Por defecto requiere autenticación
    ],
    'DEFAULT_PAGINATION_CLASS': 'investigators.pagination.CustomPageNumberPagination',
    'PAGE_SIZE': 10,  # Elementos por página
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',  # Generación de esquema OpenAPI
}

# Configuración de JWT (JSON Web Tokens)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  # Duración del token de acceso
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Duración del token de refresco
    'ROTATE_REFRESH_TOKENS': True,  # Rotar tokens de refresco
    'BLACKLIST_AFTER_ROTATION': True,  # Invalidar tokens antiguos
    'UPDATE_LAST_LOGIN': True,  # Actualizar último acceso
    
    'ALGORITHM': 'HS256',  # Algoritmo de firma
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),  # Formato de cabecera de autorización
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'usuario_id',  # Campo para identificar al usuario
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

# Configuración de la documentación de la API (drf-spectacular)
SPECTACULAR_SETTINGS = {
    'TITLE': 'Investigators API',
    'DESCRIPTION': 'API para conectar investigadores y facilitar la colaboración en proyectos',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': False,
    },
}

# Configuración de URLs
ROOT_URLCONF = 'project.urls'

# Configuración de plantillas
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Aplicación para servidor WSGI
WSGI_APPLICATION = 'project.wsgi.application'

# Configuración de la base de datos (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.getenv('DB_NAME', 'investigators'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Validadores de contraseñas para aumentar la seguridad
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Backends de autenticación
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Configuración de internacionalización
LANGUAGE_CODE = 'en-us'
TIME_ZONE = os.getenv('TIME_ZONE', 'UTC')  # Zona horaria
USE_I18N = True
USE_TZ = True

# Configuración de archivos estáticos
STATIC_URL = 'static/'

# Tipo de campo ID predeterminado
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Métodos HTTP permitidos para CORS
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Cabeceras HTTP permitidas para CORS
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Límites de tamaño para carga de archivos (10MB)
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760 
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760
