# Tribams — production origin image (put Cloudflare DNS/proxy in front).
# Not for Cloudflare Workers-only; use Containers / any Node host + CF.

FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

# Uploads / optional file sessions. Production must use Postgres (DATABASE_URL).
RUN mkdir -p database database/sessions public/uploads/profiles \
    && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3080
ENV SESSION_STORE=memory
EXPOSE 3080

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3080)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
