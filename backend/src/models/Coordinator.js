import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* CLUB → CODE PREFIX MAP */
const CLUB_CODE_MAP = {
  HR_LITERARY: "HRL",
  CDC: "CDC",
  MEDIA: "MED",
  CULTURAL: "CUL",
  WOMEN_EMPOWERMENT: "WEP",
  FINE_ARTS: "FAS"
};

const coordinatorSchema = new mongoose.Schema(
  {
    /* BASIC DETAILS */

    name: {
  type: String,
  required: true,
  maxlength: 50,
  trim: true
},

srn: {
  type: String,
  required: true,
  length: 12,
  unique: true,
  uppercase: true,
  trim: true
},

branch: {
  type: String,
  required: true,
  enum: ["CSE", "MECH", "CIVIL", "EC", "EEE", "BIOMED", "CHEMICAL"]
},

year: {
  type: Number,
  required: true,
  min: 1,
  max: 4
},

semester: {
  type: Number,
  required: true,
  min: 1,
  max: 8
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  match: [/^[a-zA-Z0-9._%+-]+@kletech\.ac\.in$/]
},

/* CLUB SELECTION */

club: {
  type: String,
  required: true,
  unique: true, // only ONE coordinator per club
  enum: Object.keys(CLUB_CODE_MAP)
},

    /* AUTO-GENERATED CODE */

    coordinatorCode: {
      type: String,
      unique: true
    },

    /* AUTH */

    password: {
      type: String,
      required: true,
      minlength: 8,
      match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      select: false
    },

    role: {
      type: String,
      default: "coordinator",
      immutable: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    /* PASSWORD RESET (OTP) */

    resetOTP: String,
    resetOTPExpiry: Date
  },
  { timestamps: true }
);

/* AUTO-GENERATE COORDINATOR CODE */
coordinatorSchema.pre("validate", function () {
  if (!this.coordinatorCode) {
    const prefix = CLUB_CODE_MAP[this.club];
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    this.coordinatorCode = `${prefix}${yearSuffix}`;
  }
});

/* PASSWORD HASHING (NO next()) */
coordinatorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* PASSWORD COMPARE */
coordinatorSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Coordinator", coordinatorSchema);
