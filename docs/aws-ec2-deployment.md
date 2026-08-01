# AWS EC2 Production Deployment Guide for Amazon Clone

This guide provides end-to-end instructions for deploying the Amazon Clone full-stack application on an **AWS EC2** instance using **Docker Compose** or **Kubernetes**.

---

## Architecture Overview

```text
  [ Client Browser ]
         │ (HTTPS Port 443)
         ▼
  [ Nginx Web Server / Ingress Proxy ]
    ├── /           ──► [ React Frontend (Port 80 / Port 3000) ]
    ├── /api/       ──► [ Django REST Backend (Port 8000) ]
    └── /media/     ──► [ Static Media Storage Volume ]
                            │
                            ▼
                    [ MySQL 8 Database (Port 3306) ]
```

---

## Step 1: AWS EC2 Instance Provisioning

1. Log in to the AWS Management Console and navigate to **EC2**.
2. Click **Launch Instance**.
3. **Name**: `Amazon-Clone-Production`
4. **AMI**: Ubuntu Server 22.04 LTS (64-bit x86)
5. **Instance Type**: `t3.medium` (2 vCPU, 4 GiB RAM recommended for Docker Compose / Kubernetes)
6. **Key Pair**: Create or select an existing `.pem` RSA SSH key pair (e.g., `amazon-key.pem`).
7. **Storage**: Configure 30 GB GP3 Root EBS Volume.

### Security Group Settings

Configure Inbound Rules as follows:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| SSH | TCP | 22 | My IP / `0.0.0.0/0` | Secure shell administration |
| HTTP | TCP | 80 | `0.0.0.0/0` | Web HTTP traffic |
| HTTPS | TCP | 443 | `0.0.0.0/0` | Web HTTPS traffic (SSL) |
| Custom TCP | TCP | 8000 | `0.0.0.0/0` | Direct Backend API access (Optional) |

---

## Step 2: Connect to EC2 & Install Dependencies

```bash
# Connect via SSH
ssh -i "amazon-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>

# Update System Packages
sudo apt update && sudo apt upgrade -y

# Install Git, Curl, and Prerequisites
sudo apt install -y git curl apt-transport-https ca-certificates software-properties-common

# Install Docker Engine & Docker Compose
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker Installation
docker --version
docker compose version
```

---

## Step 3: Deployment Option A - Docker Compose (Recommended for single-instance)

```bash
# Clone the repository onto EC2
git clone https://github.com/your-org/amazon-clone.git /home/ubuntu/amazon-clone
cd /home/ubuntu/amazon-clone

# Create environment configuration files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update secrets in backend/.env
nano backend/.env
# Set DJANGO_SECRET_KEY, DB_PASSWORD, JWT_SECRET

# Build and start all services in background
docker compose up -d --build

# Run Django migrations inside backend container
docker compose exec backend python manage.py migrate

# Seed catalog database with initial categories and products
docker compose exec backend python manage.py shell -c "import seed_data"

# Check container statuses
docker compose ps
```

---

## Step 4: Deployment Option B - Kubernetes (K3s / MicroK8s)

```bash
# Install lightweight Kubernetes (K3s)
curl -sfL https://get.k3s.io | sh -

# Verify cluster nodes
sudo k3s kubectl get nodes

# Apply Kubernetes Manifests
cd /home/ubuntu/amazon-clone/kubernetes
sudo k3s kubectl apply -f 00-namespace.yaml
sudo k3s kubectl apply -f 01-secret.yaml
sudo k3s kubectl apply -f 02-configmap.yaml
sudo k3s kubectl apply -f 03-pv-pvc.yaml
sudo k3s kubectl apply -f 04-mysql.yaml
sudo k3s kubectl apply -f 05-backend.yaml
sudo k3s kubectl apply -f 06-frontend.yaml
sudo k3s kubectl apply -f 07-ingress.yaml
sudo k3s kubectl apply -f 08-hpa.yaml

# Monitor deployment progress
sudo k3s kubectl get pods -n amazon-clone -w
```

---

## Step 5: Elastic IP, Domain Name & SSL Configuration

### 1. Associate AWS Elastic IP
1. In AWS EC2 console, go to **Network & Security -> Elastic IPs**.
2. Click **Allocate Elastic IP address**.
3. Select your allocated IP and click **Actions -> Associate Elastic IP address**.
4. Select your `Amazon-Clone-Production` instance and bind it.

### 2. Configure DNS A Record
In your DNS provider (e.g., Route53, Cloudflare, Namecheap):
- Type: `A`
- Host: `@` (or `amazon`)
- Value: `<YOUR_ELASTIC_IP>`

### 3. Install SSL Certificate with Certbot (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtain and automatically configure SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal dry run
sudo certbot renew --dry-run
```

---

## Troubleshooting & Useful Maintenance Commands

```bash
# View Backend Logs
docker compose logs -f backend

# View Nginx Logs
docker compose logs -f nginx

# Restart Services
docker compose restart

# Stop & Remove Containers
docker compose down -v
```
