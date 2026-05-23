pipeline {
  agent any

  environment {
    PROJECT_ID = 'project-7c2748ca-a066-472f-b79'
    REGION = 'europe-west1'
    REPOSITORY = 'parla-dental'
    CLUSTER_NAME = 'parla-cluster'
    CLUSTER_ZONE = 'europe-west1-b'
    NAMESPACE = 'parla-dental'
    JENKINS_GCP_ACCOUNT = 'jenkins-gke-deployer@dental-clinic-project-496416.iam.gserviceaccount.com'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Check Tools') {
      steps {
        bat 'git --version'
        bat 'node --version'
        bat 'npm --version'
        bat 'docker --version'
        bat 'gcloud --version'
        bat 'kubectl version --client'
      }
    }

    stage('Authenticate Google Cloud') {
      steps {
        bat 'gcloud config set account "%JENKINS_GCP_ACCOUNT%"'
        bat 'gcloud config set project "%PROJECT_ID%"'
        bat 'gcloud auth list'

        bat 'gcloud auth print-access-token > "%WORKSPACE%\\gcp-token.txt"'
        bat 'type "%WORKSPACE%\\gcp-token.txt" | docker login -u oauth2accesstoken --password-stdin https://%REGION%-docker.pkg.dev'
        bat 'del "%WORKSPACE%\\gcp-token.txt"'

        bat 'gcloud auth configure-docker %REGION%-docker.pkg.dev --quiet'
        bat 'gcloud container clusters get-credentials "%CLUSTER_NAME%" --zone "%CLUSTER_ZONE%" --project "%PROJECT_ID%"'
      }
    }

    stage('Frontend Build Test') {
      steps {
        dir('frontend') {
          bat 'npm install'
          bat 'npm run build'
        }
      }
    }

    stage('Backend Install Test') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('Docker Build') {
      steps {
        bat '''
          set IMAGE_TAG=jenkins-%BUILD_NUMBER%
          set BACKEND_IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/parla-backend:%IMAGE_TAG%
          set FRONTEND_IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/parla-frontend:%IMAGE_TAG%

          echo Building backend image: %BACKEND_IMAGE%
          docker build -t "%BACKEND_IMAGE%" ./backend

          echo Building frontend image: %FRONTEND_IMAGE%
          docker build -t "%FRONTEND_IMAGE%" ./frontend
        '''
      }
    }

    stage('Docker Push') {
      steps {
        bat '''
          set IMAGE_TAG=jenkins-%BUILD_NUMBER%
          set BACKEND_IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/parla-backend:%IMAGE_TAG%
          set FRONTEND_IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/parla-frontend:%IMAGE_TAG%

          echo Pushing backend image: %BACKEND_IMAGE%
          docker push "%BACKEND_IMAGE%"

          echo Pushing frontend image: %FRONTEND_IMAGE%
          docker push "%FRONTEND_IMAGE%"
        '''
      }
    }

    stage('Deploy to GKE') {
      steps {
        powershell '''
          $ErrorActionPreference = "Stop"

          $ImageTag = "jenkins-$env:BUILD_NUMBER"
          $BackendImage = "$env:REGION-docker.pkg.dev/$env:PROJECT_ID/$env:REPOSITORY/parla-backend:$ImageTag"
          $FrontendImage = "$env:REGION-docker.pkg.dev/$env:PROJECT_ID/$env:REPOSITORY/parla-frontend:$ImageTag"

          Write-Host "Backend image:  $BackendImage"
          Write-Host "Frontend image: $FrontendImage"

          Write-Host ""
          Write-Host "[1/5] Getting GKE credentials..."
          gcloud container clusters get-credentials $env:CLUSTER_NAME --zone $env:CLUSTER_ZONE --project $env:PROJECT_ID

          Write-Host ""
          Write-Host "[2/5] Running database migration job with the new backend image..."

          kubectl delete job parla-db-migrate -n $env:NAMESPACE --ignore-not-found=true

          $MigrationYaml = @"
apiVersion: batch/v1
kind: Job
metadata:
  name: parla-db-migrate
  namespace: $env:NAMESPACE
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

          $MigrationYaml | Out-File -FilePath migration-job.generated.yaml -Encoding utf8

          kubectl apply -f migration-job.generated.yaml
          kubectl wait --for=condition=complete job/parla-db-migrate -n $env:NAMESPACE --timeout=240s
          kubectl logs job/parla-db-migrate -n $env:NAMESPACE

          Write-Host ""
          Write-Host "[3/5] Updating backend deployment image..."
          kubectl set image deployment/parla-backend backend=$BackendImage -n $env:NAMESPACE
          kubectl rollout status deployment/parla-backend -n $env:NAMESPACE --timeout=240s

          Write-Host ""
          Write-Host "[4/5] Updating frontend deployment image..."
          kubectl set image deployment/parla-frontend frontend=$FrontendImage -n $env:NAMESPACE
          kubectl rollout status deployment/parla-frontend -n $env:NAMESPACE --timeout=240s

          Write-Host ""
          Write-Host "[5/5] Deployment summary..."
          kubectl get pods -n $env:NAMESPACE
          kubectl get svc -n $env:NAMESPACE
          kubectl get hpa -n $env:NAMESPACE
        '''
      }
    }
  }

  post {
    success {
      echo 'Parla Dental CI/CD pipeline completed successfully.'
    }

    failure {
      echo 'Pipeline failed. Check the failed stage logs.'
    }
  }
}