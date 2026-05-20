# GitHub Upload Checklist

Before pushing:

```bash
git status --ignored
```

Make sure these are NOT staged:

- `.env`
- `backend/.env`
- `frontend/.env`
- `k8s/backend-secret.yaml`
- `k8s/postgres-secret.yaml`
- any `*service-account*.json`
- any real Google API key file

Safe files that should be committed:

- `.env.example`
- `backend/.env.example`
- `frontend/.env.example`
- `k8s/examples/backend-secret.example.yaml`
- `k8s/examples/postgres-secret.example.yaml`
- source code, Dockerfiles, Kubernetes non-secret manifests, Jenkinsfile and docs

Optional final scan:

```bash
git grep -n "AIza\|PRIVATE KEY\|service_account\|admin123\|dentist123\|postgres:postgres"
```

This command should not show real credentials. Placeholder/example text is fine only if it cannot be used as a real secret.
