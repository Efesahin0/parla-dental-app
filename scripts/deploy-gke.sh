#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?PROJECT_ID is required}"
REGION="${REGION:-europe-west1}"
REPOSITORY="${REPOSITORY:-parla-dental}"
TAG="${TAG:-v1}"
CLUSTER_NAME="${CLUSTER_NAME:-parla-cluster}"
CLUSTER_ZONE="${CLUSTER_ZONE:-europe-west1-b}"
NAMESPACE="${NAMESPACE:-parla-dental}"

# Required runtime secrets. Keep them in your shell, .env that is not committed, or CI credentials.
POSTGRES_DB="${POSTGRES_DB:-parla_dental}"
POSTGRES_USER="${POSTGRES_USER:?POSTGRES_USER is required}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"
DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@parla-postgres-service:5432/${POSTGRES_DB}}"
JWT_SECRET="${JWT_SECRET:?JWT_SECRET is required}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:?ADMIN_PASSWORD is required}"
DENTIST_PASSWORD="${DENTIST_PASSWORD:?DENTIST_PASSWORD is required}"
GOOGLE_PLACES_API_KEY="${GOOGLE_PLACES_API_KEY:-}"
GOOGLE_PLACE_ID="${GOOGLE_PLACE_ID:-}"

BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-backend:${TAG}"
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-frontend:${TAG}"

gcloud container clusters get-credentials "${CLUSTER_NAME}" --zone "${CLUSTER_ZONE}" --project "${PROJECT_ID}"

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml

kubectl create secret generic parla-postgres-secret -n "${NAMESPACE}" \
  --from-literal=POSTGRES_DB="${POSTGRES_DB}" \
  --from-literal=POSTGRES_USER="${POSTGRES_USER}" \
  --from-literal=POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic parla-backend-secret -n "${NAMESPACE}" \
  --from-literal=DATABASE_URL="${DATABASE_URL}" \
  --from-literal=JWT_SECRET="${JWT_SECRET}" \
  --from-literal=ADMIN_PASSWORD="${ADMIN_PASSWORD}" \
  --from-literal=DENTIST_PASSWORD="${DENTIST_PASSWORD}" \
  --from-literal=GOOGLE_PLACES_API_KEY="${GOOGLE_PLACES_API_KEY}" \
  --from-literal=GOOGLE_PLACE_ID="${GOOGLE_PLACE_ID}" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl delete job parla-db-migrate -n "${NAMESPACE}" --ignore-not-found=true
kubectl apply -f k8s/migration-job.yaml
kubectl -n "${NAMESPACE}" set image job/parla-db-migrate migrate="${BACKEND_IMAGE}"
kubectl -n "${NAMESPACE}" wait --for=condition=complete job/parla-db-migrate --timeout=180s
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/hpa.yaml
kubectl -n "${NAMESPACE}" set image deployment/parla-backend backend="${BACKEND_IMAGE}"
kubectl -n "${NAMESPACE}" set image deployment/parla-frontend frontend="${FRONTEND_IMAGE}"
kubectl -n "${NAMESPACE}" rollout status deployment/parla-backend --timeout=180s
kubectl -n "${NAMESPACE}" rollout status deployment/parla-frontend --timeout=180s
kubectl get svc -n "${NAMESPACE}"
