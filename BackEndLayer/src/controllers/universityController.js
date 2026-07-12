const universityService = require("../services/universityService");

// ===== DEPARTMENTS =====
exports.createDepartment = async (req, res) => {
  try {
    const dept = await universityService.createDepartment(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const depts = await universityService.getDepartments();
    res.status(200).json({ success: true, data: depts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== SEMESTERS =====
exports.createSemester = async (req, res) => {
  try {
    const semester = await universityService.createSemester(req.body);
    res.status(201).json({ success: true, data: semester });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSemesters = async (req, res) => {
  try {
    const semesters = await universityService.getSemesters();
    res.status(200).json({ success: true, data: semesters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentSemester = async (req, res) => {
  try {
    const current = await universityService.getCurrentSemester();
    res.status(200).json({ success: true, data: current });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== COURSES =====
exports.createCourse = async (req, res) => {
  try {
    const course = await universityService.createCourse(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    const courses = await universityService.getAvailableCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== COURSE OFFERINGS =====
exports.createOffering = async (req, res) => {
  try {
    const offering = await universityService.createOffering(req.body);
    res.status(201).json({ success: true, data: offering });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOfferingsByCourse = async (req, res) => {
  try {
    const offerings = await universityService.getOfferingsByCourse(
      req.params.courseId,
    );
    res.status(200).json({ success: true, data: offerings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
