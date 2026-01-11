import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id,
      club: req.user.club
    });

    res.status(201).json({
      message: "Event created successfully",
      eventId: event._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isVisible: true }).sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only creator can delete
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this event"
      });
    }

    event.status = "CANCELLED";
    event.isVisible = false;
    await event.save();

    res.json({ message: "Event cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
