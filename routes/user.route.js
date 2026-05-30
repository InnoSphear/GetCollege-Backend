import express from "express"
import { getUser, register, updateLead, deleteLead } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register", register)
router.get("/getalluser", getUser)
router.put("/user/:id", updateLead);
router.delete("/user/:id", deleteLead);


export default router