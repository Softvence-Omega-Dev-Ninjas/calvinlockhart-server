# Stage 1: Base image
FROM node:24-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Stage 2: Dependencies
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Stage 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Stage 4: Production Runner
FROM base AS runner
ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/data ./data

USER node
EXPOSE 5000

CMD ["npm", "run", "start:prod"]
