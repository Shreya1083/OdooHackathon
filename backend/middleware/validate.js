// Validation middleware for various endpoints

// Validate email format
const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Auth validation
exports.validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  next();
};

// Leave validation
exports.validateLeave = (req, res, next) => {
  const { type, fromDate, toDate, reason } = req.body;

  if (!type || !fromDate || !toDate || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide type, fromDate, toDate, and reason'
    });
  }

  const validTypes = ['paid', 'sick', 'unpaid', 'casual'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Leave type must be one of: paid, sick, unpaid, casual'
    });
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format'
    });
  }

  if (from > to) {
    return res.status(400).json({
      success: false,
      message: 'From date cannot be after to date'
    });
  }

  next();
};

// Payroll validation
exports.validatePayroll = (req, res, next) => {
  const { userId, month, year, baseSalary } = req.body;

  if (!userId || !month || !year || baseSalary === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide userId, month, year, and baseSalary'
    });
  }

  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  if (monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      message: 'Month must be between 1 and 12'
    });
  }

  if (yearNum < 2000 || yearNum > 2100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid year'
    });
  }

  if (baseSalary < 0) {
    return res.status(400).json({
      success: false,
      message: 'Base salary cannot be negative'
    });
  }

  next();
};