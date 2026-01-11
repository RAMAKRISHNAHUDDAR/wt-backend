import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import coordinatorOnly from "../middlewares/coordinatorOnly.js";
import { createEvent, getAllEvents, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

/* Coordinator creates event */
router.post(
  "/",
  authMiddleware,
  coordinatorOnly,
  createEvent
);

router.delete(
  "/:id",
  authMiddleware,
  coordinatorOnly,
  deleteEvent
);


/* Dashboard: get all events */
router.get("/", getAllEvents);

export default router;
