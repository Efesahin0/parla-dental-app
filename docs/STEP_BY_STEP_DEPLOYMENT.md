# Step-by-Step Deployment Guide

This guide explains what you should do from zero to cloud deployment.

## 1. Local Test

Open PowerShell in the project root and create your ignored local env file first:

```powershell
Copy-Item .env.example .env
```

Then open `.env` and change at least `POSTGRES_PASSWORD`, `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`, and `DENTIST_PASSWORD`. After that run:

```powershell
docker compose down -v
docker compose up --build
```

Check these URLs:

```txt
http://localhost:3000
http://localhost:4000/health
http://localhost:4000/ready
http://localhost:4000/metrics
```

## 2. Push to GitHub

```powershell
git init
git add .
git commit -m "Initial 12-factor Parla Dental project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/parla-dental-12factor.git
git push -u origin main
```

Do not commit real `.env` files or API keys.

## 3. Prepare Google Cloud

```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable container.googleapis.com artifactregistry.googleapis.com compute.googleapis.com
```

Create Artifact Registry:

```powershell
gcloud artifacts repositories create parla-dental --repository-format=docker --location=europe-west1 --description="Parla Dental Docker images"
gcloud auth configure-docker europe-west1-docker.pkg.dev
```

Create GKE cluster:

```powershell
gcloud container clusters create parla-cluster --zone europe-west1-b --num-nodes 2
gcloud container clusters get-credentials parla-cluster --zone europe-west1-b
```

## 4. Build and Push Docker Images Manually

PowerShell:

```powershell
$PROJECT_ID="YOUR_PROJECT_ID"
$REGION="europe-west1"
$REPOSITORY="parla-dental"
$TAG="v1"

docker build -t "$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/parla-backend:$TAG" ./backend
docker build -t "$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/parla-frontend:$TAG" ./frontend

docker push "$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/parla-backend:$TAG"
docker push "$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/parla-frontend:$TAG"
```

## 5. Deploy to Kubernetes Manually

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
# Create Kubernetes secrets using the commands in k8s/README_SECRETS.md before applying the remaining manifests.
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
```

Run migration job:

```powershell
kubectl delete job parla-db-migrate -n parla-dental --ignore-not-found=true
kubectl apply -f k8s/migration-job.yaml
kubectl set image job/parla-db-migrate migrate=europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/parla-dental/parla-backend:v1 -n parla-dental
kubectl wait --for=condition=complete job/parla-db-migrate -n parla-dental --timeout=180s
```

Deploy backend and frontend:

```powershell
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/hpa.yaml

kubectl set image deployment/parla-backend backend=europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/parla-dental/parla-backend:v1 -n parla-dental
kubectl set image deployment/parla-frontend frontend=europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/parla-dental/parla-frontend:v1 -n parla-dental
```

Check:

```powershell
kubectl get pods -n parla-dental
kubectl get svc -n parla-dental
kubectl logs -n parla-dental deployment/parla-backend
```

Open the external IP shown for `parla-frontend-service`.

## 6. Jenkins CI/CD Setup

In Jenkins, create credentials:

```txt
gcp-service-account-json = Google Cloud service account JSON file
parla-postgres-db = parla_dental
parla-postgres-user = your database user
parla-postgres-password = your database password
parla-jwt-secret = long random JWT secret
parla-admin-password = admin demo password
parla-dentist-password = dentist demo password
parla-google-places-api-key = Google Places API key or blank value
parla-google-place-id = Google Place ID or blank value
```

The Jenkins agent must have:

```txt
git
node
npm
docker
gcloud
kubectl
```

Edit `Jenkinsfile`:

```txt
PROJECT_ID = 'YOUR_PROJECT_ID'
REGION = 'europe-west1'
REPOSITORY = 'parla-dental'
CLUSTER_NAME = 'parla-cluster'
CLUSTER_ZONE = 'europe-west1-b'
```

Then create a Pipeline job connected to the GitHub repository. Each build will:

```txt
1. Pull code from GitHub
2. Validate backend
3. Build frontend
4. Build Docker images
5. Push images to Google Artifact Registry
6. Deploy images to GKE
```

## 7. Demo Video Flow

```txt
1. Show GitHub repository.
2. Show frontend/backend/k8s/Jenkinsfile folders.
3. Run docker compose up --build.
4. Open Parla Dental website.
5. Show treatments, doctors, Google Maps, reviews, appointment form.
6. Submit appointment request.
7. Login as admin and show request/patient/appointment pages.
8. Login as dentist and add treatment record.
9. Show /health, /ready, /metrics endpoints.
10. Show docker compose logs backend.
11. Show Kubernetes manifests.
12. Show Jenkinsfile stages.
13. Explain 12-factor mapping.
```
