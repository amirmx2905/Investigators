FROM nginxinc/nginx-unprivileged:stable-alpine

# Actualizar paquetes e instalar dependencias
USER root
RUN apk update && apk upgrade

# Crear directorio para los certificados SSL (para futuras implementaciones)
RUN mkdir -p /etc/nginx/ssl

# Crear directorio para PID con permisos adecuados
RUN mkdir -p /tmp/nginx && \
    chmod 777 /tmp/nginx

# Modificar el archivo de configuración principal para cambiar la ubicación del PID
RUN sed -i 's|pid.*|pid /tmp/nginx/nginx.pid;|' /etc/nginx/nginx.conf

# Copiar la configuración
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

# Volver al usuario no-root
USER 101

# Nginx no privilegiado usa el puerto 8080 por defecto
EXPOSE 8080
EXPOSE 8443

# Usar una configuración simplificada que no define el PID nuevamente
CMD ["nginx", "-g", "daemon off;"]
