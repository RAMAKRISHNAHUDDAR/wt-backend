import express from "express";
import {
  registerCoordinator,
  loginCoordinator,
  forgotPassword,
  resetPassword
} from "../controllers/coordinatorAuth.controller.js";

const router = express.Router();

/* =========================
   COORDINATOR AUTH ROUTES
========================= */

/**
 * @route   POST /api/coordinator/register
 * @desc    Register a new coordinator (club-based, auto code generation)
 * @access  Public
 */
router.post("/register", registerCoordinator);

/**
 * @route   POST /api/coordinator/login
 * @desc    Login coordinator using coordinatorCode + password
 * @access  Public
 */
router.post("/login", loginCoordinator);

/**
 * @route   POST /api/coordinator/forgot-password
 * @desc    Send OTP to coordinator email
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/coordinator/reset-password
 * @desc    Reset coordinator password using OTP
 * @access  Public
 */
router.post("/reset-password", resetPassword);

export default router;
