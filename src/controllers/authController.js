import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

/* =========================
   REGISTER STUDENT
========================= */
export const registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      message: "Student registered successfully",
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   LOGIN STUDENT (SRN + PASSWORD)
========================= */
export const loginUser = async (req, res) => {
  try {
    const { srn, password } = req.body;

    const user = await User.findOne({ srn }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid SRN or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid SRN or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        srn: user.srn,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    otp
});

    res.json({ message: "OTP sent to registered email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      resetOTP: hashedOTP,
      resetOTPExpiry: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
