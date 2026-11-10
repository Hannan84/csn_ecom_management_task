# E-Commerce Management System (Shared Catalog Platform)

A multi-tenant e-commerce management platform built with **Laravel (PHP)**, **Inertia.js**, and **React (TypeScript)**. 

The application enables administrators to manage shops and a global product catalog, while shop owners can curate listings from the shared catalog into their own shops, create new products for the shared pool, and customize shop-specific prices, descriptions, and thumbnails. Customers can browse active shops and view shop-specific listings.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Step-by-Step Setup & Installation](#step-by-step-setup--installation)
- [Database Configuration & Seeding](#database-configuration--seeding)
- [Pre-configured Demo Accounts](#pre-configured-demo-accounts)
- [User Roles & Functional Workflow](#user-roles--functional-workflow)
- [Running Automated Tests](#running-automated-tests)

---

## Features

### 1. Admin Panel (`/admin/*`)
- **Authentication & RBAC**: Admin-only route protection with dedicated middleware.
- **Shop Management (CRUD)**: Create, view, update, and delete shops, assign/reassign shop owners, and toggle shop active status.
- **Shared Product Catalog (CRUD)**: Manage global shared products with images, base pricing, and descriptions.
- **Shop Owner Management**: Create and manage shop owner user accounts.

### 2. Shop Owner Management (`/shop-owner/*`)
- **Shared Product Catalog Browser**: Browse all products added by admins or fellow shop owners, search items, and add them to their own shop with a single click.
- **Product Creation**: Shop owners can create new products; newly created items automatically join the shared catalog and are listed in the creator's shop.
- **Shop-Specific Customization**: Modify prices, custom descriptions, and upload custom thumbnails for products listed in their shop without altering catalog defaults.
- **Shop Product Management**: Remove products from their shop at any time.

### 3. Customer Storefront (`/` and `/shops/{id}`)
- **Public Marketplace**: The home route `/` opens directly into the storefront showcasing all active shops.
- **Assigned Products Only**: Customers only see products assigned to a specific shop. Unassigned shared catalog products are strictly hidden.
- **Shop-Specific Pricing & Details**: Displays each shop's customized prices, thumbnails, and descriptions, falling back cleanly to base catalog values when defaults are used.

---

## Tech Stack
- **Backend**: Laravel 13 (PHP 8.3+)
- **Frontend**: React 19, TypeScript, Inertia.js v3
- **Styling**: Tailwind CSS v4, Radix UI, Lucide React
- **Database**: MySQL

---

## System Requirements
- **PHP**: `^8.2`
- **Composer**: `^2.0`
- **Node.js**: `^18.0` or `^20.0`
- **NPM**: `^9.0` or `^10.0`
- **Database**: MySQL `^8.0`

---

## Step-by-Step Setup & Installation

Follow these steps to set up and run the application from a fresh setup:

### 1. Clone the Repository
```bash
git clone https://github.com/Hannan84/csn_ecom_management_task.git
cd csn_ecom_management_task
```

### 2. Install Backend Dependencies
```bash
composer install
```

### 3. Environment Configuration
Copy `.env.example` to create `.env`:
```bash
# On Linux / macOS / Git Bash
cp .env.example .env

# On Windows PowerShell
Copy-Item .env.example .env
```

Generate the application encryption key:
```bash
php artisan key:generate
```

### 4. Database Setup
Create a new database in MySQL (for example, named `csn_ecom_task`):
```sql
CREATE DATABASE csn_ecom_task CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update your `.env` database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=csn_ecom_task
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Run Database Migrations and Seeders
Execute the migrations and populate sample data (demo shops, products, accounts):
```bash
php artisan migrate:fresh --seed
```

### 6. Create Storage Symlink
Link the public storage directory to enable product image uploads:
```bash
php artisan storage:link
```

### 7. Install Frontend Dependencies & Build Assets
```bash
npm install
npm run build
```

### 8. Start the Local Server
```bash
php artisan serve
```

Visit the application in your browser at:
```
http://localhost:8000
```

---

## Pre-configured Demo Accounts

All demo accounts are seeded automatically. Password for all accounts is: `password`

| Role | Email | Password | Access / Assigned Shop |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `password` | Full Admin Panel (`/admin/shops`, `/admin/products`, `/admin/shop-owners`) |
| **Shop Owner 1** | `shop1@gmail.com` | `password` | *John's Electronics* (`/shop-owner/catalog`, `/shop-owner/shop-products`) |
| **Shop Owner 2** | `shop1@gmail.com` | `password` | *Jane's Fashion Store* (`/shop-owner/catalog`, `/shop-owner/shop-products`) |

---

## User Roles & Functional Workflow

### Customer Journey
1. Navigate to `http://localhost:8000/`.
2. Browse active shops and click **Visit Shop**.
3. View the shop's product list with custom pricing and details. Products not assigned to this shop are hidden.

### Admin Journey
1. Log in with `admin@gmail.com` / `password`.
2. Go to **Dashboard** or navigate to:
   - **Shops (`/admin/shops`)**: Create new shops or assign shop owners.
   - **Products (`/admin/products`)**: Add base catalog products with images.
   - **Shop Owners (`/admin/shop-owners`)**: Create new shop owner accounts or delete existing ones.

### Shop Owner Journey
1. Log in with `shop1@gmail.com` / `password`.
2. Go to:
   - **Shared Catalog (`/shop-owner/catalog`)**: Browse catalog items and click **Add to My Shop**.
   - **Create Product (`/shop-owner/shop-products/create`)**: Add a new product; it is listed in the shop and becomes available for all other owners.
   - **Customize Listing (`/shop-owner/shop-products/{id}/edit`)**: Customize shop-specific price, description, and thumbnail image.

---

## Running Automated Tests

A comprehensive test suite covers authentication, role authorization, shop and product management, shared catalog pool, shop-specific customizations, and customer storefront isolation:

```bash
php artisan test
```

To run the dedicated e-commerce feature tests specifically:
```bash
php artisan test --filter=EcomManagementTest
```



