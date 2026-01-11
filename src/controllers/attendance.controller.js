import crypto from "crypto";
import AttendanceSession from "../models/AttendanceSession.js";
import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

/* =========================
   OPEN ATTENDANCE
========================= */
export const openAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const now = Date.now();

    const session = await AttendanceSession.findOneAndUpdate(
      { event: eventId },
      {
        coordinator: req.user.id,
        qrToken: crypto.randomUUID(),
        expiresAt: new Date(now + 2 * 60 * 1000),      // 2 min
        sessionEndsAt: new Date(now + 15 * 60 * 1000), // 15 min
        isActive: true
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Attendance opened",
      qrToken: session.qrToken,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET CURRENT QR
========================= */
export const getCurrentQR = async (req, res) => {
  try {
    const { eventId } = req.params;

    const session = await AttendanceSession.findOne({ event: eventId });

    if (!session || !session.isActive) {
      return res.status(400).json({ message: "Attendance not active" });
    }

    if (Date.now() > session.sessionEndsAt) {
      session.isActive = false;
      await session.save();
      return res.status(400).json({ message: "Attendance window closed" });
    }

    if (Date.now() > session.expiresAt) {
      session.qrToken = crypto.randomUUID();
      session.expiresAt = new Date(Date.now() + 2 * 60 * 1000);
      await session.save();
    }

    res.json({
      qrToken: session.qrToken,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   MARK ATTENDANCE
========================= */
export const markAttendance = async (req, res) => {
  try {
    const { eventId, qrToken } = req.body;

    const session = await AttendanceSession.findOne({
      event: eventId,
      isActive: true,
      qrToken
    });

    if (!session) {
      return res.status(400).json({ message: "Invalid or expired QR" });
    }

    if (Date.now() > session.expiresAt) {
      return res.status(400).json({ message: "QR expired" });
    }

    const registration = await Registration.findOne({
      event: eventId,
      $or: [
        { teamLead: req.user.id },
        { "teamMembers.srn": req.user.srn }
      ]
    });

    if (!registration) {
      return res.status(403).json({ message: "Not registered for event" });
    }

    await Attendance.create({
      user: req.user.id,
      event: eventId
    });

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Attendance already marked" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CLOSE ATTENDANCE
========================= */
export const closeAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const session = await AttendanceSession.findOne({ event: eventId });

    if (!session) {
      return res.status(404).json({ message: "Attendance session not found" });
    }

    if (session.coordinator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.isActive = false;
    await session.save();

    res.json({ message: "Attendance closed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
