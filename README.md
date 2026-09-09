# Quecto: Revolutionizing Local Commerce

[![Next.js](https://img.shields.io/badge/Next.js-14%2F15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.23+-00ADD8?style=flat&logo=go)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-NeonDB%20Postgres-336791?style=flat&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Empowering neighborhood retail, dismantling quick-commerce monopolies, and fostering inclusive, community-driven digital commerce.**

---

## 📖 Executive Summary & Vision

In the rapidly evolving landscape of retail and quick-commerce, monopolistic dark-store platforms impose heavy platform charges, exorbitant delivery fees, and exclusionary margins that sideline neighborhood brick-and-mortar businesses. 

**Quecto** bridges this digital divide by providing local shops (groceries, kirana stores, bakeries, pharmacies, and fresh produce vendors) with an enterprise-grade digital storefront while preserving their independence.

### Key Pillars of Quecto

1. **Merchant Delivery Autonomy**: Rather than relying on centralized gig-economy couriers with high surcharges, shopkeepers retain complete ownership of their localized delivery services.
2. **Dynamic Fee Competition**: Local merchants set competitive delivery rates—frequently offering free delivery above modest thresholds (e.g., ₹199)—directly driving customer loyalty and passing savings to consumers.
3. **Inclusivity & Accessibility**: Specifically designed to support elderly and disabled community members with high-contrast UI, one-click ordering, simple phone-call / assisted delivery options, and transparent status updates.
4. **Tiered Shop Onboarding**: Accommodates stores of any size—from small local vendors with concise daily catalogs to high-volume supermarkets with multi-category inventories.
5. **Flexible Payment Modes**: Full support for Cash on Delivery (COD) and direct UPI integration for frictionless transactions.

---

## 🏛️ System Architecture

Quecto is engineered with a modular, decoupled architecture consisting of a **Consumer Frontend**, a **Shopkeeper Admin Portal**, and a high-throughput **Go REST Backend** connected to **NeonDB PostgreSQL**.

```
                           ┌─────────────────────────────────────────┐
                           │            NeonDB PostgreSQL            │
                           │       (Cloud Serverless Postgres)       │
                           └────────────────────▲────────────────────┘
                                                │
                                                │ SSL connection (pgx)
                                                │
                           ┌────────────────────┴────────────────────┐
                           │               Go Backend                │
                           │         (REST API / Port 8080)          │
                           │  - Health & Ping                        │
                           │  - Shops & Storefront API               │
                           │  - Product Catalog & Stock API          │
                           │  - Order Lifecycle & Status Engine      │
                           │  - Merchant Analytics & Stats           │
                           └──────▲───────────────────────────▲──────┘
                                  │                           │
                   REST JSON API  │                           │  REST JSON API
                                  │                           │
          ┌───────────────────────┴──────┐     ┌──────────────┴────────────────┐
          │      Consumer Frontend       │     │     Shopkeeper Admin Portal   │
          │     (Next.js / Port 3000)    │     │     (Next.js / Port 3001)     │
          │  - Hyperlocal Shop Finder    │     │  - Live Order Pipeline        │
          │  - Real-time Product Catalog │     │  - Inventory & Stock Editor   │
          │  - Cart & Checkout (COD/UPI) │     │  - Delivery Fee Rules         │
          │  - Order Live Tracking       │     │  - Revenue & Sales Analytics  │
          │  - About & Inclusivity Story │     │  - Store Status Open/Close    │
          └──────────────────────────────┘     └───────────────────────────────┘
```

---

## 📂 Repository Structure

```
QUECTO/
├── .gitignore                    # Root gitignore for Node, Next.js, Go, environment files
├── README.md                     # Comprehensive project documentation
├── docs/                         # Preserved project papers, presentations & research docs
│   ├── Quecto Revolutionizing Local Commerce.pdf
│   ├── Quecto Revolutionizing Local Commerce.pptx
│   ├── quecto papers.txt
│   └── legacy-assets/            # Preserved graphics, slide captures & icons
│
├── frontend/                     # Consumer Next.js Web App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page (Hero, How It Works, Role Cards, CTA)
│   │   │   ├── shops/
│   │   │   │   ├── page.tsx      # Nearby shops directory with category filters & search
│   │   │   │   └── [id]/page.tsx # Storefront & product catalog with instant cart counters
│   │   │   ├── checkout/page.tsx # Cart review, delivery address, COD/UPI payment
│   │   │   ├── order/[id]/page.tsx # Live order confirmation & tracking
│   │   │   ├── about/page.tsx    # Mission, comparison vs quick commerce, Quecto philosophy
│   │   │   ├── contact/page.tsx  # Help center, contact form, emergency phone support
│   │   │   ├── layout.tsx        # Responsive navigation & footer layout
│   │   │   └── globals.css       # Design tokens & Tailwind styles
│   │   ├── components/           # Navbar, Footer, CartDrawer, ShopCard, ProductCard
│   │   ├── context/              # CartContext and LocationContext
│   │   └── lib/api.ts            # Client SDK with Go backend connectivity & mock fallback
│   ├── package.json
│   └── tailwind.config.js
│
├── admin/                        # Shopkeeper Admin & Merchant Portal
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Merchant dashboard (Metrics, revenue, recent orders)
│   │   │   ├── orders/page.tsx   # Live order pipeline (Pending -> Accepted -> Out -> Delivered)
│   │   │   ├── inventory/page.tsx # Product catalog, stock update, add product modal
│   │   │   ├── settings/page.tsx # Shop profile, delivery fee rules, opening hours, UPI QR
│   │   │   ├── layout.tsx        # Merchant sidebar layout with quick open/closed toggle
│   │   │   └── globals.css
│   │   ├── components/           # StatCard, OrderCard, ProductModal, Sidebar
│   │   └── lib/api.ts            # Admin API client connecting to Go backend
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                      # Go REST Backend
    ├── cmd/api/main.go           # Server entry point, routing, and graceful shutdown
    ├── internal/
    │   ├── config/config.go      # Configuration & environment variables
    │   ├── database/
    │   │   ├── db.go             # PostgreSQL connection with pgx & SSL mode
    │   │   └── migrations.go     # Auto schema migration and initial seed data
    │   ├── models/models.go      # Shop, Product, Order, OrderItem structs
    │   ├── handlers/             # REST HTTP handlers for shops, products, orders, stats
    │   └── middleware/           # CORS, structured logger, panic recovery
    ├── migrations/001_init.sql   # PostgreSQL DDL for NeonDB
    ├── .env.example              # NeonDB connection URL template
    ├── go.mod
    └── go.sum
```

---

## ⚡ REST API Specifications

The Go backend exposes clean, RESTful JSON endpoints:

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service health status & DB connectivity | Public |
| `GET` | `/api/shops` | List nearby shops (supports `?category=` & `?q=`) | Consumer / Public |
| `GET` | `/api/shops/:id` | Get details for a specific shop | Consumer / Public |
| `GET` | `/api/shops/:id/products` | Get catalog & stock for a shop | Consumer / Public |
| `POST` | `/api/orders` | Place a customer order with items | Consumer |
| `GET` | `/api/orders/:id` | Get status and details of an order | Consumer / Admin |
| `GET` | `/api/orders` | List merchant orders (supports `?shop_id=` & `?status=`) | Admin |
| `PATCH`| `/api/orders/:id/status` | Advance order status (`accepted`, `out_for_delivery`, `delivered`, `cancelled`) | Admin |
| `POST` | `/api/products` | Create a new product in the catalog | Admin |
| `PUT`  | `/api/products/:id` | Update product details, price, or stock count | Admin |
| `DELETE`| `/api/products/:id` | Remove a product from the catalog | Admin |
| `GET` | `/api/admin/stats` | Retrieve sales analytics, revenue, and active orders | Admin |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Go**: v1.21 or higher
- **PostgreSQL**: NeonDB connection URL (or local PostgreSQL)

---

### 1. Backend Setup (Go & NeonDB)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your NeonDB connection string:
   ```env
   PORT=8080
   DATABASE_URL=postgres://neondb_owner:YOUR_PASSWORD@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   > *Note: If `DATABASE_URL` is omitted or inaccessible, the Go server automatically falls back to an in-memory mock store so all frontends work out-of-the-box!*

4. Run the Go backend:
   ```bash
   go run ./cmd/api
   ```
   The API will listen at `http://localhost:8080`. Verify with `curl http://localhost:8080/api/health`.

---

### 2. Consumer Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to browse nearby shops, add items to cart, and place orders.

---

### 3. Shopkeeper Admin Portal Setup (Next.js)

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the merchant development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to manage live orders, adjust stock counts, toggle open/closed status, and configure delivery parameters.

---

## 🗄️ Database Schema & NeonDB Integration

The platform uses a relational schema optimized for ACID transactions, real-time inventory counts, and order auditability:

```sql
-- Shops Table
CREATE TABLE IF NOT EXISTS shops (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 5.0,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    min_order NUMERIC(10,2) DEFAULT 0.00,
    is_open BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    shop_id VARCHAR(64) REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT '1 item',
    stock INT DEFAULT 10,
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    shop_id VARCHAR(64) REFERENCES shops(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'COD',
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64),
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);
```

---

## 🤝 Community & Support

Quecto is dedicated to revolutionizing local commerce and building resilient neighborhood ecosystems.

- **Team**: The Quecto Team
- **Inquiries & Partnerships**: [quecto@gmail.com](mailto:quecto@gmail.com)
- **Support Hotline**: `+91-9369831243`
- **Academic Origin**: Indian Institute of Information Technology, Lucknow (IIIT Lucknow)

---

*© Quecto. Empowering local communities and transforming neighborhood commerce.*
