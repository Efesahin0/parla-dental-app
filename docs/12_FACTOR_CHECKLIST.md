# 12-Factor Checklist for Parla Dental

| Factor | Project Implementation |
|---|---|
| 1. Codebase | One GitHub repository contains frontend, backend, Docker, Kubernetes, Jenkinsfile and docs. |
| 2. Dependencies | Frontend and backend dependencies are explicitly declared in package.json. |
| 3. Config | Runtime config is read from environment variables. Kubernetes ConfigMap stores non-sensitive config and Secret stores sensitive values. |
| 4. Backing Services | PostgreSQL is accessed through DATABASE_URL and Redis is accessed through REDIS_URL. Both are treated as replaceable backing services, so local Docker services and cloud-managed services can be swapped without code changes. |
| 5. Build, Release, Run | Docker builds immutable images. Kubernetes manifests combine images with config. Pods run the released images. |
| 6. Processes | Backend is a stateless Express process. Authentication uses JWT and does not rely on server memory sessions. |
| 7. Port Binding | Backend binds to PORT. Frontend is served by Nginx on port 80. |
| 8. Concurrency | Kubernetes replicas and HPA allow frontend/backend scaling. |
| 9. Disposability | SIGTERM/SIGINT shutdown, liveness/readiness probes and container restart policies are configured. |
| 10. Dev/Prod Parity | Docker Compose local environment is similar to Kubernetes production environment. |
| 11. Logs | Logs go to stdout/stderr through console and Morgan. No file-based app logs are used. |
| 12. Admin Processes | Database migration/seed can be run as a one-off Kubernetes Job or npm script. |

## Endpoints for Operational Readiness

```txt
GET /health   basic liveness
GET /ready    checks database and Redis connectivity when Redis is enabled
GET /metrics  Prometheus-compatible basic metrics
```

## Notes

Redis is included as the caching layer for Google Reviews. Real production secrets should not be committed to GitHub. Only example Secret templates are included. Real Secret files are ignored by Git. In a real deployment, create or replace them using secure CI/CD credentials or cloud secret management.
