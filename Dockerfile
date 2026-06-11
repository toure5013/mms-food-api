# --- BASE ---
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# --- DEPENDENCIES ---
FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- BUILDER ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Prune development dependencies to keep production image small
RUN npm prune --production

# --- RUNNER ---
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs
EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/main.js"]
