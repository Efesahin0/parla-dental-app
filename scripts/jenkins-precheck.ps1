$ErrorActionPreference = "Continue"

Write-Host "Checking local/Jenkins agent tools..."
git --version
node --version
npm --version
docker --version
gcloud --version
kubectl version --client

Write-Host ""
Write-Host "Checking current GKE deployment..."
kubectl get pods -n parla-dental
kubectl get svc -n parla-dental
kubectl get hpa -n parla-dental

Write-Host ""
Write-Host "Frontend URL:"
$ip = kubectl get svc parla-frontend-service -n parla-dental -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
Write-Host "http://$ip"
