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

router.get('/my', protect, getMySalary);
router.get('/user/:userId', protect, authorize('admin'), getSalaryByUser);
router.get('/all', protect, authorize('admin'), getAllPayrolls);
router.post('/create', protect, authorize('admin'), validatePayroll, createOrUpdatePayroll);
router.put('/:id', protect, authorize('admin'), updatePayrollStatus);

module.exports = router;