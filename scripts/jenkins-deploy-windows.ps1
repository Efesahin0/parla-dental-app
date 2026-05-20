param(
    [Parameter(Mandatory=$true)][string]$ProjectId,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][string]$Repository,
    [Parameter(Mandatory=$true)][string]$Tag,
    [string]$ClusterName = "parla-cluster",
    [string]$ClusterZone = "europe-west1-b",
    [string]$Namespace = "parla-dental"
)

$ErrorActionPreference = "Stop"

$BackendImage = "$Region-docker.pkg.dev/$ProjectId/$Repository/parla-backend:$Tag"
$FrontendImage = "$Region-docker.pkg.dev/$ProjectId/$Repository/parla-frontend:$Tag"

Write-Host "Backend image:  $BackendImage"
Write-Host "Frontend image: $FrontendImage"

Write-Host ""
Write-Host "[1/6] Getting GKE credentials..."
gcloud container clusters get-credentials $ClusterName --zone $ClusterZone --project $ProjectId

Write-Host ""
Write-Host "[2/6] Checking namespace..."
kubectl get namespace $Namespace

Write-Host ""
Write-Host "[3/6] Running migration job with new backend image..."
$MigrationYaml = @"
apiVersion: batch/v1
kind: Job
metadata:
  name: parla-db-migrate
  namespace: $Namespace
spec:
  backoffLimit: 2
  template:
    metadata:
      labels:
        app: parla-db-migrate
    spec:
      restartPolicy: OnFailure
      containers:
        - name: migrate
          image: $BackendImage
          imagePullPolicy: Always
          command: ["npm", "run", "migrate"]
          envFrom:
            - configMapRef:
                name: parla-config
            - secretRef:
                name: parla-backend-secret
"@

$TempMigrationFile = Join-Path $env:TEMP "parla-db-migrate-$Tag.yaml"
$MigrationYaml | Out-File -FilePath $TempMigrationFile -Encoding utf8

kubectl delete job parla-db-migrate -n $Namespace --ignore-not-found=true
kubectl apply -f $TempMigrationFile
kubectl wait --for=condition=complete job/parla-db-migrate -n $Namespace --timeout=180s

Write-Host ""
Write-Host "[4/6] Updating backend deployment image..."
kubectl set image deployment/parla-backend backend=$BackendImage -n $Namespace
kubectl rollout status deployment/parla-backend -n $Namespace --timeout=180s

Write-Host ""
Write-Host "[5/6] Updating frontend deployment image..."
kubectl set image deployment/parla-frontend frontend=$FrontendImage -n $Namespace
kubectl rollout status deployment/parla-frontend -n $Namespace --timeout=180s

Write-Host ""
Write-Host "[6/6] Deployment summary..."
kubectl get pods -n $Namespace
kubectl get svc -n $Namespace
kubectl get hpa -n $Namespace

Write-Host ""
Write-Host "Deploy completed."
