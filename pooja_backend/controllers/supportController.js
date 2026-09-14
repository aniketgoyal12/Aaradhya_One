import pool from "../config/db.js";
import { getIO } from "../config/socket.js";

/**
 * 1. Open Customer Support Ticket
 * Endpoint: POST /api/support/tickets
 * Protected: Customer or Admin
 */
export const createTicket = async (req, res) => {
  const client = await pool.connect();
  try {
    const { subject, initial_message } = req.body;
    const customer_id = req.user.id;

    if (!subject) {
      return res.status(400).json({
        success: false,
        error: "Support ticket subject is required."
      });
    }

    await client.query("BEGIN");

    const ticketRes = await client.query(
      `INSERT INTO support_tickets (customer_id, subject, status)
       VALUES ($1, $2, 'open') RETURNING *`,
      [customer_id, subject]
    );
    const ticket = ticketRes.rows[0];

    // If initial message provided, insert into ticket_messages
    let messageRecord = null;
    if (initial_message && initial_message.trim()) {
      const msgRes = await client.query(
        `INSERT INTO ticket_messages (ticket_id, sender_id, message)
         VALUES ($1, $2, $3) RETURNING *`,
        [ticket.id, customer_id, initial_message.trim()]
      );
      messageRecord = msgRes.rows[0];
    }

    await client.query("COMMIT");

    // Real-Time Socket.io Alert to Admin Queue
    const io = getIO();
    if (io) {
      io.emit("NEW_SUPPORT_TICKET", {
        ticket_id: ticket.id,
        customer_name: req.user.name,
        subject: ticket.subject,
        status: ticket.status
      });
    }

    return res.status(201).json({
      success: true,
      message: "Support ticket opened successfully.",
      data: {
        ticket,
        initial_message: messageRecord
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
 * 2. Get All Support Tickets (with optional unassigned filter)
 * Endpoint: GET /api/support/tickets
 * Protected: Support or Admin
 */
export const getTickets = async (req, res) => {
  try {
    const { status, unassigned } = req.query;

    let query = `
      SELECT st.*, 
             u_cust.name AS customer_name, u_cust.email AS customer_email, u_cust.phone AS customer_phone,
             u_exec.name AS executive_name, u_exec.email AS executive_email,
             (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = st.id) AS message_count,
             (SELECT tm.message FROM ticket_messages tm WHERE tm.ticket_id = st.id ORDER BY tm.id DESC LIMIT 1) AS last_message
      FROM support_tickets st
      JOIN users u_cust ON st.customer_id = u_cust.id
      LEFT JOIN users u_exec ON st.assigned_executive_id = u_exec.id
      WHERE 1=1
    `;
    const params = [];

    if (unassigned === "true") {
      query += ` AND st.assigned_executive_id IS NULL`;
    }

    if (status) {
      params.push(status);
      query += ` AND st.status = $${params.length}`;
    }

    query += ` ORDER BY st.id DESC`;

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
 * 3. Assign Support Ticket to Executive
 * Endpoint: PUT /api/support/tickets/:id/assign
 * Protected: Admin Only
 */
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { executive_id } = req.body;

    if (!executive_id) {
      return res.status(400).json({
        success: false,
        error: "executive_id is required."
      });
    }

    // Verify executive exists and is support or admin
    const execRes = await pool.query("SELECT * FROM users WHERE id = $1", [executive_id]);
    if (execRes.rows.length === 0 || !["support", "admin"].includes(execRes.rows[0].role)) {
      return res.status(400).json({
        success: false,
        error: "Target user must have 'support' or 'admin' role."
      });
    }

    const updatedRes = await pool.query(
      `UPDATE support_tickets 
       SET assigned_executive_id = $1, status = 'in_progress' 
       WHERE id = $2 RETURNING *`,
      [executive_id, id]
    );

    if (updatedRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found."
      });
    }

    const io = getIO();
    if (io) {
      io.to(`ticket:${id}`).emit("TICKET_ASSIGNED", {
        ticket_id: id,
        executive_id,
        executive_name: execRes.rows[0].name
      });
    }

    return res.json({
      success: true,
      message: `Ticket successfully assigned to ${execRes.rows[0].name}`,
      data: updatedRes.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 4. Fetch Full Chronological Live Chat Transcript
 * Endpoint: GET /api/support/tickets/:id/messages
 * Protected: Customer (Owner), Support (Assigned), or Admin (Auditor)
 */
export const getTicketMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const ticketRes = await pool.query("SELECT * FROM support_tickets WHERE id = $1", [id]);
    if (ticketRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found."
      });
    }
    const ticket = ticketRes.rows[0];

    // RBAC: Devotee can only view their ticket; support/admin can view any
    if (req.user.role === "customer" && ticket.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You cannot view messages for this support ticket."
      });
    }

    const messagesRes = await pool.query(
      `SELECT tm.*, u.name AS sender_name, u.role AS sender_role, u.email AS sender_email
       FROM ticket_messages tm
       JOIN users u ON tm.sender_id = u.id
       WHERE tm.ticket_id = $1
       ORDER BY tm.id ASC`,
      [id]
    );

    return res.json({
      success: true,
      data: {
        ticket,
        messages: messagesRes.rows
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
 * 5. Send Real-Time Support Chat Message
 * Endpoint: POST /api/support/tickets/:id/messages
 * Protected: Authenticated Devotee, Support, or Admin
 */
export const sendTicketMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const sender_id = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message text cannot be empty."
      });
    }

    const ticketRes = await pool.query("SELECT * FROM support_tickets WHERE id = $1", [id]);
    if (ticketRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found."
      });
    }

    // Persist to PostgreSQL
    const msgRes = await pool.query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, sender_id, message.trim()]
    );

    const messageData = {
      ...msgRes.rows[0],
      sender_name: req.user.name,
      sender_role: req.user.role,
      sender_email: req.user.email
    };

    // Broadcast in real-time to Socket.io room
    const io = getIO();
    if (io) {
      io.to(`ticket:${id}`).emit("NEW_TICKET_MESSAGE", messageData);
    }

    return res.status(201).json({
      success: true,
      data: messageData
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 6. Update Support Ticket Status
 * Endpoint: PUT /api/support/tickets/:id/status
 * Protected: Support or Admin
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${validStatuses.join(", ")}`
      });
    }

    const updatedRes = await pool.query(
      "UPDATE support_tickets SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (updatedRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found."
      });
    }

    const io = getIO();
    if (io) {
      io.to(`ticket:${id}`).emit("TICKET_STATUS_CHANGED", {
        ticket_id: id,
        status
      });
    }

    return res.json({
      success: true,
      message: `Ticket status updated to ${status}.`,
      data: updatedRes.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
