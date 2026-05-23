# Parla Dental - 12-Factor Dental Clinic Patient Management System

Parla Dental is a web-based **Dental Clinic Patient Management System** developed as a 12-factor cloud application. The project includes a public dental clinic website and a role-based management dashboard for clinic staff.

This project was developed for the course requirement:

> **Implement a 12-factor application running on a cloud provider.**

The application is containerized with Docker, deployed on Google Kubernetes Engine, integrated with Jenkins CI/CD, and managed through GitHub version control.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Purpose](#main-purpose)
- [Main Features](#main-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [12-Factor App Compliance](#12-factor-app-compliance)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker Compose Usage](#docker-compose-usage)
- [Cloud Deployment](#cloud-deployment)
- [Kubernetes Resources](#kubernetes-resources)
- [Jenkins CI/CD Pipeline](#jenkins-cicd-pipeline)
- [Demo Accounts](#demo-accounts)
- [Useful Commands](#useful-commands)
- [Security Notes](#security-notes)
- [Demo Video Flow](#demo-video-flow)
- [Project Status](#project-status)

---

## Project Overview

Parla Dental is designed to help a dental clinic manage its daily operations in a centralized and organized way. The system supports patient registration, appointment management, dentist management, treatment history tracking, and public appointment requests.

The project has two main parts:

1. **Public Website**
   - A modern dental clinic landing page for patients.
   - Includes treatments, doctors, about section, location, Google Reviews support, and appointment request form.

2. **Management Dashboard**
   - A role-based dashboard for admin/reception staff and dentists.
   - Admin users manage patients, dentists, appointments, and web requests.
   - Dentist users manage their appointments, patients, and treatment records.

The system was developed with cloud deployment in mind and follows the 12-factor application principles.

---

## Main Purpose

The main purpose of this project is not only to build a dental clinic website, but also to demonstrate a complete cloud-ready software architecture.

The project demonstrates:

- Web application development with React and Node.js
- REST API design
- Role-based access control
- PostgreSQL database usage
- Redis caching
- Docker containerization
- Kubernetes deployment
- Google Cloud hosting
- Jenkins CI/CD automation
- Environment-based configuration
- Kubernetes Secrets and ConfigMaps
- Standard output logging
- Basic scalability with Kubernetes replicas and HPA

---

## Main Features

### Public Website

The public website includes:

- Responsive landing page
- Modern hero section
- About section for a newly opened clinic
- Treatment cards with React icons
- Doctors preview section
- Separate doctors page
- Location section with Google Maps link
- Google Reviews integration support
- Appointment request form
- Mobile-friendly design
- Clean and organized CSS structure

### Admin / Reception Dashboard

Admin users can:

- View dashboard statistics
- Add new patients
- Add new dentists
- Create appointments
- View patient list
- View dentist list
- View appointment list
- Update appointment status
- View appointment requests from the public website
- Update public request status

### Dentist Dashboard

Dentist users can:

- View their appointments
- Add new patients
- Select patients
- Add treatment records
- View treatment history
- Update appointment status

---

## User Roles

The system uses role-based access control.

### Admin / Receptionist

The admin/reception role is responsible for clinic management operations.

Main responsibilities:

- Patient registration
- Dentist registration
- Appointment creation
- Appointment tracking
- Public appointment request management

### Dentist

The dentist role is responsible for treatment-related operations.

Main responsibilities:

- Viewing appointments
- Adding patients when needed
- Recording treatment information
- Viewing patient treatment history

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, React Icons |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Cache | Redis |
| Authentication | JWT |
| Containerization | Docker |
| Local Orchestration | Docker Compose |
| Cloud Orchestration | Kubernetes |
| Cloud Provider | Google Cloud Platform |
| Kubernetes Service | Google Kubernetes Engine |
| Image Registry | Google Artifact Registry |
| CI/CD | Jenkins |
| Version Control | GitHub |
| Configuration | Environment Variables |
| Kubernetes Config | ConfigMaps and Secrets |
| Logging | stdout / Kubernetes logs |

---

## System Architecture

The project follows a separated frontend-backend architecture.

```txt
User
 |
 | HTTP Request
 v
Frontend Service
React + Nginx
 |
 | REST API Request
 v
Backend Service
Node.js + Express.js
 |
 | SQL Query
 v
PostgreSQL Database

Backend Service
 |
 | Cache Access
 v
Redis
```

In the cloud environment, these components run as Kubernetes workloads inside a namespace.

The frontend is exposed using a Kubernetes LoadBalancer service. The backend, PostgreSQL, and Redis services are used internally inside the Kubernetes cluster.

---

## Repository Structure

```txt
parla-dental-app/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── appointmentRequests.routes.js
│   │   │   ├── appointments.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── googleReviews.routes.js
│   │   │   ├── patients.routes.js
│   │   │   ├── treatments.routes.js
│   │   │   └── users.routes.js
│   │   ├── utils/
│   │   │   └── asyncHandler.js
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── migrate.js
│   │   ├── redisClient.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .env.example
│
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── postgres.yaml
│   ├── redis.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── migration-job.yaml
│   └── hpa.yaml
│
├── scripts/
│   ├── build-and-push.sh
│   ├── deploy-gke.sh
│   ├── jenkins-deploy-windows.ps1
│   └── jenkins-precheck.ps1
│
├── docker-compose.yml
├── Jenkinsfile
├── README.md
├── .gitignore
└── .env.example
```

---

## 12-Factor App Compliance

This project was designed according to the 12-factor application methodology.

| 12-Factor Principle | Implementation in This Project |
|---|---|
| 1. Codebase | The project is stored in a single GitHub repository. |
| 2. Dependencies | Frontend and backend dependencies are declared in separate `package.json` files. |
| 3. Config | Configuration is managed through environment variables, `.env.example`, Kubernetes ConfigMaps, and Kubernetes Secrets. |
| 4. Backing Services | PostgreSQL and Redis are treated as attached backing services. |
| 5. Build, Release, Run | Jenkins separates build, image push, and Kubernetes deployment stages. |
| 6. Processes | Backend and frontend run as stateless containerized processes. |
| 7. Port Binding | Backend exposes port `4000`; frontend is served by Nginx on port `80`. |
| 8. Concurrency | Kubernetes replicas and HPA allow the application to scale horizontally. |
| 9. Disposability | Containers can be restarted, replaced, and recreated by Kubernetes. |
| 10. Dev/Prod Parity | Docker Compose is used locally, and Kubernetes is used in the cloud with similar service separation. |
| 11. Logs | Application logs are written to stdout/stderr and viewed with Kubernetes logs. |
| 12. Admin Processes | Database migration and seed operations are handled through a Kubernetes Job. |

---

## Environment Variables

Real environment files are not committed to GitHub. Only example files are included.

Example files:

```txt
.env.example
backend/.env.example
frontend/.env.example
```

Important backend environment variables:

```txt
NODE_ENV
SERVICE_NAME
BUILD_VERSION
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
CORS_ORIGIN
ADMIN_PASSWORD
DENTIST_PASSWORD
AUTO_MIGRATE
LOG_SQL
REDIS_ENABLED
REDIS_URL
GOOGLE_PLACES_API_KEY
GOOGLE_PLACE_ID
GOOGLE_PLACE_SEARCH_QUERY
GOOGLE_REVIEWS_LANGUAGE
GOOGLE_REVIEWS_MAX
GOOGLE_MAPS_URL
```

Important database variables:

```txt
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
```

In Kubernetes deployment, sensitive variables are stored in Kubernetes Secrets. Non-sensitive values are stored in ConfigMaps.

---

## Local Development

### Prerequisites

To run the project locally, the following tools are required:

- Node.js
- npm
- Docker
- Docker Compose
- Git

### Clone the Repository

```bash
git clone https://github.com/Efesahin0/parla-dental-app.git
cd parla-dental-app
```

### Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the values if needed.

---

## Docker Compose Usage

The easiest way to run the project locally is Docker Compose.

```bash
docker compose up --build
```

After containers start:

Frontend:

```txt
http://localhost:3000
```

Backend:

```txt
http://localhost:4000
```

Health endpoint:

```txt
http://localhost:4000/health
```

Readiness endpoint:

```txt
http://localhost:4000/ready
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove volumes:

```bash
docker compose down -v
```

---

## Backend API Overview

Main backend routes:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | User login |
| GET | `/api/patients` | List patients |
| POST | `/api/patients` | Add patient |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Create appointment |
| PATCH | `/api/appointments/:id/status` | Update appointment status |
| GET | `/api/treatments/patient/:id` | Get treatment history |
| POST | `/api/treatments` | Add treatment record |
| GET | `/api/appointment-requests` | List public appointment requests |
| POST | `/api/appointment-requests` | Create public appointment request |
| PATCH | `/api/appointment-requests/:id/status` | Update request status |
| GET | `/api/users/dentists` | List dentists |
| POST | `/api/users/dentists` | Add dentist |
| GET | `/api/google-reviews` | Google Reviews integration endpoint |

---

## Cloud Deployment

The project is deployed on **Google Cloud Platform** using **Google Kubernetes Engine**.

Cloud components used:

- Google Kubernetes Engine
- Google Artifact Registry
- Kubernetes Deployments
- Kubernetes Services
- Kubernetes ConfigMaps
- Kubernetes Secrets
- Kubernetes Job
- Kubernetes HPA
- Jenkins CI/CD

The frontend is exposed with a LoadBalancer service. The backend is used internally by the frontend through Kubernetes service networking.

---

## Kubernetes Resources

The `k8s/` folder contains Kubernetes manifest files.

| File | Purpose |
|---|---|
| `namespace.yaml` | Creates the `parla-dental` namespace |
| `configmap.yaml` | Stores non-sensitive configuration |
| `postgres.yaml` | Deploys PostgreSQL |
| `redis.yaml` | Deploys Redis |
| `backend-deployment.yaml` | Deploys backend service |
| `frontend-deployment.yaml` | Deploys frontend service |
| `migration-job.yaml` | Runs database migration and seed process |
| `hpa.yaml` | Configures Horizontal Pod Autoscaler |

---

## Jenkins CI/CD Pipeline

Jenkins is used for automated build and deployment.

The pipeline is defined in the `Jenkinsfile`.

### Pipeline Stages

1. Checkout source code from GitHub
2. Check required tools
3. Authenticate Google Cloud
4. Build frontend
5. Install backend dependencies
6. Build backend Docker image
7. Build frontend Docker image
8. Push images to Google Artifact Registry
9. Run database migration job
10. Deploy backend to GKE
11. Deploy frontend to GKE
12. Show deployment summary

### Image Tagging

The Jenkins build number is used as the image tag.

Example:

```txt
jenkins-12
jenkins-13
jenkins-14
```

This prevents manual image tag updates and makes each deployment traceable.

---

## Scripts

The `scripts/` folder contains helper scripts for build and deployment operations.

| Script | Purpose |
|---|---|
| `build-and-push.sh` | Builds and pushes Docker images |
| `deploy-gke.sh` | Deploys the application to GKE |
| `jenkins-deploy-windows.ps1` | Deployment helper for Jenkins on Windows |
| `jenkins-precheck.ps1` | Checks required tools before running Jenkins tasks |

No secrets should be stored inside these scripts.

---

## Redis Caching

Redis is used as a caching layer. In this project, it is mainly used to support caching for external integration data such as Google Reviews.

Redis connection is configured through:

```txt
REDIS_ENABLED
REDIS_URL
GOOGLE_REVIEWS_CACHE_TTL_SECONDS
```

If Redis is not available, the backend can still continue working depending on configuration and fallback logic.

---

## Google Reviews and Maps Support

The public website includes Google Maps and Google Reviews integration support.

Google Maps location is handled through:

```txt
GOOGLE_MAPS_URL
```

Google Reviews support is handled through:

```txt
GOOGLE_PLACES_API_KEY
GOOGLE_PLACE_ID
GOOGLE_PLACE_SEARCH_QUERY
GOOGLE_REVIEWS_LANGUAGE
GOOGLE_REVIEWS_MAX
```

If Google API credentials are missing or restricted, the frontend can still display fallback review cards so the public website remains usable during demo.

---

## Demo Accounts

The migration process creates demo accounts.

### Admin Account

```txt
Email: admin@parladental.com
Password: admin123
```

### Dentist Account

```txt
Email: dentist@parladental.com
Password: dentist123
```

Additional dentist accounts may also be created during seed or from the admin dashboard.

---

## Useful Kubernetes Commands

Get pods:

```bash
kubectl get pods -n parla-dental
```

Get services:

```bash
kubectl get svc -n parla-dental
```

Get deployments:

```bash
kubectl get deployments -n parla-dental
```

Check backend logs:

```bash
kubectl logs -n parla-dental deployment/parla-backend
```

Check frontend logs:

```bash
kubectl logs -n parla-dental deployment/parla-frontend
```

Check backend image:

```bash
kubectl get deployment parla-backend -n parla-dental -o=jsonpath="{.spec.template.spec.containers[0].image}"
```

Check frontend image:

```bash
kubectl get deployment parla-frontend -n parla-dental -o=jsonpath="{.spec.template.spec.containers[0].image}"
```

Restart backend:

```bash
kubectl rollout restart deployment/parla-backend -n parla-dental
```

Restart frontend:

```bash
kubectl rollout restart deployment/parla-frontend -n parla-dental
```

Port-forward backend:

```bash
kubectl port-forward -n parla-dental service/parla-backend-service 4000:4000
```

---

## Security Notes

The repository does not include real secret values.

The following files should not be committed:

```txt
.env
.env.*
service account keys
private keys
real Kubernetes secret files
local deployment files
demo evidence files
```

The `.gitignore` file is configured to ignore sensitive and local-only files.

Sensitive values are handled through:

- Local `.env` files
- Kubernetes Secrets
- Jenkins / Google Cloud authentication configuration

---

## Demo Video Flow

A suitable demo video flow is:

1. Open the public Parla Dental website.
2. Show homepage, about section, treatments, doctors, location, and reviews.
3. Submit an appointment request from the public website.
4. Login as admin.
5. Show admin dashboard statistics.
6. Add a patient.
7. Add a dentist.
8. Create an appointment.
9. Show patient, dentist, appointment, and request lists.
10. Login as dentist.
11. Show dentist appointments.
12. Add a patient from dentist panel.
13. Add treatment record.
14. Show treatment history.
15. Show Jenkins successful pipeline.
16. Show Kubernetes pods and services.
17. Show GitHub repository structure.

---

## Project Screens / Main Pages

Main pages included in the frontend:

```txt
/
Public landing page

/hekimlerimiz
Doctors page

/login
Login page

/dashboard
Role-based dashboard redirect

/admin or dashboard route
Admin dashboard

/dentist or dashboard route
Dentist dashboard
```

The exact dashboard page is selected according to the authenticated user role.

---

## Logging and Monitoring

The backend writes logs to standard output.

Kubernetes logs can be checked using:

```bash
kubectl logs -n parla-dental deployment/parla-backend
```

A basic metrics endpoint is also available:

```txt
/metrics
```

This endpoint exposes simple backend request and uptime metrics in text format.

---

## Project Status

Current project status:

- Public website completed
- Admin dashboard implemented
- Dentist dashboard implemented
- Authentication implemented
- PostgreSQL integration completed
- Redis integration added
- Docker support completed
- Kubernetes manifests prepared
- GKE deployment completed
- Jenkins CI/CD pipeline completed
- GitHub repository prepared
- 12-factor requirements addressed

---

## Conclusion

Parla Dental demonstrates a complete 12-factor cloud application. It combines frontend development, backend API development, database management, caching, containerization, Kubernetes deployment, and CI/CD automation.

The project is suitable for demonstrating:

- Full-stack web development
- Cloud deployment
- DevOps workflow
- 12-factor application principles
- Role-based healthcare management functionality