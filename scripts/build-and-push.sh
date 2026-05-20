#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?PROJECT_ID is required}"
REGION="${REGION:-europe-west1}"
REPOSITORY="${REPOSITORY:-parla-dental}"
TAG="${TAG:-v1}"

BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-backend:${TAG}"
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-frontend:${TAG}"

gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

docker build -t "${BACKEND_IMAGE}" ./backend
docker build -t "${FRONTEND_IMAGE}" ./frontend

docker push "${BACKEND_IMAGE}"
docker push "${FRONTEND_IMAGE}"

printf 'Backend image: %s\nFrontend image: %s\n' "${BACKEND_IMAGE}" "${FRONTEND_IMAGE}"
