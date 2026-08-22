const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

class PayrollService {
  // Calculate net salary
  static calculateNetSalary(baseSalary, bonus = 0, deductions = 0) {
    return baseSalary + bonus - deductions;
  }

  // Calculate deductions based on unpaid leaves
  static async calculateLeaveDeductions(userId, month, year, baseSalary) {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    // Get unpaid leaves
    const unpaidLeaves = await Leave.find({
      userId,
      type: 'unpaid',
      status: 'approved',
      fromDate: { $lte: monthEnd },
      toDate: { $gte: monthStart }
    });

    let unpaidDays = 0;
    unpaidLeaves.forEach(leave => {
      unpaidDays += leave.days;
    });

    // Calculate daily salary
    const workingDaysInMonth = monthEnd.getDate();
    const dailySalary = baseSalary / workingDaysInMonth;

    // Calculate deduction
    const deduction = dailySalary * unpaidDays;

    return {
      unpaidDays,
      deduction: Math.round(deduction)
    };
  }

  // Get attendance stats for a month
  static async getAttendanceStats(userId, month, year) {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
    const workingDays = monthEnd.getDate();

    return {
      workingDays,
      presentDays,
      totalHours: attendanceRecords.reduce((sum, a) => sum + (a.hours || 0), 0)
    };
  }

  // Get leave stats for a month
  static async getLeaveStats(userId, month, year) {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const leaves = await Leave.find({
      userId,
      status: 'approved',
      fromDate: { $lte: monthEnd },
      toDate: { $gte: monthStart }
    });

    let leaveDays = 0;
    leaves.forEach(leave => {
      leaveDays += leave.days;
    });

    return {
      leaveDays,
      leaves
    };
  }

  // Create or update payroll
  static async createOrUpdatePayroll(data) {
    const { userId, month, year, baseSalary, bonus = 0, additionalDeductions = 0 } = data;

    // Get attendance stats
    const attendanceStats = await this.getAttendanceStats(userId, month, year);

    // Get leave stats
    const leaveStats = await this.getLeaveStats(userId, month, year);

    // Calculate leave deductions
    const leaveDeduction = await this.calculateLeaveDeductions(userId, month, year, baseSalary);

    // Total deductions
    const totalDeductions = additionalDeductions + leaveDeduction.deduction;

    // Calculate net salary
    const netSalary = this.calculateNetSalary(baseSalary, bonus, totalDeductions);

    // Find existing payroll or create new
    let payroll = await Payroll.findOne({ userId, month, year });

    if (payroll) {
      payroll.baseSalary = baseSalary;
      payroll.bonus = bonus;
      payroll.deductions = totalDeductions;
      payroll.netSalary = netSalary;
      payroll.workingDays = attendanceStats.workingDays;
      payroll.presentDays = attendanceStats.presentDays;
      payroll.leaveDays = leaveStats.leaveDays;
      await payroll.save();
    } else {
      payroll = await Payroll.create({
        userId,
        month,
        year,
        baseSalary,
        bonus,
        deductions: totalDeductions,
        netSalary,
        workingDays: attendanceStats.workingDays,
        presentDays: attendanceStats.presentDays,
        leaveDays: leaveStats.leaveDays
      });
    }

    return payroll;
  }
}

module.exports = PayrollService;