import express from "express"
import { getUser, register } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register", register)
router.get("/getalluser", getUser)


export default router