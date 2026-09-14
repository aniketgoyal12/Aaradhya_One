# Shubarmbh (शुभ आरंभ) — Backend REST API & Real-Time Engine

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-orange.svg?style=flat-square&logo=json-web-tokens)](https://jwt.io/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101.svg?style=flat-square&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-8B1E22.svg?style=flat-square)](#)

> **Shubarmbh (शुभ आरंभ)** — *Pooja Essentials For a Divine Life*  
> High-performance RESTful API and WebSocket gateway powering mass-market devotional e-commerce, multi-pillar catalog management, dynamic masked package price calculations, atomic zonal Pujari dispatches, live support chat, and financial escrow settlements.

---

## 🪔 The 4 Brand Pillars (Catalog Taxonomy)

The database and API support products organized under the 4 brand pillars:
1. `pooja_items`: Brass diyas, kumkum, camphor, chandan, agarbatti.
2. `ritual_essentials`: Gangajal, havan samagri, natural dhoop cones, cotton wicks.
3. `spiritual_gifts`: Gold-plated yantras, brass deity murtis, divine gift boxes.
4. `traditional_products`: Copper kalash, handloom pooja asans, brass thalis, bell chimes.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Database** | PostgreSQL 14+ | ACID transactions, foreign keys, row-level locks (`FOR UPDATE`), indexing. |
| **Runtime & Framework** | Node.js + Express.js | Asynchronous REST API utilizing native ES Modules (`import/export`). |
| **Authentication & RBAC**| JWT + bcrypt (10 rounds) | Token-based stateless authentication with `id`, `email`, `role`, and `zone`. |
| **Real-Time Gateway** | Socket.io | Instant push notifications for zonal Pujari alerts and customer support chat. |
| **Concurreny Control** | SQL Row-Level Locking | Prevents race conditions during Pujari broadcast acceptance. |

---

## 🔐 Role-Based Access Control (RBAC)

| Role | Scope & Permissions |
| :--- | :--- |
| `customer` | Browse products and packages, calculate customized package prices, place orders, book Pujaris, open support tickets. |
| `pujari` | Connect to zonal broadcast channels, view open ceremony bookings in assigned zone, claim bookings atomically, enter ritual OTP. |
| `support` | View unassigned and assigned customer support tickets, participate in real-time chat sessions with customers, resolve issues. |
| `admin` | Full governance — create/update/delete products and packages across 4 pillars, reassign support tickets, view live transcripts, audit escrow ledger. |

---

## 📡 Comprehensive API Route Specifications

### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new user (`customer`, `pujari`, `support`, `admin`). Pujaris require `zone`.
* `POST /api/auth/login` — Authenticate user and receive signed JWT.
* `GET /api/auth/me` — Protected endpoint returning current user profile.

### 2. Devotional Products (`/api/products`)
* `GET /api/products` — Retrieve products with optional `?category=` filter across the 4 pillars.
* `GET /api/products/:id` — Retrieve single product details.
* `POST /api/products` *(Admin)* — Add new devotional item with stock quantity and category.
* `PUT /api/products/:id` *(Admin)* — Update product details or restock inventory.
* `DELETE /api/products/:id` *(Admin)* — Remove product from catalog.

### 3. Bundled Packages (`/api/packages`)
* `GET /api/packages` — List all pre-assembled pooja kits.
* `GET /api/packages/:id` — Fetch single package with complete relational product item list.
* `POST /api/packages` *(Admin)* — Assemble new package with bundled items `{ product_id, quantity }`.

### 4. Orders & Dynamic Customization (`/api/orders`)
* `POST /api/orders/calculate` — Computes updated package price based on removed items without exposing wholesale item costs.
* `POST /api/orders` — Atomically creates order, decrements product stock, persists order items, and creates linked Pujari booking if required.
* `GET /api/orders/my-orders` — Customer order history.
* `GET /api/orders/:id` — Fetch order breakdown with active and removed items.
* `GET /api/orders` *(Admin)* — List all platform orders with customer details.
* `PUT /api/orders/:id/status` *(Admin)* — Transition order status (`placed`, `confirmed`, `completed`, `cancelled`). Automatically restores stock on cancellation.

### 5. Pujari Bookings & Zonal Dispatch (`/api/pujari-bookings`)
* `POST /api/pujari-bookings` — Create direct booking or trigger open zonal broadcast.
* `GET /api/pujari-bookings/zonal-feed` *(Pujari/Admin)* — Retrieve open, unassigned bookings in Pujari's delivery zone.
* `POST /api/pujari-bookings/:id/accept` *(Pujari)* — Atomically claim booking (`SELECT ... FOR UPDATE`), generate 6-digit ritual OTP.
* `POST /api/pujari-bookings/:id/complete` *(Pujari/Admin)* — Verify OTP and release escrow payout.
* `GET /api/pujari-bookings` *(Admin)* — Platform-wide booking governance list.
* `GET /api/pujari-bookings/pujaris` — Verified Pujari directory with ratings and zonal locations.

### 6. Support Tickets & Live Chat (`/api/support`)
* `POST /api/support/tickets` — Open a customer support inquiry.
* `GET /api/support/tickets` *(Support/Admin)* — List tickets with `?unassigned=true` or status filters.
* `PUT /api/support/tickets/:id/assign` *(Admin/Support)* — Assign ticket to executive.
* `GET /api/support/tickets/:id/messages` — Retrieve complete chronological chat transcript.
* `POST /api/support/tickets/:id/messages` — Send message (persisted to SQL and emitted via Socket.io).

### 7. Financial Settlements & Escrow (`/api/settlements`)
* `GET /api/settlements` *(Admin)* — Retrieve full escrow transaction ledger.
* `GET /api/settlements/stats` *(Admin)* — Calculate held vs released escrow funds.

---

## ⚡ WebSocket / Socket.io Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_zone` | Client $\rightarrow$ Server | `{ zone: "North-Delhi" }` | Pujari joins real-time zonal broadcast channel. |
| `NEW_POOJA_REQUEST` | Server $\rightarrow$ Client | `{ booking_id, package_name, zone, date }` | Broadcasted to all Pujaris in matching zone when open booking is placed. |
| `join_ticket` | Client $\rightarrow$ Server | `{ ticket_id }` | Customer, executive, or admin joins live support chat room. |
| `send_message` | Client $\rightarrow$ Server | `{ ticket_id, message }` | Transmits live chat message. |
| `receive_message` | Server $\rightarrow$ Client | `{ id, ticket_id, sender_id, message, created_at }` | Real-time message broadcast to all participants in ticket room. |

---

## 🚀 Setup & Execution

1. Navigate to directory:
   ```bash
   cd pooja_backend
   npm install
   ```

2. Configure `.env`:
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pooja_platform
   PORT=5000
   JWT_SECRET=pooja_jwt_secret_key_2026_super_secure
   ```

3. Initialize PostgreSQL schema:
   ```bash
   psql -U postgres -d pooja_platform -f schema/schema.sql
   ```

4. Run server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```
