const Payroll = require('../models/Payroll');
const PayrollService = require('../services/payrollService');

// @desc    Get my salary
// @route   GET /api/payroll/my
// @access  Private
exports.getMySalary = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = { userId: req.user.id };

    if (month && year) {
      query.month = month;
      query.year = parseInt(year);
    }

    const payroll = await Payroll.find(query).sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: payroll.length,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get salary by user ID (Admin)
// @route   GET /api/payroll/user/:userId
// @access  Private/Admin
exports.getSalaryByUser = async (req, res) => {
  try {
    const payroll = await Payroll.find({ userId: req.params.userId })
      .populate('userId', 'name email employeeId')
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: payroll.length,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payrolls (Admin)
// @route   GET /api/payroll/all
// @access  Private/Admin
exports.getAllPayrolls = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = {};

    if (month && year) {
      query.month = month;
      query.year = parseInt(year);
    }

    const payrolls = await Payroll.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create or update payroll (Admin) - with auto-calculation
// @route   POST /api/payroll/create
// @access  Private/Admin
exports.createOrUpdatePayroll = async (req, res) => {
  try {
    const { userId, month, year, baseSalary, bonus, deductions } = req.body;

    // Use PayrollService for calculation
    const payroll = await PayrollService.createOrUpdatePayroll({
      userId,
      month,
      year,
      baseSalary,
      bonus: bonus || 0,
      additionalDeductions: deductions || 0
    });

    res.status(200).json({
      success: true,
      data: payroll,
      message: 'Payroll created/updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payroll status (Admin)
// @route   PUT /api/payroll/:id
// @access  Private/Admin
exports.updatePayrollStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found'
      });
    }

    payroll.status = status;

    if (status === 'paid') {
      payroll.paidDate = new Date();
    }

    await payroll.save();

    res.status(200).json({
      success: true,
      data: payroll,
      message: 'Payroll status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};