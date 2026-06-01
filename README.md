# 🚀 InventoryFlow – Modern Enterprise B2B SaaS ERP & Inventory Ledger

InventoryFlow is a production-grade, highly-responsive B2B SaaS Enterprise Resource Planning (ERP) platform designed for small businesses, retail stores, warehouses, and distributors to manage products, customers, stock levels, and order fulfillment ledgers in one central system.

Built using an asynchronous high-performance **FastAPI** backend, a state-of-the-art **React 19 (Vite)** frontend, and **PostgreSQL** database, the entire system is fully containerized, CI/CD automated, and ready for global scaling.

---

## 🌐 Live Production Deployments & Links

| Asset / Service | URL / Link | Status |
| :--- | :--- | :---: |
| **💻 Live Web Client (Frontend)** | [https://inventory-flow-zs2o.vercel.app](https://inventory-flow-zs2o.vercel.app) | ![Vercel Deployment](https://img.shields.io/badge/Vercel-Live-success?style=flat-square&logo=vercel) |
| **⚙️ Live Engine API (Backend)** | [https://inventoryflow-backend-c4lk.onrender.com/](https://inventoryflow-backend-c4lk.onrender.com/) | ![Render Deployment](https://img.shields.io/badge/Render-Online-success?style=flat-square&logo=render) |
| **📖 Live Swagger API Documentation** | [https://inventoryflow-backend-c4lk.onrender.com/api/docs](https://inventoryflow-backend-c4lk.onrender.com/api/docs) | ![Swagger Docs](https://img.shields.io/badge/FastAPI-Swagger-blue?style=flat-square&logo=fastapi) |
| **🐳 Docker Hub Image Repository** | [https://hub.docker.com/r/Aryatiwari24/inventoryflow-backend](https://hub.docker.com/r/Aryatiwari24/inventoryflow-backend) | ![Docker Push](https://img.shields.io/badge/DockerHub-Pushed-blue?style=flat-square&logo=docker) |
| **📦 GitHub Repository Link** | [https://github.com/Aryatiwari24/Inventory-Flow](https://github.com/Aryatiwari24/Inventory-Flow) | ![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github) |

---

## 🎨 Premium Design System & UI Aesthetics

InventoryFlow's user interface is a bespoke **Slate-Glassmorphic Design System** crafted with vanilla CSS custom variables for maximum control, responsive scaling, and extreme fluid polish:
- **Glowing States**: Beautiful radial gradient headers, neon borders, and active shadows.
- **Glassmorphic Card Decking**: Backdropped containers using `backdrop-filter: blur(16px)` with dynamic card hover expansion micro-animations.
- **Interactive SVG Data Charts**: Custom **Recharts** charts showing real-time distribution rings, 7-day orders trend lines, and best-selling inventory volumes.
- **Animated Metrics Counters**: Key performance indices (Products, Customers, Orders, Revenue) count up smoothly from zero on page load.
- **Dynamic Access Collapsible Sidebar**: Transitioning and layout recalculation are handled with microsecond smooth CSS transitions.

---

## 🛠 Tech Stack

### ⚡ Backend Engine
* **FastAPI** (Python 3.11) – High-performance async web framework built on Starlette and Pydantic.
* **SQLAlchemy 2.0** – Unified Object Relational Mapper utilizing modern declarative mapping and `async_sessionmaker`.
* **Asyncpg** & **AioSQLite** – Ultra-low database latency drivers featuring dual-adapter dynamic loading based on execution environment.
* **Pydantic v2** – Strict schema models enforcing strict type serialization and business constraints.

### 💻 Client Web Interface
* **React 19** & **Vite** – Reactive frontend development runtime enabling instant hot-reloading and modular builds.
* **Recharts** – Custom D3-based SVG charting framework for interactive responsive visualization.
* **Lucide Icons** – Modern, light-weight vector outline icons.

### 🐳 CI/CD & Devops
* **Docker & Docker Compose** – Multi-stage environments compiling and bundling frontend code inside Nginx static proxies and containerizing backend runtimes.
* **GitHub Actions** – Fully-automated build-and-publish cloud pipeline pushing production images to Docker Hub on every repository push event.

---

## 📂 Project Directory Structure

```
.
├── .github/
│   └── workflows/
│       └── docker-publish.yml      # CI/CD Docker Hub cloud publishing workflow
├── docker-compose.yml              # Local multi-container orchestration
├── README.md                       # Comprehensive ERP Guide & links (This file)
├── .env.example                    # Template file for secure credentials
├── backend/
│   ├── Dockerfile                  # Async Python runtime container
│   ├── requirements.txt            # Core backend package specifications
│   └── app/
│       ├── main.py                 # FastAPI register, CORS middleware, global errors
│       ├── database/
│       │   ├── session.py          # Smart SQLite/PostgreSQL connection engine
│       │   ├── models.py           # Core schemas (Products, Customers, Orders, Items)
│       │   └── seed.py             # Active high-fidelity database resetting/seeding
│       ├── api/
│       │   ├── products.py         # Paginated catalog & search endpoints
│       │   ├── customers.py        # Profiling & purchase analytics endpoints
│       │   ├── orders.py           # Transactional placement & checkouts
│       │   └── dashboard.py        # Widgets & trend metrics compilers
│       ├── schemas/
│       │   ├── products.py         # Pydantic product validators
│       │   ├── customers.py        # Customer profile data schemas
│       │   └── orders.py           # Orders checkout payloads
│       ├── services/
│       │   ├── product_service.py  # Product business logs
│       │   ├── customer_service.py # Customer aggregator service
│       │   └── order_service.py    # Atomic transactional checkout service
│       └── utils/
│           └── errors.py           # Custom business exceptions (DuplicateSKU, etc.)
└── frontend/
    ├── Dockerfile                  # Node compilation container with static Alpine Nginx
    ├── package.json                # React packages & Recharts
    ├── vite.config.js              # Vite compiler config
    ├── index.html                  # HTML5 SPA frame entry
    ├── nginx.conf                  # Production high-performance reverse-proxy SPA routing
    └── src/
        ├── main.jsx                # DOM runtime mounter
        ├── App.jsx                 # Client router & access role lock controllers
        ├── index.css               # Bespoke Slate-Glass design system style definitions
        ├── components/             # Layout components (Sidebar, Header, StatCards, Modals)
        ├── pages/                  # Landing page and primary application tabs
        └── services/
            └── api.js              # Unified Fetch API bridge & simulated browser db fallback
```

---

## 👤 Automated User Roles (RBAC Access Matrix)

To test enterprise organizational structures, select any role in the top header's dropdown to toggle user scopes in real time:

| Feature / Workspace Page | Business Owner | Inventory Manager | Sales Executive |
| :--- | :---: | :---: | :---: |
| **Command Center Dashboard** | ✔ | ✔ | ✔ |
| **Products Catalog** | View / Add / Edit / Delete | View / Edit Stock Levels | View Only |
| **Customer Directory** | View / Add / Delete | ❌ (Hidden & Locked) | View / Add / Delete |
| **Order Ledger** | View / Place / Cancel / Delete | ❌ (Hidden & Locked) | View / Place / Cancel / Delete |

---

## ⚙️ How to Run Locally

### Option A: Local Dev Servers (Fast Execution)

#### 1. Setup Backend
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start FastAPI server locally:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   * Swagger will be available at: `http://localhost:8000/api/docs`

#### 2. Setup Frontend
1. Navigate to `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   * Open the React web app at: `http://localhost:5173`

---

### Option B: Docker Compose (Fully Isolated Container Orchestration)

Make sure you have Docker Desktop running.

1. In the project root directory, launch all services:
   ```bash
   docker-compose up --build
   ```
2. The orchestrator automatically sets up the PostgreSQL database, launches FastAPI behind port `8000`, and builds the React client served by Nginx behind port `3000`.
   - **Frontend App**: `http://localhost:3000`
   - **FastAPI API**: `http://localhost:8000`
   - **Swagger Docs**: `http://localhost:8000/api/docs`

---

## 🧪 Enterprise-Grade Data Seeding

To quickly populate either your local or cloud database with 150 simulated products, diverse customers, and historical order trends spanning the last 7 days (to see beautiful live charts), run:

```bash
# If running locally in virtual environment:
python app/database/seed.py

# If running via Docker Compose:
docker-compose exec backend python app/database/seed.py
```

---

## 📝 User Verification Journeys

Open the web app in your browser (local or live deployment). Let's trace the platform's robust architecture:

### Journey 1: Strict Product SKU Validation
1. Choose **Business Owner** role in the top header.
2. Select **Products** in the sidebar. Click **Add Product**.
3. Create a product with name `"MacBook Pro M3"` and SKU `"ELEC-MBP-01"`. Submit the form.
4. Try creating another product with the *same SKU* `"ELEC-MBP-01"`.
5. **Expected result**: The FastAPI backend aborts the database write, triggers a transaction rollback, and returns a graceful duplicate exception modal in the UI: `"SKU already exists"`.

### Journey 2: Client Profile Directory
1. Choose **Sales Executive** role.
2. Select **Customers** in the sidebar. Click **Add Customer**.
3. Fill out the contact card details. Submit the form.
4. Search for the new customer in the search bar. Click the **Eye icon** to view their profile. You will see a detailed dashboard tracking their purchases, order frequencies, and lifetime value dynamically.

### Journey 3: Transactional Checkouts & Stock Ledger Rules
1. Select **Orders** in the sidebar. Click **Create Order**.
2. **Step 1**: Find and select your newly added customer.
3. **Step 2**: Add items from the product catalog.
   - *Validation rule*: Set an order quantity larger than the available stock of a product. The interface immediately locks and flags a warning indicating stock limits.
4. **Step 3**: Click **Place Order**.
5. **Verify the ledger**:
   - Go to **Products**; the product's stock quantity has automatically decremented by the exact ordered amount.
   - Go to **Dashboard**; total revenue widgets, order trend line charts, and best-selling stock charts are instantly updated!
   - Cancel the order in **Orders**; the product's stock levels are automatically restored, preserving complete operational ledger integrity.
