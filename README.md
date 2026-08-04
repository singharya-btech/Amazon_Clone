<p align="center">
  <img src="frontend/src/assets/amazon-logo-white.png" alt="Amazon Clone Marketplace" width="120" />
</p>

<h1 align="center">Amazon Clone Marketplace</h1>

<p align="center">
  <a href="https://github.com/arya-singh/ACproject_V4">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/Django-6.0.7-%23267349?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/React-19-%2361DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-16-%23336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-24.0-%232496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Kubernetes-1.31-%233275A9?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-%2306B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-%23000000?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-production%20ready-brightgreen?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/architecture-microservices%20ready-blue?style=flat-square" alt="Architecture">
  <img src="https://img.shields.io/badge/deployment-docker%20%7C%20k8s-orange?style=flat-square" alt="Deployment">
  <img src="https://img.shields.io/badge/auth-JWT%20%7C%20multi--role-purple?style=flat-square" alt="Auth">
</p>

---

## 📖 Overview

A **full-stack, multi-vendor e-commerce marketplace** built from the ground up — a feature-for-feature clone of Amazon's core experience. The application supports **three distinct user roles** (Customer, Seller, Admin) with role-specific dashboards, JWT-based authentication, a RESTful API, and a responsive React frontend styled with a custom design system.

The entire stack is **containerized with Docker** and ships with **production-grade Kubernetes manifests**, making it deployment-ready on any cloud or on-premises cluster.

### ✨ What Makes This Stand Out

| ✅ | **Production-Ready Infrastructure** | Multi-stage Docker builds, health checks, Kubernetes manifests with liveness/readiness probes, resource limits, and rolling updates |
|---|---|---|
| ✅ | **Multi-Role Architecture** | Three distinct roles (Customer, Seller, Admin) with separate JWT token storage, role-based permissions, and dedicated dashboards |
| ✅ | **Offline-First Development** | The frontend gracefully falls back to a localStorage-based mock auth system when the backend is unreachable — no more blocked development |
| ✅ | **Multi-Vendor Order System** | Orders can contain items from multiple sellers; each seller updates only their own line items, with automatic order-level status reconciliation |
| ✅ | **Custom Design System** | "Atlas & Ledger" identity — a deliberate departure from Amazon's warm palette, featuring navy ink, chart-paper grey, and brass/teal accents |
| ✅ | **Comprehensive Admin Panel** | Admins can verify/flag sellers, manage products, review customer profiles, and handle support queries — all with proper permission gating |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Docker Compose / Kubernetes                      │
│                                                                         │
│  ┌──────────────────┐         ┌──────────────────┐                     │
│  │   PostgreSQL 16  │         │   Django 6.0.7   │                     │
│  │   (database)     │◄────────│   (backend)      │                     │
│  │                  │   DB    │                  │                     │
│  │  • Users          │         │  • DRF API       │                     │
│  │  • Products       │         │  • JWT Auth      │                     │
│  │  • Orders         │         │  • Gunicorn      │                     │
│  │  • Reviews        │         │  • Health Check  │                     │
│  └──────────────────┘         └────────┬─────────┘                     │
│                                        │ HTTP (proxied)                  │
│                                        ▼                                 │
│  ┌──────────────────┐         ┌──────────────────┐                     │
│  │   Nginx 1.27     │         │   React 19       │                     │
│  │   (frontend)     │◄────────│   (frontend)     │                     │
│  │                  │         │                  │                     │
│  │  • Static files  │         │  • Vite build    │                     │
│  │  • Reverse proxy │         │  • Tailwind CSS  │                     │
│  │  • envsubst      │         │  • React Router  │                     │
│  └──────────────────┘         └──────────────────┘                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Backend App Structure (Django)

