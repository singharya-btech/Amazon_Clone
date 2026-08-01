# Amazon Clone — Full Stack E-Commerce

A production-ready Amazon clone built with React 19, Django 5, MySQL 8, Docker, Kubernetes, and deployed on AWS EC2.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Redux Toolkit, Tailwind CSS, React Router DOM |
| Backend | Python 3.13, Django 5, Django REST Framework, Simple JWT |
| Database | MySQL 8 |
| Web Server | Nginx |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes |
| Deployment | AWS EC2 |

---

## Project Structure

```
demoproject/
├── frontend/          # React 19 + Vite app
├── backend/           # Django REST API
│   └── apps/
│       ├── accounts/  # Auth, profiles, addresses
│       ├── products/  # Products, categories, reviews
│       ├── cart/      # Shopping cart
│       ├── orders/    # Order management
│       └── wishlist/  # Wishlist
├── nginx/             # Nginx reverse proxy config
├── kubernetes/        # K8s manifests
├── docs/              # Deployment scripts
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.13+
- Node.js 20+
- MySQL 8 running locally

### 1. Clone & Configure Environment

```bash
git clone <repo-url>
cd demoproject

# Backend env
cp .env.example backend/.env
# Edit backend/.env — set DB_PASSWORD, SECRET_KEY, JWT_SECRET

# Frontend env
echo "VITE_API_URL=http://localhost:8000/api" > frontend/.env
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE amazon_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
python manage.py migrate

# Seed sample data (categories + products)
python manage.py seed_data

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: http://localhost:8000
API Docs: http://localhost:8000/api/docs/
Admin: http://localhost:8000/admin/

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Docker Compose (Recommended)

```bash
# Copy and configure env
cp .env.example backend/.env
# Edit backend/.env with your values

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Nginx (proxy): http://localhost:80
- MySQL: localhost:3306

---

## Environment Variables

### backend/.env

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=amazon_clone
DB_USER=root
DB_PASSWORD=admin
DB_HOST=127.0.0.1   # Use 'mysql' when running in Docker
DB_PORT=3306

JWT_SECRET=your-jwt-secret-key-here
```

### frontend/.env

```env
VITE_API_URL=http://localhost:8000/api
```

---

## API Documentation

Full Swagger UI: `http://localhost:8000/api/docs/`

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT) |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PATCH | `/api/auth/profile/` | Get/update profile |
| POST | `/api/auth/change-password/` | Change password |
| GET/POST | `/api/auth/addresses/` | List/create addresses |
| GET/PATCH/DELETE | `/api/auth/addresses/<id>/` | Address detail |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List products (filter, search, sort) |
| GET | `/api/products/<slug>/` | Product detail |
| GET | `/api/products/featured/` | Featured products |
| GET | `/api/products/best-sellers/` | Best sellers |
| GET | `/api/products/categories/` | All categories |
| GET | `/api/products/categories/<slug>/products/` | Category products |
| GET/POST | `/api/products/<slug>/reviews/` | Reviews |

### Cart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/` | Get cart |
| DELETE | `/api/cart/` | Clear cart |
| POST | `/api/cart/items/` | Add item |
| PATCH | `/api/cart/items/<id>/` | Update quantity |
| DELETE | `/api/cart/items/<id>/` | Remove item |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List orders |
| POST | `/api/orders/create/` | Place order |
| GET | `/api/orders/<id>/` | Order detail |
| POST | `/api/orders/<id>/cancel/` | Cancel order |

### Wishlist Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist/` | Get wishlist |
| POST | `/api/wishlist/` | Add to wishlist |
| DELETE | `/api/wishlist/<product_id>/` | Remove from wishlist |

---

## Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml       # Edit base64 values first!
kubectl apply -f kubernetes/pv-pvc.yaml
kubectl apply -f kubernetes/mysql-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml

# Check status
kubectl get pods -n amazon-clone
kubectl get services -n amazon-clone
kubectl get ingress -n amazon-clone
```

---

## AWS EC2 Deployment

### 1. Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS
- Instance type: t3.medium (minimum)
- Security Group: Allow ports 22, 80, 443
- Assign Elastic IP

### 2. Setup Server

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@<elastic-ip>

# Run setup script
chmod +x docs/ec2-setup.sh
./docs/ec2-setup.sh

# Re-login for docker group to take effect
exit && ssh -i your-key.pem ubuntu@<elastic-ip>
```

### 3. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd demoproject

# Configure environment
cp .env.example backend/.env
nano backend/.env   # Fill in production values

# Start services
docker-compose up -d --build

# Verify
docker-compose ps
```

### 4. SSL with Let's Encrypt

```bash
# Point your domain to the EC2 Elastic IP first
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Common Errors & Solutions

### MySQL Connection Refused
```
Error: Can't connect to MySQL server
Solution: Ensure DB_HOST=mysql (Docker) or DB_HOST=127.0.0.1 (local)
```

### JWT Token Invalid
```
Error: Token is invalid or expired
Solution: Check JWT_SECRET matches in .env, clear localStorage
```

### CORS Error
```
Error: Access-Control-Allow-Origin missing
Solution: Add your frontend URL to CORS_ALLOWED_ORIGINS in settings.py
```

### Static Files 404
```
Error: /static/ returns 404
Solution: Run python manage.py collectstatic
```

### Docker Build Fails (mysqlclient)
```
Error: mysql_config not found
Solution: The Dockerfile installs default-libmysqlclient-dev automatically
```

---

## Features

- JWT Authentication with auto-refresh
- Product catalog with categories, search, filtering, sorting
- Shopping cart with quantity management
- Wishlist
- Order placement and tracking
- User profile with address management
- Password change
- Product reviews and ratings
- Responsive Amazon-style UI
- Admin panel at /admin/
- API documentation at /api/docs/
- Docker Compose for local/production
- Kubernetes manifests with HPA
- Nginx reverse proxy with rate limiting
- AWS EC2 deployment guide

---

## License

MIT
