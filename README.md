# Aaradhya (आराध्या) — Family Devotional E-Commerce & Pujari Platform

Aaradhya is a mass-market devotional e-commerce and ritual service platform. It enables families to purchase customized, bundled pooja item packages (with itemized price masking and dynamic price deduction upon item removal), book verified Pujaris (priests) either by direct selection or through an automated zonal broadcast engine, and access real-time customer support backed by a powerful Admin Governance Dashboard.

---

## 🌟 Key Platform Features

### 1. Customizable Pooja Packages & Item Masking
* **Bundled Ritual Kits**: Pre-assembled packages for festivals and ceremonies (e.g., Ganesha Chaturthi Grand Kit, Satyanarayan Pooja Kit).
* **Masked Itemized Pricing**: Package cards present a single bundled price without disclosing wholesale/individual item costs to the user.
* **Dynamic Package Customization**: Devotees can toggle off items they already possess at home. The system dynamically recalculates and reduces the package price by the removed item's deduction value.

### 2. Smart Pujari Selection & Zonal Broadcast Engine
* **Flexible Booking Options at Checkout**: Devotees can choose between:
  * **Direct Request**: Select a specific verified Pujari based on profile, ratings, and language preferences.
  * **Open Zonal Broadcast**: If no Pujari is selected, the platform broadcasts a real-time notification (`NEW_POOJA_REQUEST`) to all active Pujaris connected in that delivery zone.
* **Atomic Race-Condition Locks**: Uses Redis distributed locks (`SETNX`) / SQL row-level locks to ensure exactly one Pujari can accept a broadcasted booking request.
* **Escrow Payout Release**: Pujari payouts are safely held in pending state and released automatically upon verified ceremony completion.

### 3. Customer Support Tracking & Live Chat Transcript Engine
* **Unassigned Ticket Queue**: Support tickets created by customers enter an unassigned queue visible in the Admin Dashboard.
* **Executive Assignment**: Admins can manually assign or auto-assign unhandled tickets to Support Executives based on workload SLAs.
* **Real-Time Live Chat**: Socket.io powered bidirectional chat room (`ticket:<ticket_id>`) between customer and executive.
* **Admin Transcript Viewer**: Admins can inspect complete chronological chat transcripts for any support case at any time.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| User Role | Registration Requirement | Permissions & Access Scope |
| :--- | :--- | :--- |
| **customer** | Name, Email, Password, Phone | Browse packages, place customized orders, select/request Pujari, open & chat on owned tickets. |
| **pujari** | Name, Email, Password, Phone, Zone (Required) | View zonal booking broadcasts, accept open bookings, mark ceremonies completed for payout. |
| **support** | Name, Email, Password | View assigned support tickets, conduct live chat sessions with customers, resolve issues. |
| **admin** | Internal Provisioning | Full system governance — manage catalog (products/packages), assign tickets, view all live chat transcripts, audit payouts. |

---

## 🛠️ Tech Stack & Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Database** | PostgreSQL (SQL) | Authoritative relational database enforcing ACID compliance, foreign keys, orders, and zonal indexing. |
| **Backend Framework** | Node.js + Express.js | Asynchronous RESTful API backend using ES Modules (import/export). |
| **Authentication & RBAC** | JWT + bcrypt | Token-based auth with payload carrying `id`, `email`, `role`, and `zone`. |
| **Real-Time Gateway** | Socket.io + WebSockets | Instant zonal Pujari notifications and support chat messaging. |
| **Cache & Locks** | Redis + BullMQ | High-speed session caching, distributed locks, and ticket SLA timeout queues. |
| **Admin & Client Frontend** | React.js / Next.js | Modern web dashboard for catalog management, ticket dispatch, and live transcript monitoring. |

---

## 📡 Sample API Payloads & Responses

### 1. Register Pujari User (`POST /api/auth/register`)

**Request Body:**
```json
{
  "name": "Acharya Ramesh Sharma",
  "email": "ramesh.pujari@example.com",
  "phone": "+919876543210",
  "password": "SecurePassword123",
  "role": "pujari",
  "zone": "North-Delhi"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Acharya Ramesh Sharma",
    "email": "ramesh.pujari@example.com",
    "phone": "+919876543210",
    "role": "pujari",
    "zone": "North-Delhi",
    "created_at": "2026-09-13T19:30:00.000Z"
  }
}
```

### 2. Fetch Package with Included Items (`GET /api/packages/1`)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ganesha Chaturthi Grand Kit",
    "description": "Complete ritual kit including clay idol, modak box, incense, and floral samagri.",
    "base_price": "2499.00",
    "image_URI": "https://cdn.aaradhya.com/kits/ganesha_grand.jpg",
    "items": [
      {
        "package_item_id": 1,
        "quantity": 1,
        "product_id": 101,
        "product_name": "Eco-friendly Clay Ganesha Idol (9 inch)",
        "item_price": "899.00"
      },
      {
        "package_item_id": 2,
        "quantity": 1,
        "product_id": 102,
        "product_name": "Brass Aarti Diya",
        "item_price": "450.00"
      }
    ]
  }
}
```

---

## 📁 Repository Structure

```
Aaradhya_One/
├── pooja_backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool (pg)
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile (getMe)
│   │   ├── packageController.js  # Package listing & itemized relational query
│   │   └── productController.js  # Product inventory CRUD
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication & RBAC role authorization
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── packageRoutes.js      # /api/packages endpoints
│   │   └── productRoutes.js      # /api/products endpoints
│   ├── schema/
│   │   └── schema.sql            # Authoritative SQL database schema
│   ├── .env                      # DB credentials & JWT secret (gitignored)
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── index.js                  # Server entry point & route mounting
│   ├── package.json              # Backend dependencies
│   └── README.md                 # Backend documentation
├── pooja_frontend/               # Client & Admin Web Application (in progress)
├── .gitignore                    # Root repository ignore rules
├── AGENTS.md                     # AI Agent personas & architecture guidelines
├── Architecture.md               # High-level architecture blueprint
├── Architecture-essentials.md    # Core architecture essentials
├── flow.md                       # Complete end-to-end platform workflows
├── PHASES.md                     # Development roadmap & phase breakdown
├── PRD.md                        # Product Requirements Document
└── README.md                     # Project overview & documentation
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

### 2. Backend Configuration & Installation
Navigate to `pooja_backend` and install dependencies:
```bash
cd pooja_backend
npm install
```

Configure your `.env` file inside `pooja_backend`:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pooja_platform
PORT=5000
JWT_SECRET=pooja_jwt_secret_key_2026_super_secure
```

### 3. Running the Server
Start the development server with hot-reloading:
```bash
npm run dev
```

The server will run on `http://localhost:5000`.

---

## 📄 License
This project is licensed under the ISC License.
