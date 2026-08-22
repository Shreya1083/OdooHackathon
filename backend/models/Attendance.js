const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  },
  hours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'late'],
    default: 'present'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate hours when checkout is set
attendanceSchema.pre('save', function(next) {
  if (this.checkOut && this.checkIn) {
    const diff = this.checkOut.getTime() - this.checkIn.getTime();
    const hours = diff / (1000 * 60 * 60);
    this.hours = parseFloat(hours.toFixed(2));
  }
  next();
});

// Create compound index for user and date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
