const Attendance = require('../models/Attendance');

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today',
        data: existingAttendance
      });
    }

    const attendance = await Attendance.create({
      userId: req.user.id,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Checked in successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'No check-in found for today. Please check in first.'
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out today',
        data: attendance
      });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance,
      message: `Checked out successfully. Total hours: ${attendance.hours}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my attendance
// @route   GET /api/attendance/my
// @access  Private
exports.getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = { userId: req.user.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    const totalHours = attendance.reduce((sum, record) => sum + (record.hours || 0), 0);
    const presentDays = attendance.filter(a => a.status === 'present').length;

    res.status(200).json({
      success: true,
      count: attendance.length,
      stats: {
        totalHours: parseFloat(totalHours.toFixed(2)),
        presentDays,
        totalRecords: attendance.length
      },
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance by user ID (Admin)
// @route   GET /api/attendance/user/:userId
// @access  Private/Admin
exports.getAttendanceByUser = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.params.userId })
      .populate('userId', 'name email employeeId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all attendance (Admin)
// @route   GET /api/attendance/all
// @access  Private/Admin
exports.getAllAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};