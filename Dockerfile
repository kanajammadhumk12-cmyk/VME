# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

# Install native build tools needed by better-sqlite3
RUN apk add --no-cache python3 make g++

# Install dependencies separately to leverage Docker layer caching
COPY package*.json ./

RUN npm ci --omit=dev

# Copy only the runtime application files needed by the app
COPY --chown=node:node ./backend ./backend
COPY --chown=node:node ./frontend ./frontend

# Ensure data directory exists and has correct permissions
RUN mkdir -p /app/backend/data && chown -R node:node /app

USER node

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

CMD ["node", "backend/server.js"]
