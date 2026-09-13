import express from "express";
import {
  getAllPackages,
  getPackageById,
  createPackage
} from "../controllers/packageController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.post("/", authenticate, authorize("admin"), createPackage);

export default router;
