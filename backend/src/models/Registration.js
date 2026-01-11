import mongoose from "mongoose";

/* ======================
   TEAM MEMBER SUB-SCHEMA
====================== */
const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },

    srn: {
      type: String,
      required: true,
      uppercase: true,
      length: 12
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },

    branch: {
      type: String,
      required: true,
      enum: ["CSE", "MECH", "CIVIL", "EC", "EEE", "BIOMED", "CHEMICAL"]
    }
  },
  { _id: false }
);

/* ======================
   REGISTRATION SCHEMA
====================== */
const registrationSchema = new mongoose.Schema(
  {
    /* ======================
       TEAM LEADER (AUTO)
    ====================== */

    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /* ======================
       EVENT
    ====================== */

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    /* ======================
       TEAM DETAILS
    ====================== */

    teamName: {
      type: String,
      trim: true,
      maxlength: 50
    },

    teamMembers: {
      type: [teamMemberSchema],
      default: []
    },

    /* ======================
       REGISTRATION STATUS
    ====================== */

    status: {
      type: String,
      enum: ["REGISTERED", "CANCELLED"],
      default: "REGISTERED"
    }
  },
  {
    timestamps: true
  }
);

/* ======================
   PREVENT DUPLICATE REGISTRATION
====================== */
registrationSchema.index(
  { teamLead: 1, event: 1 },
  { unique: true }
);

export default mongoose.model("Registration", registrationSchema);
