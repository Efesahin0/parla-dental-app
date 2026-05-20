# Parla Dental 12-Factor Application Mapping

## Project Summary

Parla Dental is a web-based Dental Clinic Patient Management System. The public website allows patients to review clinic information, treatments, doctors, location, Google reviews and submit an online appointment request. The internal system provides role-based access control for administrative staff and dentists. Administrative users can manage patients and appointments, while dentists can view their own appointments and add treatment history records.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Nginx |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Containerization | Docker |
| Orchestration | Kubernetes |
| Cloud Provider | Google Cloud / Google Kubernetes Engine |
| Registry | Google Artifact Registry |
| CI/CD | Jenkins |
| Version Control | GitHub |
| Configuration | Environment variables, Kubernetes ConfigMap and Secret |
| Logging | stdout/stderr |

## 12-Factor Compliance

### 1. Codebase

The project is managed as one GitHub repository. The repository contains frontend code, backend code, Dockerfiles, Kubernetes manifests, Jenkinsfile and documentation.

### 2. Dependencies

The frontend and backend declare dependencies through package.json. Dependencies are installed during Docker build or CI validation steps.

### 3. Config

Configuration values are not hard-coded in the application. Runtime values such as `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`, Google API values and passwords are provided using environment variables. Kubernetes ConfigMap stores non-sensitive values and Kubernetes Secret stores sensitive values.

### 4. Backing Services

PostgreSQL is treated as an attached backing service. The backend connects to it through `DATABASE_URL`, so the database can be changed from local Docker PostgreSQL to a cloud PostgreSQL service without changing application code.

### 5. Build, Release, Run

The build stage creates Docker images for frontend and backend. The release stage combines those images with Kubernetes configuration and environment variables. The run stage starts Kubernetes Pods from the released images.

### 6. Processes

The backend runs as a stateless Express process. User authentication uses JWT tokens. Patient, appointment and treatment data are stored in PostgreSQL, not in local memory.

### 7. Port Binding

The backend binds to the `PORT` environment variable. The frontend is served by Nginx on port 80.

### 8. Concurrency

Kubernetes Deployments run multiple replicas of the frontend and backend. HorizontalPodAutoscaler manifests are included to scale services based on CPU utilization.

### 9. Disposability

The backend supports graceful shutdown on SIGTERM/SIGINT. Docker and Kubernetes health checks are included. Kubernetes readiness and liveness probes are configured for reliable startup, restart and rolling deployment behavior.

### 10. Dev/Prod Parity

Local development uses Docker Compose with separate frontend, backend and PostgreSQL containers. Production deployment uses Kubernetes with the same containerized application model.

### 11. Logs

The application writes logs to stdout/stderr through `console.log`, `console.error` and Morgan. Logs are not written to local files. This allows Docker, Kubernetes and Google Cloud Logging to collect logs from the container runtime.

### 12. Admin Processes

Database migration and seed operations can be run as a one-off admin process using:

```bash
npm run migrate
```

In Kubernetes, the same operation is represented as a Job:

```bash
kubectl apply -f k8s/migration-job.yaml
```

## Operational Endpoints

| Endpoint | Purpose |
|---|---|
| `/health` | Liveness check |
| `/ready` | Readiness check with PostgreSQL connectivity |
| `/metrics` | Basic Prometheus-compatible metrics |

## CI/CD Flow

1. Developer pushes code to GitHub.
2. Jenkins pulls the repository.
3. Jenkins validates backend and frontend builds.
4. Jenkins builds Docker images.
5. Jenkins pushes images to Google Artifact Registry.
6. Jenkins deploys the new image versions to Google Kubernetes Engine.
7. Kubernetes performs rolling updates using readiness/liveness probes.


## Redis Caching Layer

Redis is included as an optional backing service and caching layer. In the local environment it runs as a Docker Compose service, and in Kubernetes it runs through `k8s/redis.yaml`. The backend connects to Redis using `REDIS_URL`, so the application code does not depend on a fixed Redis host. Google Reviews responses are cached in Redis with `GOOGLE_REVIEWS_CACHE_TTL_SECONDS`, reducing repeated external API calls and demonstrating the caching component expected in the project technology stack.
