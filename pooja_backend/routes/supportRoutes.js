import express from "express";
import {
  createTicket,
  getTickets,
  assignTicket,
  getTicketMessages,
  sendTicketMessage,
  updateTicketStatus
} from "../controllers/supportController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create support ticket (Customer, Support, Admin)
router.post("/tickets", authenticate, createTicket);

// 2. Query tickets / unassigned queue (Support, Admin)
router.get("/tickets", authenticate, authorize("support", "admin"), getTickets);

// 3. Assign ticket to executive (Admin only)
router.put("/tickets/:id/assign", authenticate, authorize("admin"), assignTicket);

// 4. View full chat transcript (Customer owner, Support, Admin auditor)
router.get("/tickets/:id/messages", authenticate, getTicketMessages);

// 5. Send message in ticket (Authenticated chat participant)
router.post("/tickets/:id/messages", authenticate, sendTicketMessage);

// 6. Update status (Support, Admin)
router.put("/tickets/:id/status", authenticate, authorize("support", "admin"), updateTicketStatus);

export default router;
