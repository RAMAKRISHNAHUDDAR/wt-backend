const coordinatorOnly = (req, res, next) => {
  if (req.user.role !== "coordinator") {
    return res.status(403).json({
      message: "Only coordinators can perform this action"
    });
  }

  return next(); // ✅ REQUIRED
};

export default coordinatorOnly;
