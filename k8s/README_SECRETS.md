# Kubernetes Secrets

Real Kubernetes Secret files are intentionally ignored by Git and should not be committed.

Use these templates only as references:

- `k8s/examples/backend-secret.example.yaml`
- `k8s/examples/postgres-secret.example.yaml`

For local/manual GKE deployment, create the secrets directly in the cluster:

```bash
kubectl create namespace parla-dental --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic parla-postgres-secret \
  -n parla-dental \
  --from-literal=POSTGRES_DB="parla_dental" \
  --from-literal=POSTGRES_USER="YOUR_DB_USER" \
  --from-literal=POSTGRES_PASSWORD="YOUR_DB_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic parla-backend-secret \
  -n parla-dental \
  --from-literal=DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@parla-postgres-service:5432/parla_dental" \
  --from-literal=JWT_SECRET="YOUR_LONG_RANDOM_JWT_SECRET" \
  --from-literal=ADMIN_PASSWORD="YOUR_ADMIN_PASSWORD" \
  --from-literal=DENTIST_PASSWORD="YOUR_DENTIST_PASSWORD" \
  --from-literal=GOOGLE_PLACES_API_KEY="" \
  --from-literal=GOOGLE_PLACE_ID="" \
  --dry-run=client -o yaml | kubectl apply -f -
```

For Jenkins, store these values in Jenkins Credentials and let the Jenkinsfile create/update the cluster secrets at deploy time.
