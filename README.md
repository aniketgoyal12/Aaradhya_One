# Shubarmbh (शुभ आरंभ) — Pooja Essentials For a Divine Life

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Design%20System-Royal%20Maroon%20%26%20Temple%20Gold-8B1E22.svg?style=flat-square)](#)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101.svg?style=flat-square&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-D4AF37.svg?style=flat-square)](#)

> **Shubarmbh (शुभ आरंभ)** is a premier mass-market devotional e-commerce and Vedic ritual services platform. Built with sacred aesthetics and high-concurrency architecture, Shubarmbh enables families to purchase customized, bundled pooja kits (with masked item pricing and dynamic price deduction upon item removal), book verified Pujaris (priests) via direct request or an automated zonal broadcast engine, and access real-time customer support backed by an executive Admin Governance Control Room.

---

## 🪔 The 4 Brand Pillars

Shubarmbh organizes devotional products and services into 4 authentic Vedic pillars:

| Pillar | Category Key | Highlights & Curated Products |
| :--- | :--- | :--- |
| **Pooja Items** | `pooja_items` | Handcrafted brass diyas, pure kumkum, bhimseni camphor, sandalwood tablets, natural agarbatti. |
| **Ritual Essentials** | `ritual_essentials` | Sacred gangajal, havan samagri, natural dhoop cups, raw cotton wicks, cow ghee. |
| **Spiritual Gifts** | `spiritual_gifts` | 24k gold-plated yantras, brass deity murtis, auspicious festive gift boxes, shree yantras. |
| **Traditional Products** | `traditional_products` | Copper kalash, handloom pooja asans, brass pooja thalis, temple bell chimes. |

---

## 🌟 Key Platform Capabilities

### 1. Customizable Pooja Packages & Masked Item Pricing (Phase 2)
* **Bundled Ritual Kits:** Pre-assembled packages for major festivals and ceremonies (e.g., *Ganesha Chaturthi Grand Kit*, *Satyanarayan Mahapooja Kit*, *Diwali Lakshmi Pooja Kit*).
* **Masked Itemized Pricing:** Package cards present a single cohesive bundle price without disclosing internal wholesale item costs to consumers.
* **Dynamic Package Customization:** Devotees can toggle off items they already possess at home. The server dynamically recalculates and deducts the price strictly based on verified item deduction values.
* **Transactional Inventory Updates:** Prevents overselling by decrementing stock atomically inside PostgreSQL transactions.

### 2. Smart Pujari Selection & Zonal Broadcast Engine (Phase 3)
* **Flexible Booking at Checkout:** Devotees can choose between:
  * **Direct Request:** Select a specific verified Pujari based on profile, ratings, and language preferences.
  * **Open Zonal Broadcast:** Broadcast a real-time notification (`NEW_POOJA_REQUEST`) to all active Pujaris connected in that delivery zone.
* **Atomic Race-Condition Locks:** Uses PostgreSQL row-level locks (`SELECT ... FOR UPDATE`) to guarantee that exactly one Pujari can claim a broadcasted booking.
* **OTP Ceremony Completion & Escrow Payout:** Payouts are held in financial escrow and released automatically upon verified 6-digit ritual OTP entry.

### 3. Customer Support Tracking & Live Chat Transcripts (Phase 4)
* **Unassigned Ticket Queue:** Support tickets created by customers enter an unassigned queue visible in the Admin Dashboard.
* **Executive Assignment:** Admins can manually assign or reassign tickets to Support Executives based on workload SLAs.
* **Real-Time Live Chat:** Socket.io bidirectional chat room (`ticket:<ticket_id>`) between customer and executive.
* **Live Chat Transcript Audit Suite:** Admins can inspect complete chronological chat transcripts for any support case at any time.

### 4. Financial Escrow Ledger & Settlement Control (Phase 6)
* **Full Audit Trail:** Complete visibility into pending escrow reserves, approved ritual payouts, and transaction logs.
* **Risk Mitigation:** Transparent dispute handling and real-time reconciliation.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| User Role | Registration Requirement | Permissions & Access Scope |
| :--- | :--- | :--- |
| **customer** | Name, Email, Password, Phone | Browse packages, place customized orders, select/request Pujari, open & chat on owned tickets. |
| **pujari** | Name, Email, Password, Phone, Zone (Required) | View zonal booking broadcasts, accept open bookings, mark ceremonies completed for payout. |
| **support** | Name, Email, Password | View assigned support tickets, conduct live chat sessions with customers, resolve issues. |
| **admin** | Internal Provisioning | Full system governance — manage catalog across 4 pillars, assemble packages, assign tickets, view live chat transcripts, audit escrow payouts. |

---

## 🎨 Frontend Design System & Aesthetics

The Shubarmbh user interface embodies **Vedic Luxury and Divine Splendor**:
* **Official Emblem:** Circular emblem with the sacred temple Kalash, lotus petals, and diya illumination.
* **Royal Kumkum Maroon (`#8B1E22`):** Primary brand tone reflecting sacred kumkum and Vedic royalty.
* **Temple Sacred Gold (`#D4AF37`):** Accent tone reflecting polished brass lamps and divine light.
* **Velvet Obsidian (`#0a0406`):** Deep temple sanctum canvas providing high-contrast clarity.
* **Sandalwood Ivory (`#FAF5EE`):** Warm highlights and pill badges.

---

## 🛠️ Monorepo Structure

```
Aaradhya_One/
├── pooja_backend/                # Core REST API & Real-Time Engine (Port 5000)
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool (pg)
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile (getMe)
│   │   ├── productController.js  # Inventory items CRUD & stock governance
│   │   ├── packageController.js  # Relational bundle queries & package assembly
│   │   ├── orderController.js    # Dynamic price deduction & atomic orders (Phase 2)
│   │   ├── pujariController.js   # Zonal broadcast & atomic acceptance (Phase 3)
│   │   ├── supportController.js  # Support ticket queue & transcripts (Phase 4)
│   │   └── settlementController.js# Escrow ledger & payout audit (Phase 6)
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication & RBAC role guards
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── productRoutes.js      # /api/products
│   │   ├── packageRoutes.js      # /api/packages
│   │   ├── orderRoutes.js        # /api/orders
│   │   ├── pujariRoutes.js       # /api/pujari-bookings
│   │   ├── supportRoutes.js      # /api/support
│   │   └── settlementRoutes.js   # /api/settlements
│   ├── schema/
│   │   └── schema.sql            # Authoritative SQL schema
│   ├── index.js                  # Express server & Socket.io entry point
│   ├── package.json
│   └── README.md
│
├── pooja_frontend/               # Admin Governance Portal (Port 5173)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios HTTP client with JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Admin authentication & session persistence
│   │   ├── logo/
│   │   │   └── Shubarmbh Pooja Essentials Logo(2).png # Official Brand Asset
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Header, Admin Layout
│   │   │   ├── ui/               # Modal, StatCard, Badge
│   │   │   └── catalog/          # ProductModal, PackageBuilder
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Royal branded admin login portal
│   │   │   ├── Dashboard.jsx     # Real-time platform KPI cockpit
│   │   │   ├── Products.jsx      # Inventory table across 4 brand pillars
│   │   │   ├── Packages.jsx      # Bundle showcase & package builder
│   │   │   ├── Orders.jsx        # Order governance & item deduction auditor
│   │   │   ├── PujariDispatch.jsx# Zonal broadcast monitor & OTP completion
│   │   │   ├── SupportTickets.jsx# Live chat & full transcript viewer
│   │   │   └── Settlements.jsx   # Financial escrow & payout ledger
│   │   ├── App.jsx               # Protected routing
│   │   ├── index.css             # Tailwind styling & divine design tokens
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
├── Architecture.md               # High-level architecture blueprint
├── Architecture-essentials.md    # Core architecture invariants & contracts
├── flow.md                       # Complete end-to-end system sequence diagrams
├── PHASES.md                     # Phase 1 through Phase 6 development log
├── PRD.md                        # Product Requirements Document
├── INTERNSHIP_REPORT.md          # Comprehensive technical internship report
└── README.md                     # Root project documentation (This file)
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **PostgreSQL** (v14 or higher)

### 1. Database Setup
Create a PostgreSQL database named `pooja_platform`:
```sql
CREATE DATABASE pooja_platform;
```

Execute the schema script located at `pooja_backend/schema/schema.sql`:
```bash
psql -U postgres -d pooja_platform -f pooja_backend/schema/schema.sql
```

### 2. Backend Setup & Startup
Navigate to `pooja_backend`:
```bash
cd pooja_backend
npm install
```

Configure `pooja_backend/.env`:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pooja_platform
PORT=5000
JWT_SECRET=pooja_jwt_secret_key_2026_super_secure
```

Start the backend server:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup & Startup
In a separate terminal, navigate to `pooja_frontend`:
```bash
cd pooja_frontend
npm install
npm run dev
# Frontend running at http://localhost:5173
```

### 4. Admin Sign-In
* **URL:** `http://localhost:5173/login`
* **Email:** `admin@aaradhya.com`
* **Password:** `AdminPass123`

---

## 📄 License
This project is licensed under the ISC License.
