import express from "express";
import {
  calculateOrderPrice,
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Calculate dynamic package price with item deductions (Public calculation preview)
router.post("/calculate", calculateOrderPrice);

// 2. Place order with custom deductions & stock decrement (Authenticated user)
router.post("/", authenticate, createOrder);

// 3. Devotee order history (Authenticated user)
router.get("/my-orders", authenticate, getMyOrders);

// 4. Admin Governance: Fetch all platform orders (Admin only)
router.get("/", authenticate, authorize("admin"), getAllOrders);

// 5. Get single order breakdown (Owner or Admin)
router.get("/:id", authenticate, getOrderById);

// 6. Admin Governance: Update order status & manage inventory return on cancel (Admin only)
router.put("/:id/status", authenticate, authorize("admin"), updateOrderStatus);

export default router;
