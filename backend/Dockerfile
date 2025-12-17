FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar
CMD ["node", "src/index.js"]

