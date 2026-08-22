const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are admin/hr only
router.use(protect);
router.use(authorize('admin', 'hr'));

// Dashboard stats
router.get('/stats', getDashboardStats);
router.get('/dashboard', getDashboardStats);

// Employee management
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', authorize('admin'), deleteEmployee); // Only admin can delete

// User management (alias routes)
router.get('/users', getAllEmployees);
router.get('/users/:id', getEmployeeById);
router.put('/users/:id', updateEmployee);
router.delete('/users/:id', authorize('admin'), deleteEmployee);

// Attendance routes (delegated to attendance controller)
const { getAllAttendance, getAttendanceByUser } = require('../controllers/attendanceController');
router.get('/attendance', getAllAttendance);
router.get('/attendance/:userId', getAttendanceByUser);

// Leave routes (delegated to leave controller)
const { getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
router.get('/leaves', getAllLeaves);
router.put('/leaves/:id', updateLeaveStatus);

// Payroll routes (delegated to payroll controller)
const { getAllPayrolls, getSalaryByUser, createOrUpdatePayroll, updatePayrollStatus } = require('../controllers/payrollController');
router.get('/payroll', getAllPayrolls);
router.get('/payroll/:userId', getSalaryByUser);
router.post('/payroll', createOrUpdatePayroll);
router.put('/payroll/:id', updatePayrollStatus);

module.exports = router;
