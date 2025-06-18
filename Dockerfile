# https://github.com/georgelopez7/puppeteer-in-docker/blob/master/Dockerfile

FROM node:21.2.0-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:21.2.0-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY --from=builder /usr/app ./

EXPOSE 8000

RUN ls -al /usr/app

CMD ["node", "index.js"]