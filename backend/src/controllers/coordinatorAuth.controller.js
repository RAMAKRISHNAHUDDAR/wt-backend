import Coordinator from "../models/Coordinator.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";


/* REGISTER */
export const registerCoordinator = async (req, res) => {
  const { club } = req.body;

  const exists = await Coordinator.findOne({ club });
  if (exists) {
    return res.status(400).json({
      message: "Coordinator already exists for this club"
    });
  }

  const coordinator = await Coordinator.create(req.body);

  res.status(201).json({
    message: "Coordinator registered successfully",
    coordinatorCode: coordinator.coordinatorCode
  });
};

/* LOGIN (CODE + PASSWORD) */
export const loginCoordinator = async (req, res) => {
  const { coordinatorCode, password } = req.body;

  const coordinator = await Coordinator.findOne({ coordinatorCode }).select("+password");
  if (!coordinator) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await coordinator.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: coordinator._id,
      role: "coordinator",
      club: coordinator.club
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

/* FORGOT PASSWORD (OTP) */
export const forgotPassword = async (req, res) => {
  const coordinator = await Coordinator.findOne({ email: req.body.email });
  if (!coordinator) {
    return res.status(404).json({ message: "Coordinator not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  coordinator.resetOTP = otp;
  coordinator.resetOTPExpiry = Date.now() + 10 * 60 * 1000;

  await coordinator.save();
  sendEmail({
  to: coordinator.email,
  subject: "Coordinator Password Reset OTP",
  otp
});

  res.json({ message: "OTP sent to registered email" });
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const coordinator = await Coordinator.findOne({
    email,
    resetOTP: otp,
    resetOTPExpiry: { $gt: Date.now() }
  });

  if (!coordinator) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  coordinator.password = newPassword;
  coordinator.resetOTP = undefined;
  coordinator.resetOTPExpiry = undefined;

  await coordinator.save();

  res.json({ message: "Password reset successful" });
};
