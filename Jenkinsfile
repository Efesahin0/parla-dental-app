pipeline {
  agent any

  environment {
    PROJECT_ID = 'CHANGE_ME_PROJECT_ID'
    REGION = 'europe-west1'
    REPOSITORY = 'parla-dental'
    CLUSTER_NAME = 'parla-cluster'
    CLUSTER_ZONE = 'europe-west1-b'
    K8S_NAMESPACE = 'parla-dental'
    IMAGE_TAG = "${BUILD_NUMBER}"
    BACKEND_IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-backend:${IMAGE_TAG}"
    FRONTEND_IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-frontend:${IMAGE_TAG}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Validate Backend') {
      steps {
        dir('backend') {
          sh 'npm install --no-audit --no-fund'
          sh 'npm run lint'
        }
      }
    }

    stage('Validate Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install --no-audit --no-fund'
          sh 'npm run build'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE ./backend'
        sh 'docker build -t $FRONTEND_IMAGE ./frontend'
      }
    }

    stage('Push Images to Artifact Registry') {
      steps {
        withCredentials([file(credentialsId: 'gcp-service-account-json', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
          sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
          sh 'gcloud config set project $PROJECT_ID'
          sh 'gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet'
          sh 'docker push $BACKEND_IMAGE'
          sh 'docker push $FRONTEND_IMAGE'
        }
      }
    }

    stage('Deploy to GKE') {
      steps {
        withCredentials([
          file(credentialsId: 'gcp-service-account-json', variable: 'GOOGLE_APPLICATION_CREDENTIALS'),
          string(credentialsId: 'parla-postgres-db', variable: 'POSTGRES_DB'),
          string(credentialsId: 'parla-postgres-user', variable: 'POSTGRES_USER'),
          string(credentialsId: 'parla-postgres-password', variable: 'POSTGRES_PASSWORD'),
          string(credentialsId: 'parla-jwt-secret', variable: 'JWT_SECRET'),
          string(credentialsId: 'parla-admin-password', variable: 'ADMIN_PASSWORD'),
          string(credentialsId: 'parla-dentist-password', variable: 'DENTIST_PASSWORD'),
          string(credentialsId: 'parla-google-places-api-key', variable: 'GOOGLE_PLACES_API_KEY'),
          string(credentialsId: 'parla-google-place-id', variable: 'GOOGLE_PLACE_ID')
        ]) {
          sh '''
            set -e
            gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
            gcloud config set project $PROJECT_ID
            gcloud container clusters get-credentials $CLUSTER_NAME --zone $CLUSTER_ZONE --project $PROJECT_ID

            kubectl apply -f k8s/namespace.yaml
            kubectl apply -f k8s/configmap.yaml

            kubectl create secret generic parla-postgres-secret -n $K8S_NAMESPACE \
              --from-literal=POSTGRES_DB="$POSTGRES_DB" \
              --from-literal=POSTGRES_USER="$POSTGRES_USER" \
              --from-literal=POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
              --dry-run=client -o yaml | kubectl apply -f -

            kubectl create secret generic parla-backend-secret -n $K8S_NAMESPACE \
              --from-literal=DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@parla-postgres-service:5432/$POSTGRES_DB" \
              --from-literal=JWT_SECRET="$JWT_SECRET" \
              --from-literal=ADMIN_PASSWORD="$ADMIN_PASSWORD" \
              --from-literal=DENTIST_PASSWORD="$DENTIST_PASSWORD" \
              --from-literal=GOOGLE_PLACES_API_KEY="$GOOGLE_PLACES_API_KEY" \
              --from-literal=GOOGLE_PLACE_ID="$GOOGLE_PLACE_ID" \
              --dry-run=client -o yaml | kubectl apply -f -

            kubectl apply -f k8s/postgres.yaml
            kubectl apply -f k8s/redis.yaml
            kubectl delete job parla-db-migrate -n $K8S_NAMESPACE --ignore-not-found=true
            kubectl apply -f k8s/migration-job.yaml
            kubectl -n $K8S_NAMESPACE set image job/parla-db-migrate migrate=$BACKEND_IMAGE
            kubectl -n $K8S_NAMESPACE wait --for=condition=complete job/parla-db-migrate --timeout=180s
            kubectl apply -f k8s/backend-deployment.yaml
            kubectl apply -f k8s/frontend-deployment.yaml
            kubectl apply -f k8s/hpa.yaml
            kubectl -n $K8S_NAMESPACE set image deployment/parla-backend backend=$BACKEND_IMAGE
            kubectl -n $K8S_NAMESPACE set image deployment/parla-frontend frontend=$FRONTEND_IMAGE
            kubectl -n $K8S_NAMESPACE rollout status deployment/parla-backend --timeout=180s
            kubectl -n $K8S_NAMESPACE rollout status deployment/parla-frontend --timeout=180s
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout ${REGION}-docker.pkg.dev || true'
    }
  }
}
