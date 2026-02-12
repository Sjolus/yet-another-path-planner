FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --filter @yapp/frontend...

FROM base AS build

WORKDIR /app
COPY --from=dependencies /app ./
COPY frontend ./frontend
RUN pnpm --filter @yapp/frontend... build

FROM base AS prod-dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY packages ./packages
RUN pnpm install --prod --frozen-lockfile --filter @yapp/frontend...

FROM base AS production

WORKDIR /app/frontend
ENV NODE_ENV=production

COPY --from=prod-dependencies /app/node_modules /app/node_modules
COPY --from=prod-dependencies /app/frontend/node_modules ./node_modules
COPY --from=build /app/frontend/.next ./.next
COPY --from=build /app/frontend/public ./public
COPY frontend/package.json ./package.json
COPY frontend/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
