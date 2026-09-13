# Implementation Roadmap & Development Phases (PHASES.md)

## Phase Overview

| Phase | Focus Area | Deliverables & Milestones | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Database & Auth Core** | SQL Database setup, migrations (`schema.sql`), User Roles (`customer`, `pujari`, `support`, `admin`), JWT authentication, Zonal profile field for Pujaris, Product & Package management foundation. | **COMPLETED ✅** |
| **Phase 2** | **Package Customization & Order Engine** | Masked item pricing, dynamic price calculation API upon item removal (`POST /api/orders/calculate`), order placement, package item deduction logic. | **CURRENT / NEXT 🚀** |
| **Phase 3** | **Pujari Zonal Dispatch Engine** | Pujari booking creation, Direct selection flow vs. Zonal broadcast notification engine, Socket.io integration, atomic race-condition locks (`SETNX`). | Scheduled |
| **Phase 4** | **Support Ticket & Live Chat** | Support ticket creation, Unassigned ticket queue, Admin manual/auto executive assignment, WebSocket live chat, full chat transcript viewer for Admin. | Scheduled |
| **Phase 5** | **Admin Governance Dashboard** | Analytics overview (GMV, orders, bookings), Ticket Control Room, Pujari Zone Management, Catalog & Package Editor UI. | Scheduled |
| **Phase 6** | **Financial Settlement & Audit** | Post-pooja OTP verification, escrow payout release to Pujaris, transaction audit log, load testing, and end-to-end QA. | Scheduled |

---

## Detailed Phase Breakdown & Progress Log

### Phase 1: Database Setup & Auth Core (COMPLETED ✅)
- **Database Schema Execution:** Verified PostgreSQL `schema.sql` defining `users`, `products`, `packages`, `package_items`, `orders`, `order_items`, `pujari_bookings`, `support_tickets`, and `ticket_messages`.
- **User Authentication APIs & Middleware:**
  - `POST /api/auth/register` – Registers `customer`, `pujari` (with mandatory `zone`), `support`, and `admin`. Password hashed with `bcrypt` (10 salt rounds).
  - `POST /api/auth/login` – Authenticates user and issues JWT token containing `id`, `email`, `role`, and `zone`.
  - `GET /api/auth/me` – Protected endpoint returning authenticated profile.
  - `authMiddleware.js` – Enforces `authenticate` and `authorize(...roles)` RBAC security.
- **Product & Package Catalog Foundation:**
  - `GET/POST/PUT/DELETE /api/products` – Complete product inventory management.
  - `GET/POST /api/packages` – Package listing and itemized product relational querying (`package_items` joined with `products`).
- **Server Integration:** All routes wired in `index.js` with global error handling formatting `{ "success": false, "error": "..." }`.

---

### Phase 2: Pooja Package & Item Customization Engine (UPCOMING 🚀)
- **Catalog Management:** Admin interface for kit bundles.
- **Package Customization Logic:**
  - Endpoint `POST /api/orders/calculate` receives package ID and array of removed product IDs.
  - Dynamically computes total price without exposing individual item prices.
- **Order Placement:** Endpoint `POST /api/orders` saves order, creates `order_items` with `removed` flags, and flags `needs_pujari`.

---

### Phase 3: Smart Pujari Dispatch & Booking System (SCHEDULED)
- **Direct Request Flow:** Customer chooses specific `pujari_id`, creating a targeted `pujari_bookings` entry with `status = 'pending'`.
- **Zonal Broadcast Flow:**
  - If no specific Pujari chosen, server broadcasts `NEW_POOJA_REQUEST` to Socket.io room `zone:<customer_zone>`.
  - Pujaris in that zone see real-time alert card on app/web.
  - Pujari clicks "Accept" $\rightarrow$ server executes atomic lock check $\rightarrow$ sets `accepted_pujari_id` $\rightarrow$ transitions status to `accepted`.
- **Post-Pooja Payout Trigger:** `POST /api/pujari-bookings/:id/complete` triggers payment settlement.

---

### Phase 4: Support Ticket Management & Live Chat Transcript Engine (SCHEDULED)
- **Ticket Lifecycle Management:**
  - Customer creates ticket via `POST /api/support/tickets`.
  - Ticket enters Admin Unassigned Queue (`assigned_executive_id = NULL`).
  - Admin assigns executive via `PUT /api/support/tickets/:id/assign`.
- **Real-Time Live Chat:**
  - WebSockets handle real-time message delivery between Customer and Executive.
  - Messages saved to `ticket_messages` table in PostgreSQL.
- **Admin Transcript Viewer:**
  - Endpoint `GET /api/support/tickets/:id/chat` returns full chronological transcript.
  - Admin can inspect active or resolved support conversations at any time.

---

### Phase 5: Admin Dashboard UI Frontend (SCHEDULED)
- **Executive & Admin Overview Portal:**
  - Dashboard overview widgets: Total GMV, Active Orders, Open Tickets, Pujari Coverage per Zone.
  - **Unassigned Ticket Room:** One-click ticket assignment interface for Admins.
  - **Chat Inspection Panel:** Embedded chat log viewer displaying live customer-executive conversations.
  - **Pujari Directory:** Manage Pujari verification, zones, and booking status.

---

### Phase 6: System Hardening, Testing & Verification (SCHEDULED)
- **Stress & Concurrency Testing:** Simulate 50 concurrent Pujaris attempting to accept the same broadcasted booking.
- **Security Audit:** Verify JWT expiration, SQL injection protection, and chat transcript access controls.
- **End-to-End User Flow Walkthrough:** Validate order placing $\rightarrow$ package customization $\rightarrow$ Pujari broadcast $\rightarrow$ support chat $\rightarrow$ admin monitoring.
