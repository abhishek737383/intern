import express from "express";
import { login, signup } from "../controller/auth.js";
import { getallusers, updateprofile } from "../controller/users.js";
import { addPoints, reducePoints, transferPoints } from "../controller/userRewards.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Authentication & Profile Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/getallusers", getallusers);
router.patch("/update/:id", auth, updateprofile);

// Reward Endpoints
router.patch("/addpoints/:id", auth, addPoints);
router.patch("/reducepoints/:id", auth, reducePoints);
router.post("/transferpoints", auth, transferPoints);

export default router;
