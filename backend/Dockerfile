FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY backend ./backend

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app

WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "index.js"]
