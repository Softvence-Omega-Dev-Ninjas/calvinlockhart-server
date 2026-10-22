# Stage 1: Base image
FROM node:24-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Stage 2: Production Dependencies
FROM base AS prod-deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev --ignore-scripts && npx prisma generate

# Stage 3: Builder
FROM base AS builder
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --ignore-scripts && npx prisma generate
COPY . .
RUN npm run build

# Stage 4: Production Runner
FROM base AS runner
ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node data ./data

USER node
EXPOSE 5000

CMD ["node", "dist/main"]