```
backend/
├── config/              # Project configuration (settings, URLs, WSGI/ASGI)
├── core/                # Authentication & user management (JWT, profiles, admin)
├── products/            # Product catalog, categories, banners, search
├── cart/                # Shopping cart with JSON-based line items
├── wishlist/            # Customer wishlist
├── orders/              # Multi-vendor order management with status tracking
├── sellers/             # Seller registration, login, dashboard, admin verification
├── support/             # Customer support tickets with seller/admin replies
├── reviews/             # Product reviews with seller/admin reply system
├── manage.py
├── requirements.txt
├── Dockerfile
└── entrypoint.sh        # DB wait → migrate → collectstatic → Gunicorn
```

### Frontend App Structure (React)

```
frontend/
├── src/
│   ├── api/             # API endpoint definitions (customers, reviews, support)
│   ├── assets/          # Images, logos, category/product icons
│   ├── components/      # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── context/         # React Context (AuthContext, CartContext)
│   ├── mock/            # Mock data for offline development
│   ├── pages/           # Route-level pages (Home, Shop, Cart, Admin, Seller, etc.)
│   ├── services/        # API service layer (api.js, authService, productService, etc.)
│   ├── App.jsx          # Route definitions
│   ├── main.jsx         # App entry point with providers
│   └── index.css        # Global styles & design tokens
├── public/
├── Dockerfile           # Multi-stage: Node build → Nginx production
├── nginx.conf           # Reverse proxy config with envsubst
├── vite.config.js
└── package.json
```

---

## 🚀 Features

### 🛒 Customer Experience
- **Product browsing** — Browse by category, search, view featured products, and see product details
- **Shopping cart** — Add, update quantities, remove items, and clear the cart
- **Wishlist** — Save products for later
- **Checkout** — Full checkout flow with shipping address and order placement
- **Order tracking** — View order history and track order status
- **Product reviews** — Write reviews for purchased products and view all reviews
- **Support tickets** — Submit customer support queries and track responses

### 🏪 Seller Experience
- **Seller registration & login** — Dedicated onboarding flow with business details
- **Seller dashboard** — View and manage products, orders, and reviews
- **Order management** — Update line-item shipping status (pending → processing → shipped → delivered)
- **Review replies** — Respond to customer reviews on your products
- **Support replies** — Respond to customer queries about your products

### 👮 Admin Experience
- **Admin registration & login** — Separate admin onboarding (grants `is_staff`)
- **Seller management** — Verify, reject, flag, and remove sellers
- **Product management** — List, flag, unflag, and remove products
- **Customer management** — View, flag, unflag, and remove customer profiles
- **Review moderation** — View all reviews and reply as admin
- **Support moderation** — View all support queries and reply as admin

### 🔧 Technical Features
- **JWT Authentication** — 7-day access tokens, 30-day refresh tokens with automatic role embedding
- **Multi-role token storage** — Customer, seller, and admin tokens stored separately to prevent session conflicts
- **Health checks** — `/health/` endpoint for Docker Compose and Kubernetes probes
- **CORS configuration** — Environment-based CORS settings
- **Static & media files** — Proper Django static file collection and media serving
- **Database migrations** — Automatic migration on container startup
- **Offline mock auth** — Frontend falls back to localStorage-based auth when backend is unreachable

---

## 🛠️ Tech Stack

### Backend
| Category | Technology |
|---|---|
| Framework | Django 6.0.7 |
| API | Django REST Framework 3.17.1 |
| Authentication | JWT (djangorestframework-simplejwt 5.5.1) |
| Database | PostgreSQL 16 (psycopg2-binary 2.9.12) |
| CORS | django-cors-headers 4.9.0 |
| Filtering | django-filter 25.2 |
| Image Processing | Pillow 12.3.0 |
| Production Server | Gunicorn |
| Containerization | Docker (python:3.12-slim) |

### Frontend
| Category | Technology |
|---|---|
| Framework | React 19.2.7 |
| Build Tool | Vite 8.1.1 |
| Styling | Tailwind CSS 4.3.2 |
| Routing | React Router DOM 7.18.1 |
| HTTP Client | Axios 1.18.1 |
| Notifications | react-hot-toast 2.6.0 |
| Icons | react-icons 5.7.0 |
| Linting | Oxlint 1.71.0 |
| Production Server | Nginx 1.27-alpine |

