import pool from "../config/db.js";

/**
 * 1. Dynamic Package Customization & Masked Price Calculation
 * Endpoint: POST /api/orders/calculate
 * Computes: Final Order Amount = Package Base Price - sum(Price of Removed Items)
 */
export const calculateOrderPrice = async (req, res) => {
  try {
    const { package_id, removed_product_ids = [] } = req.body;

    if (!package_id) {
      return res.status(400).json({
        success: false,
        error: "package_id is required."
      });
    }

    const removedIds = Array.isArray(removed_product_ids)
      ? removed_product_ids.map(Number)
      : [];

    // 1. Fetch package details
    const pkgRes = await pool.query("SELECT * FROM packages WHERE id = $1", [package_id]);
    if (pkgRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Pooja package not found."
      });
    }
    const pkg = pkgRes.rows[0];
    const basePrice = Number(pkg.base_price);

    // 2. Fetch package items joined with products
    const itemsRes = await pool.query(
      `SELECT pi.id AS package_item_id, pi.product_id, pi.quantity, 
              p.name AS product_name, p.price AS unit_price, p.stock_quantity
       FROM package_items pi
       JOIN products p ON pi.product_id = p.id
       WHERE pi.package_id = $1`,
      [package_id]
    );

    if (itemsRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Package contains no bundled items."
      });
    }

    let totalDeductions = 0;
    const removedItems = [];
    const activeItems = [];

    for (const item of itemsRes.rows) {
      const isRemoved = removedIds.includes(item.product_id);
      const itemDeduction = Number(item.unit_price) * (item.quantity || 1);

      if (isRemoved) {
        totalDeductions += itemDeduction;
        removedItems.push({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          deduction_amount: itemDeduction
        });
      } else {
        activeItems.push({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          in_stock: item.stock_quantity >= item.quantity
        });
      }
    }

    if (activeItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot remove all items from a bundled pooja kit."
      });
    }

    const finalAmount = Math.max(0, basePrice - totalDeductions);

    return res.json({
      success: true,
      data: {
        package_id: pkg.id,
        package_name: pkg.name,
        base_price: basePrice.toFixed(2),
        total_deductions: totalDeductions.toFixed(2),
        final_amount: finalAmount.toFixed(2),
        active_items_count: activeItems.length,
        removed_items_count: removedItems.length,
        removed_items: removedItems,
        active_items: activeItems
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 2. Place Order with Dynamic Removals & Inventory Management
 * Endpoint: POST /api/orders
 * Protected: Requires authentication (customer, admin, etc.)
 */
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { package_id, removed_product_ids = [], needs_pujari = false } = req.body;
    const customer_id = req.user.id;

    if (!package_id) {
      return res.status(400).json({
        success: false,
        error: "package_id is required."
      });
    }

    const removedIds = Array.isArray(removed_product_ids)
      ? removed_product_ids.map(Number)
      : [];

    await client.query("BEGIN");

    // 1. Validate package
    const pkgRes = await client.query("SELECT * FROM packages WHERE id = $1", [package_id]);
    if (pkgRes.rows.length === 0) {
      throw new Error("Pooja package not found.");
    }
    const pkg = pkgRes.rows[0];
    const basePrice = Number(pkg.base_price);

    // 2. Fetch package items with products
    const itemsRes = await client.query(
      `SELECT pi.id AS package_item_id, pi.product_id, pi.quantity, 
              p.name AS product_name, p.price AS unit_price, p.stock_quantity
       FROM package_items pi
       JOIN products p ON pi.product_id = p.id
       WHERE pi.package_id = $1`,
      [package_id]
    );

    if (itemsRes.rows.length === 0) {
      throw new Error("Package has no bundled items.");
    }

    let totalDeductions = 0;
    let activeItemCount = 0;

    // 3. Verify stock for active items & calculate verified final price strictly server-side
    for (const item of itemsRes.rows) {
      const isRemoved = removedIds.includes(item.product_id);
      const itemDeduction = Number(item.unit_price) * (item.quantity || 1);

      if (isRemoved) {
        totalDeductions += itemDeduction;
      } else {
        activeItemCount++;
        // Lock product row and decrement stock
        const prodCheck = await client.query(
          "SELECT id, name, stock_quantity FROM products WHERE id = $1 FOR UPDATE",
          [item.product_id]
        );
        const currentStock = prodCheck.rows[0].stock_quantity;
        const requiredQty = item.quantity || 1;

        if (currentStock < requiredQty) {
          throw new Error(
            `Insufficient inventory for "${item.product_name}". Available: ${currentStock}, Required: ${requiredQty}`
          );
        }

        await client.query(
          "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
          [requiredQty, item.product_id]
        );
      }
    }

    if (activeItemCount === 0) {
      throw new Error("Cannot place an order with all package items removed.");
    }

    const verifiedFinalAmount = Math.max(0, basePrice - totalDeductions);

    // 4. Create Order Record
    const orderRes = await client.query(
      `INSERT INTO orders (customer_id, total_amount, needs_pujari, status)
       VALUES ($1, $2, $3, 'placed') RETURNING *`,
      [customer_id, verifiedFinalAmount, !!needs_pujari]
    );
    const createdOrder = orderRes.rows[0];

    // 5. Insert Order Items tracking dynamic removal state & historical price
    const orderItemsInserted = [];
    for (const item of itemsRes.rows) {
      const isRemoved = removedIds.includes(item.product_id);
      const oiRes = await client.query(
        `INSERT INTO order_items (order_id, package_id, product_id, removed, price_at_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [createdOrder.id, package_id, item.product_id, isRemoved, item.unit_price]
      );
      orderItemsInserted.push({
        ...oiRes.rows[0],
        product_name: item.product_name,
        quantity: item.quantity
      });
    }

    // 6. If needs_pujari = TRUE, initialize pending Pujari Booking row for Phase 3 dispatch
    let pujariBooking = null;
    if (needs_pujari) {
      const pbRes = await client.query(
        `INSERT INTO pujari_bookings (order_id, status)
         VALUES ($1, 'pending') RETURNING *`,
        [createdOrder.id]
      );
      pujariBooking = pbRes.rows[0];
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully with custom deductions applied.",
      data: {
        order: createdOrder,
        package_name: pkg.name,
        base_price: basePrice.toFixed(2),
        total_deductions: totalDeductions.toFixed(2),
        final_amount: verifiedFinalAmount.toFixed(2),
        items: orderItemsInserted,
        pujari_booking: pujariBooking
      }
    });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(400).json({
      success: false,
      error: err.message
    });
  } finally {
    client.release();
  }
};

/**
 * 3. Devotee Order History
 * Endpoint: GET /api/orders/my-orders
 * Protected: Authenticated Customer
 */
export const getMyOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;

    const ordersRes = await pool.query(
      `SELECT o.*, 
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id AND oi.removed = FALSE) AS active_items_count,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id AND oi.removed = TRUE) AS removed_items_count,
              pb.status AS pujari_status
       FROM orders o
       LEFT JOIN pujari_bookings pb ON pb.order_id = o.id
       WHERE o.customer_id = $1
       ORDER BY o.id DESC`,
      [customer_id]
    );

    return res.json({
      success: true,
      data: ordersRes.rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 4. Get Order Detail by ID
 * Endpoint: GET /api/orders/:id
 * Protected: Authenticated Devotee (Owner) or Admin
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRes = await pool.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
              pb.id AS pujari_booking_id, pb.status AS pujari_booking_status, pb.accepted_pujari_id
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       LEFT JOIN pujari_bookings pb ON pb.order_id = o.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found."
      });
    }

    const order = orderRes.rows[0];

    // RBAC check: customer can only view their own order; admin can view any
    if (req.user.role !== "admin" && order.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have access to view this order."
      });
    }

    // Fetch order items with product details
    const itemsRes = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.description AS product_description, p.image_URI,
              pkg.name AS package_name, pkg.base_price AS package_base_price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN packages pkg ON oi.package_id = pkg.id
       WHERE oi.order_id = $1
       ORDER BY oi.id ASC`,
      [id]
    );

    return res.json({
      success: true,
      data: {
        ...order,
        items: itemsRes.rows
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 5. Admin Governance: Fetch All Platform Orders
 * Endpoint: GET /api/orders
 * Protected: Admin Only
 */
export const getAllOrders = async (req, res) => {
  try {
    const ordersRes = await pool.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
              pb.id AS pujari_booking_id, pb.status AS pujari_booking_status,
              (SELECT pkg.name FROM order_items oi JOIN packages pkg ON oi.package_id = pkg.id WHERE oi.order_id = o.id LIMIT 1) AS package_name,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id AND oi.removed = FALSE) AS active_items_count,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id AND oi.removed = TRUE) AS removed_items_count
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       LEFT JOIN pujari_bookings pb ON pb.order_id = o.id
       ORDER BY o.id DESC`
    );

    return res.json({
      success: true,
      data: ordersRes.rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 6. Admin Governance: Update Order Status
 * Endpoint: PUT /api/orders/:id/status
 * Protected: Admin Only
 * Rule: If transitioning to 'cancelled', restore stock for non-removed items.
 */
export const updateOrderStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["placed", "confirmed", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${validStatuses.join(", ")}`
      });
    }

    await client.query("BEGIN");

    const currentOrderRes = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [id]);
    if (currentOrderRes.rows.length === 0) {
      throw new Error("Order not found.");
    }
    const currentOrder = currentOrderRes.rows[0];

    // If changing from active to cancelled, restore stock for active (non-removed) items
    if (currentOrder.status !== "cancelled" && status === "cancelled") {
      const itemsRes = await client.query(
        `SELECT oi.product_id, pi.quantity
         FROM order_items oi
         JOIN package_items pi ON oi.package_id = pi.package_id AND oi.product_id = pi.product_id
         WHERE oi.order_id = $1 AND oi.removed = FALSE`,
        [id]
      );

      for (const item of itemsRes.rows) {
        await client.query(
          "UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2",
          [item.quantity || 1, item.product_id]
        );
      }
    }

    const updatedRes = await client.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: updatedRes.rows[0]
    });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    client.release();
  }
};
