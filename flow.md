# System Workflows & User Flow Diagrams (flow.md)

## 1. Master E-Commerce & Pujari Booking Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Devotee / Customer
    participant App as Front-End Web/App
    participant API as Express API Gateway
    participant DB as PostgreSQL DB
    participant WS as Socket.io Server
    actor Pujari as Zonal Pujaris
    actor Executive as Support Executive
    actor Admin as Admin Dashboard

    %% Step 1: Package Browsing & Customization
    Customer->>App: Browse Pooja Packages (e.g. Ganesha Chaturthi Kit)
    App-->>Customer: Display Package & Base Price (Individual item prices hidden)
    Customer->>App: Customizes Package (Toggles off unneeded items)
    App->>API: POST /api/orders/calculate (Package ID, Removed Item IDs)
    API-->>App: Return Updated Total Price (Deducted item values)

    %% Step 2: Checkout & Pujari Decision
    Customer->>App: Proceed to Checkout
    App-->>Customer: Prompt: "Do you need a Pujari for this pooja?"
    
    alt Option A: Direct Pujari Selection
        Customer->>App: Selects specific Pujari from catalog
        App->>API: Create Order + Direct Pujari Booking (requested_pujari_id)
        API->>DB: Save Order & Pujari Booking (status = pending)
        API->>WS: Push Direct Request to selected Pujari
    else Option B: Zonal Open Request (Broadcast)
        Customer->>App: Chooses "Find Pujari for Me" (No specific Pujari selected)
        App->>API: Create Order + Open Zonal Booking (requested_pujari_id = NULL)
        API->>DB: Save Order & Pujari Booking (status = pending)
        API->>WS: Broadcast to room 'zone:<customer_zone>'
        WS-->>Pujari: Instant Alert: "New Pooja Booking in your Zone!"
        Pujari->>API: POST /api/pujari-bookings/:id/accept
        API->>DB: Atomic Lock -> Assign accepted_pujari_id (status = accepted)
        API->>WS: Notify Customer & cancel open request for other Pujaris
    end

    %% Step 3: Ceremony Completion & Payment Release
    Pujari->>App: Arrives at customer location & performs Pooja
    Customer->>App: Confirms Pooja Completion (or OTP code)
    App->>API: POST /api/pujari-bookings/:id/complete
    API->>DB: Status -> 'completed'
    API-->>Pujari: Escrow Payout Released to Pujari Account
```

---

## 2. Customer Support Ticket & Admin Chat Inspection Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Devotee / Customer
    actor Executive as Support Executive
    actor Admin as Admin / Super Admin
    participant API as Support API Service
    participant WS as Socket.io Server
    participant DB as PostgreSQL DB

    %% Step 1: Ticket Creation
    Customer->>API: POST /api/support/tickets (Subject, Order ID, Issue)
    API->>DB: Save Ticket (status = 'open', assigned_executive_id = NULL)
    API->>WS: Notify Admin Dashboard (Unassigned Queue Alert)

    %% Step 2: Admin Ticket Assignment
    Admin->>API: GET /api/support/tickets/unassigned
    API-->>Admin: Display list of unopened/unassigned tickets
    Admin->>API: PUT /api/support/tickets/:id/assign (executive_id = 5)
    API->>DB: Update ticket (assigned_executive_id = 5, status = 'assigned')
    API->>WS: Notify Executive #5: "New Ticket Assigned"

    %% Step 3: Support Executive Chat Session
    Customer->>WS: Connect to room 'ticket:<ticket_id>' & Send Message
    WS->>DB: Store message in ticket_messages
    WS-->>Executive: Deliver message on Executive UI
    Executive->>WS: Reply with response message
    WS->>DB: Store response in ticket_messages
    WS-->>Customer: Deliver message on Customer App

    %% Step 4: Admin Oversight & Full Transcript Inspection
    Admin->>API: GET /api/support/tickets/:id/chat
    API->>DB: Query SELECT * FROM ticket_messages WHERE ticket_id = :id
    API-->>Admin: Return complete historical transcript
    Admin->>WS: Join room 'ticket:<ticket_id>' (Silent stream / Live monitoring)
```

---

## 3. Package Price Customization & Calculation Flow

```mermaid
flowchart TD
    A[Customer Selects Package] --> B[Server Fetches Package Base Price]
    B --> C{User Removed Any Items?}
    C -- No --> D[Final Amount = Package Base Price]
    C -- Yes --> E[Server Iterates Removed Product IDs]
    E --> F[Lookup Deduction Value for Each Product]
    F --> G[Subtract Total Deductions from Package Base Price]
    G --> H[Validate Final Amount >= Minimum Threshold]
    H --> I[Return Calculated Total & Render Summary]
    D --> I
    I --> J[User Confirms & Places Order]
```
