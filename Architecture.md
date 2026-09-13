# System Architecture Document

## Recommended Tech Stack

| Layer | Primary Technology | Rationale & Note |
| :--- | :--- | :--- |
| **Database** | **PostgreSQL (SQL)** | Authoritative relational database for strict transactional consistency (ACID), foreign keys, order/payment ledgers, and spatial zone matching. |
| **Backend Runtime** | **Node.js + Express.js (ES Modules)** | Asynchronous, non-blocking I/O ideal for real-time WebSocket event handling, API endpoints, and micro-services readiness. |
| **Authentication & RBAC** | **JWT + bcrypt** | Token-based auth with payload containing user role (`customer`, `pujari`, `support`, `admin`) and Pujari `zone`. |
| **Real-Time Communication** | **Socket.io / WebSockets + Redis Pub/Sub** | Enables instant zonal Pujari notifications (broadcast) and bidirectional live chat between Customers and Support Executives. |
| **Cache & Task Queue** | **Redis + BullMQ** | Fast session caching, distributed locks (prevent double Pujari bookings), and background job processing. |
| **Admin Dashboard UI** | **React.js / Next.js + Vanilla CSS / Tailwind** | Responsive, high-performance admin portal with rich real-time UI components, chat streams, and dashboard analytics graphs. |

---

## High-Level System Architecture

```mermaid
flowchart TB
    subgraph Clients["Client Experience Layer"]
        C_WEB["Devotee Web / Mobile App"]
        P_APP["Pujari App"]
        A_DASH["Admin & Support Portal"]
    end

    subgraph Gateway["API Gateway / Middleware"]
        GW["Express Gateway (index.js)"]
        AUTH["JWT Auth & RBAC Middleware (authMiddleware.js)"]
        WSS["WebSocket Server (Socket.io)"]
    end

    subgraph CoreServices["Core Controllers & Services"]
        AUTH_SVC["Auth Controller (authController.js)"]
        PKG["Package & Product Controller"]
        ORD["Order & Customization Engine"]
        DISPATCH["Pujari Zonal Dispatcher"]
        SUPP["Support Ticket & Chat Engine"]
        FIN["Finance & Escrow Ledger"]
    end

    subgraph Storage["Data & Cache Layer"]
        PG[(PostgreSQL Database)]
        REDIS[(Redis Cache / PubSub / Locks)]
    end

    C_WEB -->|HTTP / WS| GW
    P_APP -->|HTTP / WS| GW
    A_DASH -->|HTTP / WS| GW

    GW --> AUTH
    AUTH --> AUTH_SVC
    AUTH --> PKG
    AUTH --> ORD
    AUTH --> DISPATCH
    AUTH --> SUPP
    AUTH --> FIN

    WSS <--> REDIS
    DISPATCH <--> WSS
    SUPP <--> WSS

    AUTH_SVC --> PG
    PKG --> PG
    ORD --> PG
    DISPATCH --> PG
    SUPP --> PG
    FIN --> PG
    ORD <--> REDIS
```

---

## Relational Database Schema (PostgreSQL)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ PUJARI_BOOKINGS : "requested/accepted by"
    USERS ||--o{ SUPPORT_TICKETS : "creates/assigned to"
    USERS ||--o{ TICKET_MESSAGES : "sends"
    PACKAGES ||--o{ PACKAGE_ITEMS : "contains"
    PRODUCTS ||--o{ PACKAGE_ITEMS : "included in"
    ORDERS ||--o{ ORDER_ITEMS : "includes"
    PACKAGES ||--o{ ORDER_ITEMS : "references"
    PRODUCTS ||--o{ ORDER_ITEMS : "references"
    ORDERS ||--|| PUJARI_BOOKINGS : "triggers"
    SUPPORT_TICKETS ||--o{ TICKET_MESSAGES : "contains"

    USERS {
        int id PK
        string name
        string email UK
        string phone
        string password_hash
        string role "customer | pujari | support | admin"
        string zone "used if role == pujari"
        timestamp created_at
    }

    PRODUCTS {
        int id PK
        string name
        text description
        numeric price "internal base price"
        string image_URI
        int stock_quantity
        timestamp created_at
    }

    PACKAGES {
        int id PK
        string name
        text description
        numeric base_price "sum of items"
        string image_URI
        timestamp created_at
    }

    PACKAGE_ITEMS {
        int id PK
        int package_id FK
        int product_id FK
        int quantity
    }

    ORDERS {
        int id PK
        int customer_id FK
        numeric total_amount
        boolean needs_pujari
        string status "placed | confirmed | cancelled"
        timestamp created_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int package_id FK
        int product_id FK
        boolean removed
        numeric price_at_order
    }

    PUJARI_BOOKINGS {
        int id PK
        int order_id FK
        int requested_pujari_id FK "optional direct request"
        int accepted_pujari_id FK "pujari who accepts"
        string status "pending | accepted | completed | cancelled"
        timestamp created_at
    }

    SUPPORT_TICKETS {
        int id PK
        int customer_id FK
        int assigned_executive_id FK "nullable until assigned"
        string subject
        string status "open | assigned | resolved | closed"
        timestamp created_at
    }

    TICKET_MESSAGES {
        int id PK
        int ticket_id FK
        int sender_id FK
        text message
        timestamp sent_at
    }
```

---

## Codebase Directory Structure (`pooja_backend`)

```
pooja_backend/
├── config/
│   └── db.js                 # PostgreSQL connection pool (pg)
├── controllers/
│   ├── authController.js     # User registration, login, profile (getMe)
│   ├── packageController.js  # Package listing & relational item query
│   └── productController.js  # Product inventory CRUD
├── middleware/
│   └── authMiddleware.js     # JWT authentication & RBAC authorization
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── packageRoutes.js      # /api/packages routes
│   └── productRoutes.js      # /api/products routes
├── schema/
│   └── schema.sql            # Authoritative SQL database schema
├── .env                      # DB credentials & JWT secret
├── index.js                  # Express server entry point & route mounting
└── package.json              # Backend dependencies
```
