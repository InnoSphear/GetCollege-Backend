import express from "express";
import { adminLogin, verifyAdmin } from "../controllers/auth.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.get("/admin/verify", requireAdminAuth, verifyAdmin);

export default router;
