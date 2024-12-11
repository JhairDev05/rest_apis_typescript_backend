# Para crear un Docker Image para el backend con Node 

# Usamos la imagen oficial de Node.js
FROM node:22-bullseye

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de package.json y package-lock.json (si existe) primero para optimizar la caché de Docker
# COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código fuente, el primer punto es "desde la fuente" el segundo es "hacia el destino"
COPY . .

# Compilamos el código TypeScript a JavaScript (esto generará los archivos en la carpeta dist)
RUN npm run build

# Exponemos el puerto 4000 para el contenedor
EXPOSE 4000

# Ejecutamos la aplicación con el script 'start', que ahora ejecuta el código compilado
CMD [ "npm", "start" ]



# ----------------------------- PERO VAN EN ARCHIVOS DIFERENTES --------------------------------

# ------------------ Para subir una base de datos -----------------------

# Usamos la imagen oficial de MongoDB
FROM mongo:6.0

# Copiamos un archivo de configuración opcional (si lo necesitas)
COPY mongo.conf /etc/mongo/mongod.conf

# Exponemos el puerto predeterminado de MongoDB
EXPOSE 27017

# Comando para iniciar MongoDB
CMD ["mongod"]



# ------------------- Para subir un frontend con React -------------------------
# Etapa 1: Construcción
FROM node:20 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos necesarios
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos la aplicación
RUN npm run build

# Etapa 2: Servir los archivos estáticos con Nginx
FROM nginx:alpine

# Copiamos los archivos estáticos al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
