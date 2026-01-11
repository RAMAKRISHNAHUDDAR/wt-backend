import cron from "node-cron";
import { updateCompletedEvents } from "../services/eventStatusService.js";
//import { sendEventReminders } from "../services/notificationService.js";

export const startEventScheduler = () => {
  cron.schedule("*/30 * * * *", async () => {
    await updateCompletedEvents();
    //await sendEventReminders();
  });
};
