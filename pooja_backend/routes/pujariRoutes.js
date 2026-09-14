import express from "express";
import {
  createBooking,
  getZonalFeed,
  acceptBooking,
  completeBooking,
  getAllBookings,
  getPujarisDirectory
} from "../controllers/pujariController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create booking (Customer or Admin)
router.post("/", authenticate, createBooking);

// 2. Open zonal broadcast feed for Pujaris
router.get("/zonal-feed", authenticate, authorize("pujari", "admin"), getZonalFeed);

// 3. Atomic accept broadcast (Pujari or Admin)
router.post("/:id/accept", authenticate, authorize("pujari", "admin"), acceptBooking);

// 4. Verify OTP & complete ceremony (Releases escrow payout)
router.post("/:id/complete", authenticate, authorize("pujari", "admin"), completeBooking);

// 5. Admin Governance: All platform bookings
router.get("/", authenticate, authorize("admin"), getAllBookings);

// 6. Pujari directory with zonal distribution
router.get("/pujaris", authenticate, getPujarisDirectory);

export default router;
