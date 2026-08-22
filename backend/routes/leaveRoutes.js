const express = require('express');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');
const { validateLeave } = require('../middleware/validate');

const router = express.Router();

router.post('/apply', protect, validateLeave, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/all', protect, authorize('admin'), getAllLeaves);
router.put('/:id', protect, authorize('admin'), updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

module.exports = router;