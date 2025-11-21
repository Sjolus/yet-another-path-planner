FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api-gateway/package.json ./api-gateway/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --filter @yapp/api-gateway...

FROM base AS build

WORKDIR /app
COPY --from=dependencies /app ./
COPY api-gateway ./api-gateway
RUN pnpm --filter @yapp/api-gateway build

FROM base AS prod-dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api-gateway/package.json ./api-gateway/
COPY packages ./packages
RUN pnpm install --prod --frozen-lockfile --filter @yapp/api-gateway...

FROM base AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-dependencies /app/node_modules ./node_modules
COPY --from=prod-dependencies /app/api-gateway/node_modules ./api-gateway/node_modules
COPY --from=build /app/api-gateway/dist ./dist
COPY api-gateway/package.json ./package.json

EXPOSE 3002

CMD ["node", "dist/index.js"]
