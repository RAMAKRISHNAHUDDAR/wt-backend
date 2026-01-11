import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* ======================
       BASIC IDENTITY DETAILS
       ====================== */

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

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@kletech\.ac\.in$/, "Invalid college email"]
    },

    /* ======================
       AUTHENTICATION DETAILS
       ====================== */

    password: {
      type: String,
      required: true,
      minlength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include uppercase, lowercase, number, and special character"
      ],
      select: false // NEVER return password
    },

    role: {
      type: String,
      enum: ["student"],
      default: "student"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    /* ======================
       FORGOT PASSWORD (OTP)
       ====================== */

    resetOTP: {
      type: String
    },

    resetOTPExpiry: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

/* ======================
   PASSWORD HASHING
   ====================== */

userSchema.pre("save", async function () {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

