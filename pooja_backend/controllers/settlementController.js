import pool from "../config/db.js";

/**
 * 1. Admin Financial Audit Ledger & Escrow Overview
 * Endpoint: GET /api/settlements
 * Protected: Admin Only
 */
export const getSettlements = async (req, res) => {
  try {
    // 1. Fetch all transaction records
    const transactionsRes = await pool.query(
      `SELECT pt.*, 
              pb.ceremony_name, pb.zone, pb.status AS booking_status, pb.otp,
              u.name AS pujari_name, u.phone AS pujari_phone, u.email AS pujari_email
       FROM payout_transactions pt
       JOIN pujari_bookings pb ON pt.booking_id = pb.id
       LEFT JOIN users u ON pt.pujari_id = u.id
       ORDER BY pt.id DESC`
    );

    // 2. Compute aggregate financial metrics
    const statsRes = await pool.query(
      `SELECT 
         COALESCE(SUM(total_amount), 0) AS total_gmv,
         (SELECT COALESCE(SUM(amount), 0) FROM payout_transactions WHERE status = 'escrow_held') AS total_escrow_held,
         (SELECT COALESCE(SUM(amount), 0) FROM payout_transactions WHERE status = 'released') AS total_payouts_released,
         (SELECT COUNT(*) FROM payout_transactions) AS total_transactions
       FROM orders WHERE status != 'cancelled'`
    );

    return res.json({
      success: true,
      data: {
        stats: {
          total_gmv: parseFloat(statsRes.rows[0].total_gmv).toFixed(2),
          total_escrow_held: parseFloat(statsRes.rows[0].total_escrow_held).toFixed(2),
          total_payouts_released: parseFloat(statsRes.rows[0].total_payouts_released).toFixed(2),
          total_transactions: parseInt(statsRes.rows[0].total_transactions, 10)
        },
        transactions: transactionsRes.rows
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
 * 2. Admin Manual Escrow Release Override
 * Endpoint: POST /api/settlements/:booking_id/release
 * Protected: Admin Only
 */
export const releaseEscrowPayout = async (req, res) => {
  const client = await pool.connect();
  try {
    const { booking_id } = req.params;

    await client.query("BEGIN");

    const ptRes = await client.query(
      "SELECT * FROM payout_transactions WHERE booking_id = $1 FOR UPDATE",
      [booking_id]
    );

    if (ptRes.rows.length === 0) {
      throw new Error("Payout transaction not found for this booking.");
    }

    const txn = ptRes.rows[0];

    if (txn.status === "released") {
      return res.status(400).json({
        success: false,
        error: "Escrow funds have already been released for this booking."
      });
    }

    const releaseRef = `ADMIN-REL-${Date.now()}`;
    await client.query(
      `UPDATE payout_transactions 
       SET status = 'released', released_at = NOW(), transaction_ref = $1 
       WHERE booking_id = $2`,
      [releaseRef, booking_id]
    );

    await client.query(
      "UPDATE pujari_bookings SET status = 'completed', completed_at = NOW() WHERE id = $1",
      [booking_id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Admin override: Escrow payout released successfully.",
      data: {
        booking_id,
        transaction_ref: releaseRef,
        status: "released"
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
