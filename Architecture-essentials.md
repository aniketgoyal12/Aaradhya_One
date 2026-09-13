# System Architecture Essentials & API Contracts

## Key System Invariants & Business Logic Rules

1. **Package Customization & Price Reduction Rule:**
   - Package `base_price` is the default sum of bundled item prices.
   - Individual item prices are hidden from the user on package presentation cards.
   - When a user toggles an item off (`removed = TRUE`), the server calculates:
     $$\text{Final Order Amount} = \text{Package Base Price} - \sum (\text{Price of Removed Items})$$
   - Price calculation is strictly validated server-side to prevent client-side price tampering.

2. **Atomic Pujari Zonal Broadcast Rule:**
   - Broadcast is scoped strictly to Pujaris matching the customer's delivery `zone`.
   - Acceptance must be atomic: exactly ONE Pujari can accept a single booking request.
   - Post-accept status transitions: `pending` $\rightarrow$ `accepted` $\rightarrow$ `completed`.
   - Payment payout is released only when booking reaches `completed` state.

3. **Customer Support Ticket Governance Rule:**
   - Unopened tickets (`assigned_executive_id = NULL`, `status = 'open'`) appear in the Admin Unassigned Queue.
   - Admin can assign or reassign any ticket to any executive user (`role = 'support'`).
   - Admin can view complete message history (`ticket_messages` joined on `ticket_id`) without needing executive permission.

---

## REST API Endpoints Status & Contracts

### 1. Authentication & Users (`/api/auth`) — [IMPLEMENTED ✅]
- `POST /api/auth/register` – Register user with role (`customer`, `pujari`, `support`, `admin`). Requires `zone` for Pujaris.
- `POST /api/auth/login` – Authenticate user and issue JWT access token.
- `GET /api/auth/me` – Retrieve current authenticated user profile (Protected with `authenticate`).

### 2. Products & Customizable Packages (`/api/packages` & `/api/products`) — [IMPLEMENTED ✅]
- `GET /api/products` – Get all product inventory items.
- `GET /api/products/:id` – Get single product detail.
- `POST /api/products` (Admin) – Create product in inventory.
- `PUT /api/products/:id` (Admin) – Update product details.
- `DELETE /api/products/:id` (Admin) – Delete product.
- `GET /api/packages` – List all available pooja packages.
- `GET /api/packages/:id` – Fetch single package with itemized product relational list.
- `POST /api/packages` (Admin) – Create package with bundled products.

### 3. Orders & Customization (`/api/orders`) — [PHASE 2 UPCOMING 🚀]
- `POST /api/orders/calculate` – Calculate dynamically adjusted package price based on removed items.
- `POST /api/orders` – Create order with items, custom removals, and `needs_pujari` flag.
- `GET /api/orders/my-orders` – Fetch order history for logged-in customer.
- `GET /api/orders/:id` – Fetch detailed order status & breakdown.

### 4. Pujari Bookings (`/api/pujari-bookings`) — [PHASE 3 UPCOMING]
- `POST /api/pujari-bookings` – Create booking for an order (direct Pujari request or open broadcast).
- `GET /api/pujari-bookings/zonal-feed` (Pujari) – Fetch open unassigned bookings for the Pujari's zone.
- `POST /api/pujari-bookings/:id/accept` (Pujari) – Accept an open zonal booking (Atomic lock).
- `POST /api/pujari-bookings/:id/complete` (Pujari/Admin) – Mark ceremony completed & release payout.

### 5. Support Tickets & Real-Time Chat (`/api/support`) — [PHASE 4 UPCOMING]
- `POST /api/support/tickets` (Customer) – Open a new customer support ticket.
- `GET /api/support/tickets/unassigned` (Admin) – Fetch all unopened/unassigned tickets.
- `PUT /api/support/tickets/:id/assign` (Admin) – Assign ticket to a support executive.
- `GET /api/support/tickets/:id/chat` (Admin/Support/Customer) – View complete chat transcript history.
- `POST /api/support/tickets/:id/messages` – Send a message within a ticket.

---

## State Transition Models

### Pujari Booking State Lifecycle
$$\text{[Order Placed]} \longrightarrow \text{Pending Broadcast/Request} \xrightarrow{\text{Pujari Accepts}} \text{Accepted} \xrightarrow{\text{Pooja Done}} \text{Completed (Payout Released)}$$
*(Or $\xrightarrow{\text{Cancelled}}$ Refund Triggered)*

### Support Ticket State Lifecycle
$$\text{Open (Unassigned)} \xrightarrow{\text{Admin Assigns}} \text{Assigned} \xrightarrow{\text{Executive Replies}} \text{In Progress} \xrightarrow{\text{Issue Solved}} \text{Resolved} \longrightarrow \text{Closed}$$
