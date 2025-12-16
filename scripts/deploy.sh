#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="iam-lab-210-234-161"
REGION="asia-southeast2"
REPO_NAME="cloud-run-source-deploy"
IMAGE_NAME="sistem-pelaporan/sistem-pelaporan-backend"

# Tag: pakai commit SHA jika tersedia, fallback timestamp
TAG="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"

IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${TAG}"

echo "==> Project : ${PROJECT_ID}"
echo "==> Region  : ${REGION}"
echo "==> Image   : ${IMAGE_URL}"

# ==========
# STEP 0: Auth docker to Artifact Registry
# ==========
echo "==> Configure docker auth for Artifact Registry..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" -q

# ==========
# STEP 1: Build BACKEND image (IMPORTANT)
# ==========
echo "==> Build backend image..."
docker build -t "${IMAGE_URL}" ./backend

# ==========
# STEP 2: Push image
# ==========
echo "==> Push image..."
docker push "${IMAGE_URL}"
echo "==> Pushed: ${IMAGE_URL}"

# ==========
# STEP 3: Terraform apply (update Cloud Run to new image)
# ==========
echo "==> Terraform init + apply..."
cd terraform

terraform init

terraform apply -auto-approve \
  -var "project_id=${PROJECT_ID}" \
  -var "region=${REGION}" \
  -var "cloud_run_image=${IMAGE_URL}"

echo "==> Deploy done."
echo "==> Cloud Run URL:"
terraform output cloud_run_backend_url
