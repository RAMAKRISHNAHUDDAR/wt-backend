import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import coordinatorOnly from "../middlewares/coordinatorOnly.js";
import studentOnly from "../middlewares/studentOnly.js";
import {
  openAttendance,
  getCurrentQR,
  markAttendance,
  closeAttendance
} from "../controllers/attendance.controller.js";

const router = express.Router();

/* Coordinator opens attendance */
router.post(
  "/open/:eventId",
  authMiddleware,
  coordinatorOnly,
  openAttendance
);

/* Dashboard fetches latest QR */
router.get(
  "/qr/:eventId",
  authMiddleware,
  getCurrentQR
);

/* Student scans QR */
router.post(
  "/mark",
  authMiddleware,
  studentOnly,
  markAttendance
);

/* Coordinator closes attendance */
router.post(
  "/close/:eventId",
  authMiddleware,
  coordinatorOnly,
  closeAttendance
);

export default router;
