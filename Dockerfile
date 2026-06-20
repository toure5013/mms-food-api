# ==============================
# BASE
# ==============================
FROM node:22.14-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat


# ==============================
# DEPENDENCIES
# ==============================
FROM base AS deps

# Native dependencies (bcrypt, sharp, etc.)
RUN apk add --no-cache \
  python3 \
  make \
  g++

COPY package*.json ./

RUN npm ci


# ==============================
# BUILDER
# ==============================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build


# Remove dev dependencies
RUN npm prune --omit=dev


# ==============================
# RUNNER
# ==============================
FROM base AS runner


ENV NODE_ENV=production
ENV PORT=3001


# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs


# Copy application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


# Create writable folders
RUN mkdir -p /app/logs \
  && chown -R nestjs:nodejs /app


USER nestjs


EXPOSE 3001


HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=15s \
  --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/v1/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"


CMD ["node", "dist/main.js"]