# InventoryFlow – Modern Inventory & Order Management Platform

InventoryFlow is a production-grade, highly-responsive B2B SaaS web application designed for small businesses, retail stores, warehouses, and distributors to manage products, customers, stock levels, and order fulfillment ledgers in one central system.

It features a FastAPI backend, a React frontend built with Vite, and a PostgreSQL database. It is fully containerized using Docker and Docker Compose for instant, reliable cloud or local deployments.

---

## 🚀 Key Highlights & Tech Stack

- **Backend Architecture**: Asynchronous **FastAPI** (Python 3.11) with **SQLAlchemy 2.0** ORM and **asyncpg** driver for ultra-low database latency.
- **Frontend Architecture**: **React 19** with **Vite** and **Recharts** for interactive, responsive data charting and animations.
- **Styling & Premium UI**: Custom premium Vanilla CSS design system featuring slate tones, glassmorphism (`backdrop-filter`), micro-animations, animated statistics counters, and collapsible layout sidebars.
- **Database**: **PostgreSQL 15** with structured integrity constraints, relational cascade rollbacks, and unique keys.
- **Containerization**: Dual-stage Docker builds. Frontend compiled statically and served using high-performance **Nginx** blocks.
- **Business Rules Enforcement**: 
  - Transactional rollback: Any error during order creation automatically undoes database writes.
  - Strict stock management: Prevents inventory from going negative, auto-restores stock on order cancellation/deletion.
  - SKU & Email uniqueness constraints.

---

## 📂 Project Directory Structure

```
c:\Inventory & Order Management System
├── docker-compose.yml              # Multi-container local orchestration
├── README.md                       # Comprehensive guide and testing walk
├── .env.example                    # Template environment file
├── backend/
│   ├── Dockerfile                  # Python container specification
│   ├── requirements.txt            # Core python dependencies
│   └── app/
│       ├── main.py                 # FastAPI application & error middleware
│       ├── database/
│       │   ├── session.py          # SQLAlchemy async engine & db injection
│       │   ├── models.py           # DB declarations (Product, Customer, Order)
│       │   └── seed.py             # High-fidelity DB seeding script
│       ├── api/
│       │   ├── products.py         # Paginated catalog & search endpoints
│       │   ├── customers.py        # Profiling & purchase logs endpoints
│       │   ├── orders.py           # Placement & status endpoints
│       │   └── dashboard.py        # Gross counters & charting aggregation
│       ├── schemas/
│       │   ├── products.py         # Pydantic product input/output schemas
│       │   ├── customers.py        # Pydantic client and profile schemas
│       │   └── orders.py           # Pydantic transactional order schemas
│       ├── services/
│       │   ├── product_service.py  # Product operations logic & locks
│       │   ├── customer_service.py # Customer lifetime value aggregator
│       │   └── order_service.py    # Order transaction manager
│       └── utils/
│           └── errors.py           # Custom business exceptions
└── frontend/
    ├── Dockerfile                  # Node build & multi-stage Alpine Nginx
    ├── package.json                # React packages & Recharts
    ├── vite.config.js              # Vite compilers config
    ├── index.html                  # HTML5 base frame
    ├── nginx.conf                  # Static asset router & SPA fallback config
    └── src/
        ├── main.jsx                # DOM mounting
        ├── App.jsx                 # Dynamic router & role page guards
        ├── index.css               # Custom design system CSS Variables
        ├── components/             # Layout Sidebar, Header, StatCards, Modals
        ├── pages/                  # Landing, Dashboard, Catalog, Clients, Orders
        └── services/
            └── api.js              # Unified fetch bridge and error handler
```

---

## 🛠 Quick Start (Spinning Up with Docker Compose)

Make sure you have **Docker** and **Docker Compose** installed on your system.

### 1. Copy Environment Configuration
```bash
cp .env.example .env
```

### 2. Launch the Containers
In the project root directory, spin up all services:
```bash
docker-compose up --build
```
This command compiles the React assets, downloads the PostgreSQL image, installs backend requirements, launches the database, and automatically constructs the tables on startup.

- **Frontend App**: `http://localhost:3000`
- **FastAPI API**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/api/docs`

### 3. Seed Mock Database Records
To populate the database with 150 simulated products, active client profiles, and historical order details to see charts instantly, run the seed script:
```bash
docker-compose exec backend python app/database/seed.py
```

---

## 👤 Simulated User Roles (Access Control Matrix)

To demonstrate Section 5 of the PRD, we have implemented an interactive **Role Switcher** in the top-right header:

| Feature / Page | Business Owner | Inventory Manager | Sales Executive |
| :--- | :---: | :---: | :---: |
| **Landing Page** | ✔ (All can exit) | ✔ (All can exit) | ✔ (All can exit) |
| **Command Center Dashboard** | ✔ | ✔ | ✔ |
| **Products Catalog** | View / Add / Edit / Delete | View / Edit Stock Only | View Only |
| **Customer Directory** | View / Add / Delete | ❌ (Hidden) | View / Add / Delete |
| **Order Ledger** | View / Place / Cancel / Delete | ❌ (Hidden) | View / Place / Cancel / Delete |

---

## 📝 Complete User Journeys Verification Guide

Open the platform in your browser at `http://localhost:3000`. You will see the premium Landing Page. Click **Get Started** to open the workspace.

### Journey 1: Add a New Product
1. Switch to **Business Owner** role in the top header.
2. Select **Products** in the sidebar. Click **Add Product**.
3. Fill out details (Name, SKU, Price, Initial Stock). Submit the form.
4. *Validation check*: Attempt to create a second product with the same SKU. The system catches this, rolls back, and renders a clean `"SKU already exists"` warning overlay.

### Journey 2: Register a Client Profile
1. Select **Customers** in the sidebar. Click **Add Customer**.
2. Fill out contact card information. Submit the form.
3. *Validation check*: Search for the customer using their Name or Email in the top search bar. Click the **Eye icon** next to their record. You will see an empty profile ready for order history.

### Journey 3: Transact an Order (Stock Deduction & Rollback)
1. Select **Orders** in the sidebar. Click **Create Order**.
2. **Step 1: Select Customer** - Find and click your newly registered customer.
3. **Step 2: Add Stock Items** - Search and add items from the catalog:
   - Select product quantities.
   - *Validation check*: Try placing an order quantity higher than available stock. The wizard immediately locks and displays an alert indicating stock ceiling.
4. **Step 3: Check Out** - View estimated gross total. Click **Place Order**.
5. *Database Verification*: Navigate back to **Products**; you will see the product's stock has automatically deducted by the exact order amount. Open **Dashboard**; total revenue widgets, order trends line charts, and best-selling bar charts are instantly updated!
