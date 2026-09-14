  DROP TABLE IF EXISTS support_tickets, pujari_bookings, order_items, orders, package_items, packages, products, users CASCADE;

--USERS
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'pujari', 'support', 'admin')),
    zone VARCHAR(100), --used only if role == 'pujari'
    created_at TIMESTAMP DEFAULT NOW()
);


--PRODUCTS
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL, -- stored internally though packages have their own price
    image_URI TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);


--PACKAGES
CREATE TABLE packages(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL, --sum of all items that are included in the package
    image_URI TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


--PACKAGE ITEMS 
CREATE TABLE package_items(
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1
);


--ORDERS 
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    total_amount NUMERIC(10,2) NOT NULL,
    needs_pujari BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'placed', --placed, confirmed, cancelled
    created_at TIMESTAMP DEFAULT NOW()
);


--ORDER ITEMS
CREATE TABLE order_items(
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    package_id INTEGER REFERENCES packages(id),
    product_id INTEGER REFERENCES products(id),
    removed BOOLEAN DEFAULT FALSE,
    price_at_order NUMERIC(10,2) NOT NULL
);


--PUJARI BOOKINGS
CREATE TABLE pujari_bookings(
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    requested_pujari_id INTEGER REFERENCES users(id),
    accepted_pujari_id INTEGER REFERENCES users(id),
    ceremony_name VARCHAR(150),
    zone VARCHAR(100),
    payout_amount NUMERIC(10,2) DEFAULT 1500.00,
    otp VARCHAR(6),
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, completed, cancelled
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);


--PAYOUT TRANSACTIONS & ESCROW (Phase 6)
CREATE TABLE payout_transactions(
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES pujari_bookings(id),
    pujari_id INTEGER REFERENCES users(id),
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'escrow_held', -- escrow_held, released, refunded
    released_at TIMESTAMP,
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);


--SUPPORT TICKETS
CREATE TABLE support_tickets(
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    assigned_executive_id INTEGER REFERENCES users(id),
    subject VARCHAR(200),
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
    created_at TIMESTAMP DEFAULT NOW()
);


--TICKET MESSAGES
CREATE TABLE ticket_messages(
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES support_tickets(id),
    sender_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW()
);  
