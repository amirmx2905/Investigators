FROM python:alpine

# Instalar dependencias del sistema necesarias para psycopg2 y otras bibliotecas
RUN apk update && apk upgrade && \
    apk add --no-cache postgresql-dev gcc python3-dev musl-dev

# Crear un usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY --chown=appuser:appgroup . .

# Cambiar al usuario no-root
USER appuser

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]