import Event from "../models/Event.js";

export const updateCompletedEvents = async () => {
  const now = new Date();

  await Event.updateMany(
    {
      eventDate: { $lt: now },
      status: "UPCOMING"
    },
    {
      $set: { status: "COMPLETED" }
    }
  );
};
