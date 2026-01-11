import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { startEventScheduler } from "./src/utils/eventScheduler.js";

dotenv.config();

/* ======================
   CONNECT DATABASE
====================== */
connectDB();

/* ======================
   START EVENT SCHEDULER
====================== */
startEventScheduler();

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
