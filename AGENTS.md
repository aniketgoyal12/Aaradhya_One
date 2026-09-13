# System Agents & Sub-system Services (AGENTS.md)

## Background System Agents & Responsibilities

This document specifies the background workers, automated dispatch agents, and autonomous services powering the devotional e-commerce and Pujari booking ecosystem.

---

## 1. ZonalDispatcherAgent

### Role & Objective
Automates the broadcast and assignment of Pujari booking requests based on geographic location (zones) and real-time availability.

### Responsibilities:
- **Zonal Filtering:** Listens for order events with `needs_pujari = TRUE`. Identifies customer zone from order address.
- **WebSocket Broadcast:** Emits real-time notification alerts to all online Pujaris connected to Socket.io room `zone:<zone_name>`.
- **Race Condition Prevention:** Acquires Redis distributed lock (`SETNX lock:booking:<booking_id>`) when a Pujari attempts acceptance.
- **Assignment Finalization:** Updates `pujari_bookings.accepted_pujari_id` and changes booking status from `pending` to `accepted`. Notifies customer and revokes open broadcast for other Pujaris in that zone.

---

## 2. TicketEscalationAgent

### Role & Objective
Ensures zero customer support ticket abandonment by monitoring unassigned tickets and enforcing SLAs.

### Responsibilities:
- **Unassigned Queue Monitoring:** Periodically scans `support_tickets` where `assigned_executive_id IS NULL` and `status = 'open'`.
- **Workload-Based Auto-Assignment:** Calculates current open ticket count per Support Executive (`users.role = 'support'`) and auto-assigns overdue tickets to the least busy executive.
- **Admin Alerting:** If a ticket remains unassigned beyond SLA threshold (e.g., 15 minutes), sends an urgent alert notification to the Admin Dashboard.

---

## 3. PackagePricingCalculator Agent

### Role & Objective
Executes server-side validation and dynamic recalculation of pooja packages when users toggle item removals.

### Responsibilities:
- **Masked Deduction Calculation:** Fetches official package base price and deduction amounts for removed products.
- **Sanity & Integrity Check:** Ensures calculated total cannot drop below minimum thresholds or result in negative amounts.
- **Order Item Snapshotting:** Records `removed = TRUE` status and immutable `price_at_order` for audit and inventory reconciliation.

---

## 4. PayoutSettlementAgent

### Role & Objective
Manages post-pooja financial settlements and escrow payouts for assigned Pujaris.

### Responsibilities:
- **Fulfillment Verification:** Triggers when a ceremony is completed via customer OTP or Pujari check-out confirmation.
- **Payout Ledger Entry:** Calculates net payout amount for the Pujari, updates financial ledger tables, and schedules payout transfer to the Pujari's linked bank account/wallet.
- **Dispute Lock:** Automatically holds payout if a customer files an active support ticket linked to the booking order prior to payment settlement.

---

## Developer & Agent Coding Conventions

- **Database Queries:** Use parameterized SQL queries (`pg` pool) to prevent SQL injection vulnerabilities.
- **Authentication & RBAC Standard:**
  - Route authentication: `authenticate` middleware attached to `req.user`.
  - Role check: `authorize('admin', ...)` middleware validating `req.user.role`.
  - Passwords hashed with `bcrypt` (10 salt rounds).
- **Error Handling:** All async handlers must return formatted JSON: `{ "success": false, "error": "Message" }` (or `{ "success": true, ... }`).
- **Real-Time Events Standard:**
  - Pujari Broadcast: `emitToZone(zoneId, 'NEW_POOJA_REQUEST', payload)`
  - Chat Message: `emitToRoom('ticket:' + ticketId, 'NEW_CHAT_MESSAGE', payload)`
- **Secrets Management:** Keep all DB credentials, JWT secrets, and API keys inside `.env` (never commit secrets to repositories).
