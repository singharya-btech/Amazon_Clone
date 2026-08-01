#!/bin/bash
# ============================================================
# Amazon Clone - AWS EC2 Setup Script
# Run this on a fresh Ubuntu 22.04 EC2 instance
# ============================================================

set -e

echo "=== Updating system ==="
sudo apt-get update && sudo apt-get upgrade -y

echo "=== Installing Docker ==="
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "=== Adding user to docker group ==="
sudo usermod -aG docker $USER

echo "=== Installing Docker Compose ==="
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "=== Installing Git ==="
sudo apt-get install -y git

echo "=== Installing Certbot (Let's Encrypt) ==="
sudo apt-get install -y certbot python3-certbot-nginx

echo "=== Configuring UFW Firewall ==="
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8000/tcp  # Django (dev only)
sudo ufw --force enable

echo "=== Setup complete! ==="
echo "Next steps:"
echo "1. Clone your repository"
echo "2. Copy .env.example to backend/.env and fill in values"
echo "3. Run: docker-compose up -d"
echo "4. Run: sudo certbot --nginx -d your-domain.com"
