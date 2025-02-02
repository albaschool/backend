FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

WORKDIR /app

COPY . /app

RUN pnpm install

CMD pnpm migrate:latest && pnpm start
