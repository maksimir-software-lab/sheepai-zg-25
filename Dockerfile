# Base stage for dependencies
FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
# Copy package files
COPY . .

# Install
RUN bun install --frozen-lockfile
RUN bun run build

FROM base AS release
COPY --from=install /app/.next/standalone ./
COPY --from=install /app/.next/static ./.next/static

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "node", "server.js" ]
