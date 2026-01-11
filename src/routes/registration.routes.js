import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import studentOnly from "../middlewares/studentOnly.js";
import { registerForEvent } from "../controllers/registration.controller.js";

const router = express.Router();

/* Student registers for event */
router.post(
  "/",
  authMiddleware,
  studentOnly,
  registerForEvent
);

export default router;
