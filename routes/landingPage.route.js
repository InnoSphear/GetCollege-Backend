import express from "express";
import {
  createLandingPage,
  getAllLandingPages,
  getLandingPageBySlug,
  getLandingPageById,
  updateLandingPage,
  deleteLandingPage,
} from "../controllers/landingPage.controller.js";

const router = express.Router();

router.post("/landing-page", createLandingPage);
router.get("/landing-page", getAllLandingPages);
router.get("/landing-page/slug/:slug", getLandingPageBySlug);
router.get("/landing-page/:id", getLandingPageById);
router.put("/landing-page/:id", updateLandingPage);
router.delete("/landing-page/:id", deleteLandingPage);

export default router;