# Parla Dental 12-Factor Cloud Ready Project

Web-based Dental Clinic Patient Management System built with React, Node.js/Express, PostgreSQL, Redis, Docker, Kubernetes, Google Cloud and Jenkins.

## GitHub safety

This repository is prepared to be pushed to GitHub:

- Real `.env` files are ignored.
- Real Kubernetes Secret manifests are ignored.
- Google service account JSON files are ignored.
- API keys, JWT secrets and real passwords are not committed.
- Only `.env.example` and `k8s/examples/*secret.example.yaml` templates are committed.

## Local run

1. Create your local env file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Edit `.env` and replace these values:

```txt
POSTGRES_PASSWORD
DATABASE_URL
JWT_SECRET
ADMIN_PASSWORD
DENTIST_PASSWORD
```

3. Start the project:

```bash
docker compose down -v
docker compose up --build
```

4. Open:

```txt
Frontend: http://localhost:3000
Backend health: http://localhost:4000/health
Readiness: http://localhost:4000/ready
Metrics: http://localhost:4000/metrics
```

## Demo users

The seed users are created with these emails. Passwords come from your local `.env` values.

| Role | Email | Password source |
|---|---|---|
| Admin / Receptionist | admin@parladental.com | `ADMIN_PASSWORD` |
| Dentist | dentist@parladental.com | `DENTIST_PASSWORD` |
| Dentist 2 | dentist2@parladental.com | `DENTIST_PASSWORD` |

## Project contents

```txt
frontend/       React + Vite UI
backend/        Node.js + Express API
k8s/            Kubernetes manifests, no real secret files
docs/           12-factor report/checklist/deployment notes
scripts/        Build, push and GKE deploy scripts
Jenkinsfile     Jenkins CI/CD pipeline
```

## 12-factor coverage

- Codebase: GitHub repository
- Dependencies: `package.json`
- Config: environment variables, ConfigMap, Secret
- Backing services: PostgreSQL, Redis, Google Places API
- Build / Release / Run: Docker + Jenkins + Kubernetes
- Processes: stateless backend process
- Port binding: Express exposes `PORT`
- Concurrency: Kubernetes replicas + HPA
- Disposability: health/readiness checks and graceful shutdown
- Dev/prod parity: Docker Compose locally, Kubernetes on cloud
- Logs: stdout/stderr
- Admin processes: Kubernetes migration Job
