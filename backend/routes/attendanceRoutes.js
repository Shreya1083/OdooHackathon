const express = require('express');
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceByUser,
  getAllAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my', protect, getMyAttendance);
router.get('/user/:userId', protect, authorize('admin', 'hr'), getAttendanceByUser);
router.get('/all', protect, authorize('admin', 'hr'), getAllAttendance);

module.exports = router;
