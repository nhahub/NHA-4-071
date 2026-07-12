const enrollmentService = require("../services/enrollmentService");
const Enrollment = require("../models/Enrollment");

exports.enroll = async (req, res) => {
  try {
    const enrollment = await enrollmentService.enrollCourse(
      req.user.id,
      req.body.courseId,
    );
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    console.error("Enrollment error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user.id);
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const enrollment = await enrollmentService.dropCourse(
      req.user.id,
      req.params.id,
    );
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: recalibrate enrolledCount on all offerings + remove duplicate enrollment records
exports.recalibrate = async (req, res) => {
  try {
    // 1. Recalculate enrolledCount from actual enrollment records
    const counts = await enrollmentService.recalibrateCounts();

    // 2. Remove duplicate enrollment records (keep only the newest per student+offering)
    const duplicates = await Enrollment.aggregate([
      { $group: { _id: { studentId: "$studentId", offeringId: "$offeringId" }, docs: { $push: "$_id" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    let removedDuplicates = 0;
    for (const group of duplicates) {
      const sorted = group.docs.sort();
      const toRemove = sorted.slice(1);
      await Enrollment.deleteMany({ _id: { $in: toRemove } });
      removedDuplicates += toRemove.length;
    }

    res.status(200).json({
      success: true,
      data: {
        offeringsChecked: counts.total,
        countsFixed: counts.fixed,
        duplicateRecordsRemoved: removedDuplicates,
      },
    });
  } catch (error) {
    console.error("Recalibration error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
