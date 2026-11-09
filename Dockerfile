FROM node:22-alpine

WORKDIR /app

# Install native build tools needed by better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "backend/server.js"]

