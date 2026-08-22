const express = require('express');
const {
  getMySalary,
  getSalaryByUser,
  getAllPayrolls,
  createOrUpdatePayroll,
  updatePayrollStatus
} = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/auth');
const { validatePayroll } = require('../middleware/validate');

const router = express.Router();

// Employee routes
router.get('/my', protect, getMySalary);

// Admin/HR routes
router.get('/all', protect, authorize('admin', 'hr'), getAllPayrolls);
router.get('/user/:userId', protect, authorize('admin', 'hr'), getSalaryByUser);
router.post('/create', protect, authorize('admin', 'hr'), validatePayroll, createOrUpdatePayroll);
router.put('/:id', protect, authorize('admin', 'hr'), updatePayrollStatus);

module.exports = router;