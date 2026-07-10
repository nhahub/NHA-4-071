const courseService = require("../services/courseService");

exports.getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getCourseOfferings = async (req, res) => {
  try {
    const offerings = await courseService.getCourseOfferings(req.params.id);
    res.status(200).json({ success: true, data: offerings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
