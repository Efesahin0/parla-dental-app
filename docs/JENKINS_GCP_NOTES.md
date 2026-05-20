# Jenkins + Google Cloud Notes

## Required Jenkins Credentials

Create a Jenkins credential with this exact ID:

```txt
gcp-service-account-json
```

Type: Secret file
Value: Google Cloud service account JSON key

## Service Account Permissions

For a class project, these roles are enough:

```txt
Artifact Registry Writer
Kubernetes Engine Developer
Viewer
```

For stricter production setups, use least privilege and separate build/deploy accounts.

## Jenkins Agent Requirements

The Jenkins build agent must have:

```txt
Git
Node.js + npm
Docker CLI + Docker daemon access
Google Cloud CLI
kubectl
```

## Secret Setup

Real secrets are not stored in GitHub. Use Jenkins Credentials with these IDs before running the pipeline:

```txt
parla-postgres-db
parla-postgres-user
parla-postgres-password
parla-jwt-secret
parla-admin-password
parla-dentist-password
parla-google-places-api-key
parla-google-place-id
```

For manual deployment, use the commands in `k8s/README_SECRETS.md`.