### Infrastructure
| Category | Technology |
|---|---|
| Orchestration | Docker Compose |
| Container Registry | Docker Hub (`aryasingh1234/amazone_clone`) |
| Kubernetes | v1.31 (deployments, services, secrets, PVCs) |
| Database | PostgreSQL 16-alpine |
| Reverse Proxy | Nginx 1.27-alpine |

---

## 📡 API Endpoints

### Authentication (`/api/auth/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register/` | Register a new customer |
| POST | `/admin-register/` | Register a new admin (grants `is_staff`) |
| POST | `/login/` | Login (returns JWT access & refresh tokens) |
| POST | `/token/refresh/` | Refresh JWT access token |
| GET | `/me/` | Get current user profile |
| GET | `/profile/` | Get/update user profile |
| GET | `/profiles/` | List all user profiles |
| GET | `/admin/customers/` | List all customers (admin only) |
| POST | `/admin/customers/<id>/flag/` | Flag a customer (admin only) |
| POST | `/admin/customers/<id>/unflag/` | Unflag a customer (admin only) |
| DELETE | `/superadmin/customers/<id>/` | Remove a customer (superadmin only) |

### Products (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/categories/` | List all categories |
| GET | `/categories/<slug>/` | Get category details |
| GET | `/products/` | List all products (filterable by category) |
| GET | `/products/featured/` | List featured products |
| GET | `/products/search/` | Search products |
| GET | `/products/<slug>/` | Get product details by slug |
| GET | `/products/id/<id>/` | Get product details by ID |
| GET | `/products/admin/` | Admin product list |
| POST | `/products/admin/<id>/flag/` | Flag a product (admin only) |
| POST | `/products/admin/<id>/unflag/` | Unflag a product (admin only) |
| DELETE | `/products/admin/<id>/remove/` | Remove a product (superadmin only) |
| GET | `/banners/` | List active banners |

### Cart (`/api/cart/`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get current user's cart |
| POST | `/` | Add item to cart |
| PUT | `/items/<id>/` | Update cart item quantity |
| DELETE | `/items/<id>/` | Remove item from cart |
| DELETE | `/` | Clear cart |

### Wishlist (`/api/wishlist/`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get current user's wishlist |
| POST | `/` | Add product to wishlist |
| DELETE | `/` | Remove product from wishlist (pass `product_id` in body) |

### Orders (`/api/orders/`)
| Method | Endpoint | Description |
|---|---|---|
| GET, POST | `/` | List/create orders |
| GET | `/<id>/` | Get order details |
| DELETE | `/<id>/` | Cancel order |
| GET | `/seller/mine/` | List orders for seller's products |
| PATCH | `/seller/mine/<order_id>/items/<product_id>/status/` | Update line-item status |

### Sellers (`/api/sellers/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register/` | Register as a seller |
| POST | `/login/` | Seller login |
| GET | `/me/` | Get seller profile |
| GET, POST | `/me/products/` | List/create seller's products |
| GET, PUT, DELETE | `/me/products/<id>/` | Manage a specific product |
| GET | `/admin/` | List all sellers (admin only) |
| POST | `/admin/<id>/verify/` | Verify a seller (admin only) |
| POST | `/admin/<id>/reject/` | Reject a seller (admin only) |
| POST | `/admin/<id>/flag/` | Flag a seller (admin only) |
| POST | `/admin/<id>/unflag/` | Unflag a seller (admin only) |
| GET | `/admin/<id>/` | Get seller details (admin only) |
| GET | `/admin/<id>/products/` | List seller's products (admin only) |

### Reviews (`/api/reviews/`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/product/<id>/` | List reviews for a product |
| GET | `/eligibility/` | Check if user can review a product |
| POST | `/` | Create a review |
| GET | `/seller/mine/` | List reviews for seller's products |
| POST | `/seller/mine/<id>/reply/` | Reply to a review (seller only) |
| GET | `/admin/` | List all reviews (admin only) |
| POST | `/admin/<id>/reply/` | Reply to a review (admin only) |

