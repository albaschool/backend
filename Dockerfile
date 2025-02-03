FROM node:22-slim AS base

RUN npm install -g pnpm

WORKDIR /app

COPY . /app

RUN pnpm install

CMD ["sh", "-c", "pnpm migrate:latest && pnpm start"]
