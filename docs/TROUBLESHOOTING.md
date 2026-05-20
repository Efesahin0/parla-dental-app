# Troubleshooting

## Frontend build: `vite: not found`

This usually means the frontend dependency installation layer did not complete correctly.
The frontend Dockerfile uses:

```dockerfile
RUN npm install --include=dev --no-audit --no-fund --loglevel=error \
    && test -x node_modules/.bin/vite
```

If it still happens, run:

```bash
docker compose down -v
docker builder prune -f
docker compose build --no-cache frontend
docker compose up
```

## PostgreSQL port already allocated

The host port is mapped as `5433:5432`, so another local PostgreSQL using 5432 should not block Docker Compose.
Inside Docker, the backend still connects to `postgres:5432`.

## npm install: Exit handler never called

If Docker fails during the frontend build with `npm error Exit handler never called!`, delete any generated `frontend/package-lock.json` file and rebuild. This project intentionally does not copy `package-lock.json` in the frontend Dockerfile because generated lock files may include machine-specific registry URLs.

Recommended commands:

```bash
docker compose down -v
docker builder prune -f
docker compose build --no-cache frontend
docker compose up
```
