import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Campus Clubs & Events Backend Running");
});

export default app;

import coordinatorAuthRoutes from "./routes/coordinatorAuthRoutes.js";
app.use("/api/coordinator", coordinatorAuthRoutes);


import eventRoutes from "./routes/event.routes.js";
app.use("/api/events", eventRoutes);


import registrationRoutes from "./routes/registration.routes.js";
app.use("/api/registrations", registrationRoutes);


import attendanceRoutes from "./routes/attendance.routes.js";
app.use("/api/attendance", attendanceRoutes);
