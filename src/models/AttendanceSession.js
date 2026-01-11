import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coordinator",
      required: true
    },

    qrToken: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    sessionEndsAt: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("AttendanceSession", attendanceSessionSchema);
