# Multi-stage Dockerfile for Next.js (App Router)
# 1) Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on lockfile if present
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* bun.lockb* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; \
  fi

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# 2) Runner stage
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy only what is needed to run
COPY --from=builder /app/package.json /app/package-lock.json* pnpm-lock.yaml* yarn.lock* bun.lockb* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/app ./app

# Install only production dependencies
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
  else npm install --omit=dev; \
  fi

# Next.js listens on 3000 by default
EXPOSE 3000

# GEMINI_API_KEY will be injected at runtime
ENV PORT=3000

CMD ["npm", "start"]
