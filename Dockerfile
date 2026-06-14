# ─── Mastex Technologies Ltd — production image ────────────────────────────
# Runs database migrations + (idempotent) seed automatically on startup,
# then launches the Next.js server. See docker-entrypoint.sh.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@11.6.0 --activate
WORKDIR /app

# ── Build ─────────────────────────────────────────────────────────────────
FROM base AS build
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml .npmrc ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile || pnpm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm prisma generate
RUN pnpm build

# ── Runner ────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Bring the fully built app (incl. node_modules with prisma CLI + tsx for the
# startup migrate/seed step).
COPY --from=build /app ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
