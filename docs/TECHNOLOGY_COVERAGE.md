# Technology Coverage

This version includes the technologies mentioned in the project description and assignment examples.

| Requirement / Technology | Included | Where |
|---|---:|---|
| React frontend | Yes | `frontend/` |
| Node.js / Express backend | Yes | `backend/` |
| PostgreSQL database | Yes | `docker-compose.yml`, `k8s/postgres.yaml` |
| Docker containerization | Yes | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` |
| Kubernetes deployment | Yes | `k8s/` |
| Google Cloud readiness | Yes | Artifact Registry + GKE commands in docs and Jenkinsfile |
| Jenkins CI/CD | Yes | `Jenkinsfile` |
| GitHub version control | Yes | Repository-ready structure and `.gitignore` |
| Environment variables | Yes | `.env.example`, ConfigMap, Secret |
| stdout/stderr logs | Yes | Express/Morgan/console logs, no file-based logging |
| Redis caching | Yes | `redis` service, `k8s/redis.yaml`, backend Google Reviews cache |
| Monitoring basics | Yes | `/metrics`, Prometheus annotations, health/readiness probes |
| Health checks | Yes | Docker healthchecks and Kubernetes liveness/readiness probes |

Redis is not a 12-factor requirement by itself, but it is included because the assignment lists caching as a possible cloud component. The application treats Redis as a backing service configured by `REDIS_URL`, which is aligned with the 12-factor backing-services principle.
