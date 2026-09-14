import pool from "../config/db.js";
import { getIO } from "../config/socket.js";

/**
 * 1. Create Pujari Booking (Direct Request or Zonal Broadcast)
 * Endpoint: POST /api/pujari-bookings
 * Protected: Customer or Admin
 */
export const createBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { order_id, requested_pujari_id, ceremony_name, zone, payout_amount = 1500.00 } = req.body;

    if (!order_id || !ceremony_name || !zone) {
      return res.status(400).json({
        success: false,
        error: "order_id, ceremony_name, and delivery zone are required."
      });
    }

    await client.query("BEGIN");

    // Verify order exists
    const orderRes = await client.query("SELECT * FROM orders WHERE id = $1", [order_id]);
    if (orderRes.rows.length === 0) {
      throw new Error("Linked order not found.");
    }

    // Insert into pujari_bookings
    const bookingRes = await client.query(
      `INSERT INTO pujari_bookings (order_id, requested_pujari_id, ceremony_name, zone, payout_amount, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [order_id, requested_pujari_id || null, ceremony_name, zone, payout_amount]
    );
    const booking = bookingRes.rows[0];

    // Create Initial Escrow Holding Record in payout_transactions (Phase 6)
    await client.query(
      `INSERT INTO payout_transactions (booking_id, pujari_id, amount, status, transaction_ref)
       VALUES ($1, $2, $3, 'escrow_held', $4)`,
      [booking.id, requested_pujari_id || null, payout_amount, `ESCROW-${Date.now()}`]
    );

    // Update order needs_pujari flag to TRUE
    await client.query("UPDATE orders SET needs_pujari = TRUE WHERE id = $1", [order_id]);

    await client.query("COMMIT");

    // Real-Time Zonal Broadcast via Socket.io (Phase 3)
    const io = getIO();
    if (io) {
      io.to(`zone:${zone}`).emit("NEW_POOJA_REQUEST", {
        booking_id: booking.id,
        order_id: booking.order_id,
        ceremony_name: booking.ceremony_name,
        zone: booking.zone,
        payout_amount: booking.payout_amount,
        created_at: booking.created_at
      });
    }

    return res.status(201).json({
      success: true,
      message: requested_pujari_id
        ? "Direct Pujari request initiated."
        : `Zonal broadcast emitted to active Pujaris in zone: ${zone}`,
      data: booking
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

/**
 * 2. Get Open Zonal Feed for Pujaris
 * Endpoint: GET /api/pujari-bookings/zonal-feed
 * Protected: Pujari or Admin
 */
export const getZonalFeed = async (req, res) => {
  try {
    const userZone = req.user.zone;
    const query = req.user.role === 'admin'
      ? `SELECT pb.*, o.customer_id, u.name AS customer_name, u.phone AS customer_phone
         FROM pujari_bookings pb
         JOIN orders o ON pb.order_id = o.id
         JOIN users u ON o.customer_id = u.id
         WHERE pb.status = 'pending' AND pb.accepted_pujari_id IS NULL
         ORDER BY pb.id DESC`
      : `SELECT pb.*, o.customer_id, u.name AS customer_name, u.phone AS customer_phone
         FROM pujari_bookings pb
         JOIN orders o ON pb.order_id = o.id
         JOIN users u ON o.customer_id = u.id
         WHERE pb.status = 'pending' AND pb.accepted_pujari_id IS NULL AND (pb.zone = $1 OR pb.zone IS NULL)
         ORDER BY pb.id DESC`;

    const params = req.user.role === 'admin' ? [] : [userZone];
    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 3. Atomic Acceptance of Zonal Broadcast (Race-Condition Free)
 * Endpoint: POST /api/pujari-bookings/:id/accept
 * Protected: Pujari Only (or Admin override)
 */
export const acceptBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const pujari_id = req.user.id;

    await client.query("BEGIN");

    // Atomic Row-Level Lock: Prevent multiple Pujaris from accepting simultaneously
    const lockRes = await client.query(
      "SELECT * FROM pujari_bookings WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (lockRes.rows.length === 0) {
      throw new Error("Pooja booking not found.");
    }

    const booking = lockRes.rows[0];

    if (booking.status !== "pending" || booking.accepted_pujari_id !== null) {
      return res.status(409).json({
        success: false,
        error: "Atomic Lock: Booking has already been accepted by another Pujari."
      });
    }

    // Generate 6-digit ceremony completion verification OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const updatedRes = await client.query(
      `UPDATE pujari_bookings 
       SET accepted_pujari_id = $1, status = 'accepted', otp = $2 
       WHERE id = $3 RETURNING *`,
      [pujari_id, generatedOtp, id]
    );

    // Update escrow transaction assignment
    await client.query(
      `UPDATE payout_transactions 
       SET pujari_id = $1 
       WHERE booking_id = $2 AND status = 'escrow_held'`,
      [pujari_id, id]
    );

    await client.query("COMMIT");

    // Real-Time Notification
    const io = getIO();
    if (io) {
      io.to(`zone:${booking.zone}`).emit("POOJA_ACCEPTED", {
        booking_id: id,
        pujari_id,
        pujari_name: req.user.name,
        status: "accepted"
      });
    }

    return res.json({
      success: true,
      message: "Booking accepted successfully! Complete ceremony using the generated verification OTP.",
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

/**
 * 4. Verify OTP & Complete Ceremony (Releases Escrow Payout)
 * Endpoint: POST /api/pujari-bookings/:id/complete
 * Protected: Pujari or Admin
 */
export const completeBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { otp } = req.body;

    await client.query("BEGIN");

    const bookingRes = await client.query(
      "SELECT * FROM pujari_bookings WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (bookingRes.rows.length === 0) {
      throw new Error("Booking not found.");
    }

    const booking = bookingRes.rows[0];

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        error: "Ceremony has already been completed and payout released."
      });
    }

    // OTP verification (Admin can override if necessary)
    if (req.user.role !== 'admin') {
      if (!otp || otp !== booking.otp) {
        return res.status(400).json({
          success: false,
          error: "Invalid ceremony completion OTP provided by devotee."
        });
      }
    }

    // Mark booking completed
    const updatedRes = await client.query(
      `UPDATE pujari_bookings 
       SET status = 'completed', completed_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    // Release Escrow Payout (Phase 6)
    const releaseRef = `PAYOUT-REL-${Date.now()}`;
    await client.query(
      `UPDATE payout_transactions 
       SET status = 'released', released_at = NOW(), transaction_ref = $1 
       WHERE booking_id = $2`,
      [releaseRef, id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Ceremony verified via OTP! Escrow payout released successfully.",
      data: {
        booking: updatedRes.rows[0],
        payout_status: "released",
        transaction_ref: releaseRef
      }
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

/**
 * 5. Admin Governance: Fetch All Bookings
 * Endpoint: GET /api/pujari-bookings
 * Protected: Admin Only
 */
export const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pb.*, 
              u_cust.name AS customer_name, u_cust.phone AS customer_phone, u_cust.email AS customer_email,
              u_puj.name AS pujari_name, u_puj.phone AS pujari_phone, u_puj.zone AS pujari_zone,
              pt.status AS payout_status, pt.transaction_ref
       FROM pujari_bookings pb
       JOIN orders o ON pb.order_id = o.id
       JOIN users u_cust ON o.customer_id = u_cust.id
       LEFT JOIN users u_puj ON pb.accepted_pujari_id = u_puj.id
       LEFT JOIN payout_transactions pt ON pt.booking_id = pb.id
       ORDER BY pb.id DESC`
    );

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 6. Pujari Directory & Zonal Coverage
 * Endpoint: GET /api/pujari-bookings/pujaris
 * Protected: Authenticated Users
 */
export const getPujarisDirectory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.zone, u.created_at,
              COUNT(pb.id) FILTER (WHERE pb.status = 'completed') AS completed_ceremonies,
              COUNT(pb.id) FILTER (WHERE pb.status = 'accepted') AS active_bookings
       FROM users u
       LEFT JOIN pujari_bookings pb ON pb.accepted_pujari_id = u.id
       WHERE u.role = 'pujari'
       GROUP BY u.id
       ORDER BY u.zone ASC, u.name ASC`
    );

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
