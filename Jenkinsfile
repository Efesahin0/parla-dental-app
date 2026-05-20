pipeline {
  agent any

  environment {
    PROJECT_ID = 'dental-clinic-project-496416'
    REGION = 'europe-west1'
    REPOSITORY = 'parla-dental'
    CLUSTER_NAME = 'parla-cluster'
    CLUSTER_ZONE = 'europe-west1-b'
    NAMESPACE = 'parla-dental'
    IMAGE_TAG = "jenkins-${BUILD_NUMBER}"

    BACKEND_IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-backend:${IMAGE_TAG}"
    FRONTEND_IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/parla-frontend:${IMAGE_TAG}"
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
        withCredentials([file(credentialsId: 'gcp-service-account-json', variable: 'GCP_KEY_FILE')]) {
          bat '''
            gcloud auth activate-service-account --key-file="%GCP_KEY_FILE%"
            gcloud config set project %PROJECT_ID%
            gcloud auth configure-docker %REGION%-docker.pkg.dev --quiet
            gcloud container clusters get-credentials %CLUSTER_NAME% --zone %CLUSTER_ZONE% --project %PROJECT_ID%
          '''
        }
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
        bat 'docker build -t "%BACKEND_IMAGE%" ./backend'
        bat 'docker build -t "%FRONTEND_IMAGE%" ./frontend'
      }
    }

    stage('Docker Push') {
      steps {
        bat 'docker push "%BACKEND_IMAGE%"'
        bat 'docker push "%FRONTEND_IMAGE%"'
      }
    }

    stage('Deploy to GKE') {
      steps {
        powershell '''
          powershell -ExecutionPolicy Bypass -File scripts\\jenkins-deploy-windows.ps1 `
            -ProjectId "%PROJECT_ID%" `
            -Region "%REGION%" `
            -Repository "%REPOSITORY%" `
            -Tag "%IMAGE_TAG%" `
            -ClusterName "%CLUSTER_NAME%" `
            -ClusterZone "%CLUSTER_ZONE%" `
            -Namespace "%NAMESPACE%"
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
