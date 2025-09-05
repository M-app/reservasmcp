FROM node:lts
WORKDIR /app

# Copiar solo los manifests primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias sin dev
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

ENV PORT=8080
EXPOSE 8080
CMD ["node","src/server.js"]
