import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import sendEmail from "../utils/sendEmail.js";

export const sendEventReminders = async () => {
  const tomorrowStart = new Date();
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const events = await Event.find({
    eventDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
    reminderSent: false,
    status: "UPCOMING"
  });

  for (const event of events) {
    const registrations = await Registration
      .find({ event: event._id })
      .populate("user");

    for (const reg of registrations) {
      await sendEmail({
        to: reg.user.email,
        subject: `Reminder: ${event.title}`,
        otp: `Your event "${event.title}" is scheduled tomorrow at ${event.venue}`
      });
    }

    event.reminderSent = true;
    await event.save();
  }
};
