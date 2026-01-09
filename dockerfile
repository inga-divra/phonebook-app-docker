# ---------- frontend build ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


# ---------- backend build ----------
FROM node:20-alpine AS backend-build
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend .


# ---------- production ----------
FROM nginx:1.25-alpine

COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=backend-build /app/backend /app/backend

RUN apk add --no-cache nodejs npm

WORKDIR /app/backend

EXPOSE 8080
CMD sh -c "node index.js & nginx -g 'daemon off;'"