### Support (`/api/support/`)
| Method | Endpoint | Description |
|---|---|---|
| GET, POST | `/queries/` | List/create support queries |
| GET | `/seller/queries/` | List queries for seller's products |
| POST | `/seller/queries/<id>/reply/` | Reply to a query (seller only) |
| GET | `/admin/queries/` | List all queries (admin only) |
| POST | `/admin/queries/<id>/reply/` | Reply to a query (admin only) |

### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health/` | Health check endpoint |

---

## 🚀 Quick Start

### Prerequisites
- **Docker** 24.0+
- **Docker Compose** 2.0+
- **kubectl** (for Kubernetes deployment)
- **Node.js** 22+ (for local frontend development)
- **Python** 3.12+ (for local backend development)

### Option 1: Docker Compose (Recommended)

The fastest way to get the entire stack running:

```bash
# 1. Clone the repository
git clone https://github.com/arya-singh/ACproject_V4.git
cd ACproject_V4

# 2. Create the .env file from the template
cp .env.example .env
# Edit .env with your preferred values (or use defaults)

# 3. Build and start all services
docker compose up --build

# 4. Apply database migrations (if not auto-applied by entrypoint)
docker compose exec backend python manage.py migrate

# 5. Create a superuser (optional, for admin access)
docker compose exec backend python manage.py createsuperuser
```

Once all services are healthy, the application is available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |
| Health Check | http://localhost:8000/health/ |

### Option 2: Local Development

#### Backend (Django)

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Set environment variables
export DJANGO_DEBUG=true
export DJANGO_SECRET_KEY=your-secret-key
export POSTGRES_DB=marketplace
export POSTGRES_USER=marketplace
export POSTGRES_PASSWORD=marketplace-local-password
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432

# 4. Run migrations
cd backend
python manage.py migrate

# 5. Start the development server
python manage.py runserver
```

#### Frontend (React + Vite)

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

The frontend dev server proxies `/api/` requests to `http://127.0.0.1:8000` automatically (configured in `vite.config.js`).

---

## ☸️ Kubernetes Deployment

The project includes production-ready Kubernetes manifests in the `k8s/` directory:

```
k8s/
├── secrets.yaml              # Kubernetes Secrets (passwords, API keys)
├── database-deployment.yaml  # PostgreSQL Deployment + PVC + Service
├── database-service.yaml     # PostgreSQL ClusterIP Service
├── backend-deployment.yaml   # Django Backend Deployment + ConfigMap + Service
├── backend-service.yaml      # Backend ClusterIP Service
├── frontend-deployment.yaml  # React Frontend Deployment + Service
├── frontend-service.yaml     # Frontend LoadBalancer Service
└── secrets.yaml              # Sensitive values (base64 or stringData)
```

### Deploy to Kubernetes

```bash
# 1. Update the secrets with your own values
kubectl apply -f k8s/secrets.yaml

# 2. Deploy the database
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/database-service.yaml

# 3. Deploy the backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# 4. Deploy the frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# 5. Verify all pods are running
kubectl get pods -o wide

# 6. Check service endpoints
kubectl get services
```

> **Note:** The Kubernetes manifests reference Docker Hub images (`aryasingh1234/amazone_clone:backend-v2` and `frontend-v2`). Update these to your own image registry before deploying.

---

## ⚙️ Environment Variables

All environment variables are defined in `.env` (for Docker Compose) and in the Kubernetes ConfigMaps/Secrets.

### Database
| Variable | Default | Description |
|---|---|---|
| `POSTGRES_DB` | `marketplace` | PostgreSQL database name |
| `POSTGRES_USER` | `marketplace` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `marketplace-local-password` | PostgreSQL password |
| `POSTGRES_HOST` | `database-service` | Database host (Docker service name) |
| `POSTGRES_PORT` | `5432` | Database port |

