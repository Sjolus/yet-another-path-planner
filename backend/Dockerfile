FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --filter @yapp/backend...

FROM base AS build

WORKDIR /app
COPY --from=dependencies /app ./
COPY backend ./backend
RUN pnpm --filter @yapp/backend build

FROM base AS prod-dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY packages ./packages
RUN pnpm install --prod --frozen-lockfile --filter @yapp/backend...

FROM base AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-dependencies /app/node_modules ./node_modules
COPY --from=prod-dependencies /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./dist
COPY backend/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/main"]
