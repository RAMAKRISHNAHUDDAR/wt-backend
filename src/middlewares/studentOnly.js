const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      message: "Students only"
    });
  }

  return next();
};

export default studentOnly;
