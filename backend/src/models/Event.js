import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    /* ======================
       BASIC EVENT DETAILS
    ====================== */

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    /* ======================
       DATE, TIME & VENUE
    ====================== */

    eventDate: {
      type: Date,
      required: true
      // includes both date & time
    },

    venue: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    /* ======================
       COORDINATOR INFO
    ====================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coordinator",
      required: true
    },

    club: {
      type: String,
      required: true
      // MEDIA, CDC, CULTURAL, etc.
    },

    /* ======================
       TEAM CONFIGURATION
    ====================== */

    maxTeamSize: {
      type: Number,
      required: true,
      min: 1,
      default: 1
      // 1 → individual event
      // >1 → team event
    },

    /* ======================
       REGISTRATION CONTROL
    ====================== */

    registrationOpen: {
      type: Boolean,
      default: true
    },

    maxParticipants: {
      type: Number,
      default: null
      // null → unlimited registrations
    },

    /* ======================
       EVENT STATUS
    ====================== */

    status: {
      type: String,
      enum: ["UPCOMING", "COMPLETED", "CANCELLED"],
      default: "UPCOMING"
    },

    isVisible: {
      type: Boolean,
      default: true
    },

    /* ======================
       NOTIFICATION SUPPORT
    ====================== */

    reminderSent: {
      type: Boolean,
      default: false
      // used by notification scheduler
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Event", eventSchema);
