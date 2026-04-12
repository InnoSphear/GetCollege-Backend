import express from "express";
import {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  compareColleges,
} from "../controllers/college.controller.js";

const router = express.Router();

// Create College
router.post("/college", createCollege);

// Get All Colleges
router.get("/college", getAllColleges);
router.get("/college-compare", compareColleges);

// Get College By ID
router.get("/college/:id", getCollegeById);

// Update College By ID
router.put("/college/:id", updateCollege);

// Delete College By ID
router.delete("/college/:id", deleteCollege);

export default router;
