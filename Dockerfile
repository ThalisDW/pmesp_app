# Imagem unificada (Northflank free tier: 1 serviço só).
# Compila o frontend Vue e o backend Nuxt; o Nitro serve a API em /api e o SPA no resto.
# docker-compose continua usando backend/Dockerfile e frontend/Dockerfile separados.

FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# Vazio = mesma origem (API em /api no próprio host)
ENV VITE_API_URL=
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=backend /app/.output /app/.output
COPY --from=frontend /frontend/dist /app/spa

ENV NODE_ENV=production
ENV PORT=4000
ENV NITRO_HOST=0.0.0.0
ENV SPA_DIR=/app/spa

EXPOSE 4000

CMD ["node", ".output/server/index.mjs"]
