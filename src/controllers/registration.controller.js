import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

export const registerForEvent = async (req, res) => {
  try {
    const userId = req.user.id;          // team lead (from JWT)
    const { eventId, teamMembers = [], teamName } = req.body;

    /* Fetch event */
    const event = await Event.findById(eventId);
    if (!event || !event.registrationOpen) {
      return res.status(400).json({ message: "Event not available for registration" });
    }

    /* Enforce team size */
    const totalTeamSize = 1 + teamMembers.length; // +1 for team lead
    if (totalTeamSize > event.maxTeamSize) {
      return res.status(400).json({
        message: `Maximum team size allowed is ${event.maxTeamSize}`
      });
    }

    /* Ensure all team members are registered users */
    for (const member of teamMembers) {
      const exists = await User.findOne({ srn: member.srn });
      if (!exists) {
        return res.status(400).json({
          message: `Team member with SRN ${member.srn} is not a registered user`
        });
      }
    }

    /* Create registration */
    const registration = await Registration.create({
      teamLead: userId,
      event: eventId,
      teamName,
      teamMembers
    });

    res.status(201).json({
      message: "Event registered successfully",
      registrationId: registration._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
