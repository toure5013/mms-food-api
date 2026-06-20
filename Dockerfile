# ==============================
# BUILD STAGE
# ==============================
FROM node:22.14.0-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ git

# npm
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm rebuild bcrypt --build-from-source

RUN npm run build


# ==============================
# PRODUCTION STAGE
# ==============================
FROM node:22.14.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

RUN apk add --no-cache python3

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist


RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs \
  && chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 80

CMD ["node", "dist/main.js"]