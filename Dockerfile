FROM node:lts
WORKDIR /app

# Copiar solo los manifests primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias sin dev
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

ENV NODE_ENV=production
# Railway inyecta PORT; tu app ya lo usa o 4000 por defecto
EXPOSE 4000

CMD ["npm","start"]
