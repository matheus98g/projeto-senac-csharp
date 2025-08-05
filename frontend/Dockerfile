# Dockerfile de desenvolvimento para React + Vite usando npm

FROM node:20-alpine AS base
WORKDIR /app

# Instala dependências do projeto usando npm
COPY package.json package-lock.json* ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 3000

# Comando padrão: inicia o servidor de desenvolvimento do Vite com hot reload
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]