### Django Backend
| Variable | Default | Description |
|---|---|---|
| `DJANGO_DEBUG` | `false` | Enable/disable Django debug mode |
| `DJANGO_SECRET_KEY` | `local-development-secret-change-before-production` | Django secret key |
| `DJANGO_ALLOWED_HOSTS` | `*` | Comma-separated allowed hosts |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | — | CSRF trusted origins |
| `CORS_ALLOW_ALL_ORIGINS` | `true` | Allow all CORS origins |
| `CORS_ALLOWED_ORIGINS` | — | Comma-separated CORS origins |

### Gunicorn
| Variable | Default | Description |
|---|---|---|
| `GUNICORN_WORKERS` | `2` | Number of Gunicorn worker processes |
| `GUNICORN_THREADS` | `4` | Threads per worker |
| `GUNICORN_TIMEOUT` | `60` | Worker timeout in seconds |

### Frontend
| Variable | Default | Description |
|---|---|---|
| `BACKEND_HOST` | `backend-service` | Backend host for nginx proxy |
| `BACKEND_PORT` | `8000` | Backend port for nginx proxy |
| `VITE_API_URL` | `/api` | API base URL for Vite build |

---

## 🎨 Design System

The frontend uses a custom **"Atlas & Ledger"** design system with a distinctive color palette:

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#131F35` | Primary text / headings |
| `--ink-2` | `#1E2F52` | Secondary text |
| `--paper` | `#EAEDE7` | Page background |
| `--surface` | `#FFFFFF` | Card / surface background |
| `--line` | `#D3D2C4` | Borders / dividers |
| `--brass` | `#B4813C` | Primary accent / buttons |
| `--teal` | `#1F6F63` | Secondary accent / verified badges |
| `--rust` | `#A34832` | Error / warning states |

**Typography:**
- **Display:** Fraunces (serif) — headings
- **Body:** IBM Plex Sans — body text
- **Mono:** IBM Plex Mono — badges, code

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Linting
```bash
cd frontend
npm run lint
```

### Frontend Preview
```bash
cd frontend
npm run preview
```

---

## 📁 Project Structure

```
ACproject_V4/
├── .env                  # Environment variables (Docker Compose)
├── .gitignore
├── docker-compose.yml    # Multi-service Docker Compose (DB, backend, frontend)
├── README.md             # This file
├── backend/              # Django REST API
│   ├── config/           # Project settings, URLs, WSGI/ASGI
│   ├── core/             # Auth, user profiles, admin customer management
│   ├── products/         # Products, categories, banners, search
│   ├── cart/             # Shopping cart
│   ├── wishlist/         # Wishlist
│   ├── orders/           # Multi-vendor orders, status tracking
│   ├── sellers/          # Seller onboarding, dashboard, admin verification
│   ├── support/          # Customer support tickets
│   ├── reviews/          # Product reviews with replies
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/             # React SPA
│   ├── src/
│   │   ├── api/          # API endpoint definitions
│   │   ├── assets/       # Images, logos, icons
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Context providers
│   │   ├── mock/         # Mock data
│   │   ├── pages/        # Route-level pages
│   │   ├── services/     # API service layer
│   │   ├── App.jsx       # Routes
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── public/
│   ├── Dockerfile        # Multi-stage: Node → Nginx
│   ├── nginx.conf        # Reverse proxy config
│   ├── vite.config.js
│   └── package.json
└── k8s/                  # Kubernetes manifests
    ├── secrets.yaml
    ├── database-deployment.yaml
    ├── database-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    └── frontend-service.yaml
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/your-feature`
3. **Make your changes** and commit: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feat/your-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new backend functionality
- Ensure the frontend lints cleanly (`npm run lint`)
- Update the README and API documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Arya Singh** — Full-Stack Developer

- [GitHub](https://github.com/arya-singh)
- [Docker Hub](https://hub.docker.com/u/aryasingh1234)

---

<p align="center">
  <sub>Built with ❤️ using Django, React, Docker, and Kubernetes</sub>
</p>
