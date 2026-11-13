FROM node:22-bookworm-slim

WORKDIR /app

ENV NUXT_HOST=0.0.0.0 \
    NUXT_PORT=3000 \
    NODE_OPTIONS=--openssl-legacy-provider

COPY package.json package-lock.json ./

RUN npm install --no-audit --no-fund

COPY . .

ARG API_URL=http://localhost:8080/api
ENV API_URL=$API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
