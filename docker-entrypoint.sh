#!/bin/sh
set -e

echo "▶  Mastex platform — startup"

# Wait briefly for the database to accept connections (best-effort).
if [ -n "$DATABASE_URL" ]; then
  echo "▶  Applying database migrations…"
  # Prefer migrate deploy; fall back to db push if no migration history applies cleanly.
  if pnpm prisma migrate deploy; then
    echo "✔  Migrations applied."
  else
    echo "⚠  migrate deploy failed — falling back to db push."
    pnpm prisma db push --skip-generate
  fi

  echo "▶  Seeding database (idempotent)…"
  if pnpm db:seed; then
    echo "✔  Seed complete."
  else
    echo "⚠  Seed skipped/failed (non-fatal)."
  fi
else
  echo "⚠  DATABASE_URL not set — skipping migrations & seed."
fi

echo "▶  Starting Next.js server on port ${PORT:-3000}…"
exec pnpm start
