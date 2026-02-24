import express from "express";
import {
  createContactInfo,
  getAllContactInfo,
  getContactInfoById,
  updateContactInfo,
  deleteContactInfo,
} from "../controllers/contactInfo.controller.js";

const router = express.Router();

router.post("/contact-info", createContactInfo);
router.get("/contact-info", getAllContactInfo);
router.get("/contact-info/:id", getContactInfoById);
router.put("/contact-info/:id", updateContactInfo);
router.delete("/contact-info/:id", deleteContactInfo);

export default router;
