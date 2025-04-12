FROM nginxinc/nginx-unprivileged:stable-alpine

# Actualizar paquetes e instalar dependencias
USER root
RUN apk update && apk upgrade

# Crear directorio para los certificados SSL (para futuras implementaciones)
RUN mkdir -p /etc/nginx/ssl

# Copiar la configuración
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

# Volver al usuario no-root
USER 101

# Nginx no privilegiado usa el puerto 8080 por defecto
EXPOSE 8080
EXPOSE 8443

CMD ["nginx", "-g", "daemon off;"]