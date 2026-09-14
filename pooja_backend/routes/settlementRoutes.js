import express from "express";
import { getSettlements, releaseEscrowPayout } from "../controllers/settlementController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Admin financial audit ledger and escrow stats
router.get("/", authenticate, authorize("admin"), getSettlements);

// 2. Admin manual escrow release override
router.post("/:booking_id/release", authenticate, authorize("admin"), releaseEscrowPayout);

export default router;
