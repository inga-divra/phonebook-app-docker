# ---------- frontend build ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


# ---------- backend build ----------
FROM node:20-alpine AS backend-build
WORKDIR /app

# install backend deps from ROOT package.json 
COPY package*.json ./
RUN npm install

# copy backend source
COPY backend ./backend


# ---------- production ----------
FROM nginx:1.25-alpine

# frontend build -> nginx html
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html


# nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# backend source + dependencies
COPY --from=backend-build /app/backend /app/backend
COPY --from=backend-build /app/node_modules /app/node_modules

# node runtime for backend
RUN apk add --no-cache nodejs npm

WORKDIR /app/backend

EXPOSE 8080
CMD sh -c "node index.js & nginx -g 'daemon off;'"
