# Amazon Clone REST API Documentation

Base URL: `http://localhost:8000/api` (Local) or `https://yourdomain.com/api` (Production)

---

## Authentication Endpoints (`/api/accounts/`)

### 1. User Registration
- **POST** `/api/accounts/register/`
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "Password123!",
    "confirm_password": "Password123!"
  }
  ```
- **Response** (210 Created):
  ```json
  {
    "message": "User registered successfully",
    "user": { "id": 1, "username": "johndoe", "email": "john@example.com" },
    "access": "<JWT_ACCESS_TOKEN>",
    "refresh": "<JWT_REFRESH_TOKEN>"
  }
  ```

### 2. User Login
- **POST** `/api/accounts/login/`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "Password123!"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "access": "<JWT_ACCESS_TOKEN>",
    "refresh": "<JWT_REFRESH_TOKEN>",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
  ```

### 3. Refresh Token
- **POST** `/api/accounts/token/refresh/`
- **Request Body**: `{ "refresh": "<JWT_REFRESH_TOKEN>" }`

### 4. User Profile
- **GET** `/api/accounts/profile/` *(Header: `Authorization: Bearer <TOKEN>`)*
- **PUT** `/api/accounts/profile/`

### 5. Address Management
- **GET** `/api/accounts/addresses/`
- **POST** `/api/accounts/addresses/`
- **DELETE** `/api/accounts/addresses/<id>/`

---

## Product Endpoints (`/api/products/`)

### 1. List Products
- **GET** `/api/products/`
- **Query Parameters**:
  - `search`: Filter title/description
  - `category`: Category slug/ID
  - `min_price` & `max_price`: Price filter
  - `min_rating`: Minimum rating (1-5)
  - `ordering`: `price_asc`, `price_desc`, `-rating`, `-created_at`
- **Response**: Array of product objects including category, rating, image URLs, and discount percentage.

### 2. Product Details
- **GET** `/api/products/<slug>/`
- **Response**: Detailed product object with images, specs list, customer reviews, and related products.

### 3. List Categories
- **GET** `/api/products/categories/`

---

## Cart Endpoints (`/api/cart/`)

### 1. View Cart
- **GET** `/api/cart/` *(Authenticated)*

### 2. Add Item to Cart
- **POST** `/api/cart/add/`
- **Request Body**: `{ "product_id": 1, "quantity": 2 }`

### 3. Update Item Quantity
- **PUT** `/api/cart/update/<item_id>/`
- **Request Body**: `{ "quantity": 3 }`

### 4. Remove Item
- **DELETE** `/api/cart/remove/<item_id>/`

---

## Wishlist Endpoints (`/api/wishlist/`)

### 1. View Wishlist
- **GET** `/api/wishlist/` *(Authenticated)*

### 2. Toggle Item in Wishlist
- **POST** `/api/wishlist/toggle/`
- **Request Body**: `{ "product_id": 1 }`

---

## Order Endpoints (`/api/orders/`)

### 1. Create Order
- **POST** `/api/orders/create/`
- **Request Body**:
  ```json
  {
    "shipping_address": {
      "full_name": "John Doe",
      "address_line1": "123 Main St",
      "city": "Seattle",
      "state": "WA",
      "postal_code": "98101",
      "country": "USA",
      "phone": "+1234567890"
    },
    "payment_method": "Credit Card"
  }
  ```

### 2. Order History
- **GET** `/api/orders/` *(Authenticated)*

### 3. Order Details
- **GET** `/api/orders/<id>/` *(Authenticated)*
