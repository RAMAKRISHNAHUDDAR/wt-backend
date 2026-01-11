import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    markedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

/* Prevent duplicate attendance */
attendanceSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
