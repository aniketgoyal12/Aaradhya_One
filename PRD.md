# Product Requirements Document (PRD)

## Project Overview & Vision

**Platform Name:** **Aaradhya** / **Aaradhya One**  
*(Tagline: Devotional E-Commerce & Pujari Ecosystem)*

**Platform Vision:**
A complete devotional e-commerce and ritual service ecosystem designed to simplify pooja preparations for families. The platform enables users to purchase customized, bundled pooja item packages, optionally book verified Pujaris (priests) either by direct selection or through an automated zonal broadcast mechanism, and access real-time customer support backed by an intuitive Admin Governance Dashboard.

---

## Key Stakeholders & Target User Personas

| Persona | Role & Description | Key Goals & Needs |
| :--- | :--- | :--- |
| **Customer / Devotee** | Individual or family planning a ritual (e.g., Ganesha Chaturthi, Satyanarayan Pooja). | Easy purchasing of complete pooja kits, transparent package customization, optional hassle-free Pujari booking, and responsive support. |
| **Pujari (Priest)** | Verified religious practitioner registered within specific geographic zones. | Receive instant booking alerts in their zone, accept bookings, view ceremony checklists, and receive timely payouts post-pooja. |
| **Support Executive** | Operations team member managing customer inquiries and issue resolution. | Real-time chat interface, ticket management, user context access, and dispute handling. |
| **Admin / Super Admin** | Platform operator overseeing overall business operations. | Comprehensive dashboard (GMV, order status, Pujari coverage), ticket auto/manual assignment, live chat transcript monitoring, catalog management, and payout approvals. |

---

## Functional Requirements

### 1. Customizable Pooja Packages & Item Management
- **Bundle Packaging:** Pooja samagri (items) are grouped into complete occasion-specific packages (e.g., "Ganesha Chaturthi Grand Kit").
- **Masked Itemized Pricing:** Individual item prices inside a package are not disclosed separately to the customer; only the overall package price is displayed.
- **Package Customization:** Customers can remove unwanted items from the package prior to checkout (e.g., if they already have brass lamps or ghee at home).
- **Dynamic Price Reduction:** When an item is removed from a package, the total package price automatically decreases by that item's defined deduction value.
- **Inventory Tracking:** Backend tracks stock for individual products even when sold as part of bundled packages.

### 2. Smart Pujari Selection & Zonal Broadcast System
- **Pujari Option at Checkout:** After adding a pooja kit to the cart or at checkout, the customer is prompted: *"Do you need a Pujari for this pooja?"*
- **Choice A – Direct Pujari Selection:** Customer browses verified Pujaris in their area (viewing profiles, ratings, languages spoken) and sends a direct booking request to a specific Pujari.
- **Choice B – Open Zonal Request (Broadcast):** If the customer chooses not to select a specific Pujari, the request is broadcasted to **all active Pujaris in that geographic zone**.
- **First-Come, First-Served Acceptance:** The first Pujari in the zone to accept the broadcasted notification gets assigned to the booking.
- **Post-Pooja Payment Release:** Payment for Pujari services is held safely in escrow / pending state and released to the Pujari upon successful completion of the pooja (verified via OTP or customer confirmation).

### 3. Customer Support Tracking & Live Chat System
- **Ticket Creation:** Customers can open support tickets for orders, missing items, or booking queries.
- **Unassigned Ticket Queue:** New tickets enter an unopened/unassigned queue visible in the Admin Dashboard.
- **Executive Assignment:** Admin can manually assign unopened tickets to available Support Executives, or system auto-assigns based on workload.
- **Complete Chat Transcript Monitoring:** Admin can view the complete live chat and historical message transcripts between any customer and support executive.
- **Ticket SLAs & Status Tracking:** Track ticket status (`open`, `assigned`, `in_progress`, `resolved`, `closed`) and escalation alerts for unhandled tickets.

### 4. Admin Dashboard & Governance
- **Operational Overview:** Key performance metrics including Total Orders, GMV, Pending Pujari Bookings, Active Zonal Pujaris, and Open Support Tickets.
- **Order & Package Management:** Create, update, or deactivate packages and products, set item deduction rules, and track fulfillment status.
- **Pujari Zone Governance:** Manage Pujari profiles, KYC verification, zone radius mapping, and payment settlement records.
- **Support & Ticket Control Room:** View unassigned tickets, re-assign tickets, inspect full chat logs, and monitor executive response times.

---

## Non-Functional Requirements

- **Database Reliability:** Relational SQL database (PostgreSQL) guaranteeing ACID transactions for orders, reservations, and payment ledgers.
- **Real-Time Responsiveness:** WebSockets (Socket.io) for instant Pujari zonal notifications and live support chat (< 200ms latency).
- **Concurrency & Locking:** Transactional row locking or Redis-backed distributed locks to prevent double-booking of Pujaris when multiple priests attempt to accept a broadcast request simultaneously.
- **Security & RBAC:** Role-Based Access Control (`customer`, `pujari`, `support`, `admin`) with JWT authentication and bcrypt password hashing.
- **Data Privacy:** Customer PII and full chat history strictly restricted to authorized support executives and admins with audit logging for transcript access.

---

## Current Development Status

- **Phase 1 (Database & Auth Core):** **COMPLETED ✅**
  - PostgreSQL schema deployed (`schema.sql`).
  - Auth APIs (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`) with `bcrypt` & `jsonwebtoken`.
  - RBAC middleware (`authMiddleware.js`) enforcing role access (`customer`, `pujari`, `support`, `admin`).
  - Products & Packages API endpoints foundation (`/api/products`, `/api/packages`).
- **Phase 2 (Package Customization & Orders):** **IN PROGRESS 🚀**
