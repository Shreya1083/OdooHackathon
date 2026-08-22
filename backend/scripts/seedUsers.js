const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@hrms.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    phone: '+1-555-0100',
    address: '123 Admin Street, City, State',
    isActive: true
  },
  {
    name: 'HR Officer',
    email: 'hr@hrms.com',
    password: 'hr1234',
    role: 'hr',
    department: 'Human Resources',
    phone: '+1-555-0200',
    address: '456 HR Avenue, City, State',
    isActive: true
  },
  {
    name: 'Alice Johnson',
    email: 'alice@hrms.com',
    password: 'alice123',
    role: 'employee',
    department: 'Engineering',
    phone: '+1-555-0301',
    address: '789 Employee Lane, City, State',
    isActive: true
  },
  {
    name: 'Bob Smith',
    email: 'bob@hrms.com',
    password: 'bob1234',
    role: 'employee',
    department: 'Sales',
    phone: '+1-555-0302',
    address: '321 Sales Street, City, State',
    isActive: true
  },
  {
    name: 'Carol Davis',
    email: 'carol@hrms.com',
    password: 'carol123',
    role: 'employee',
    department: 'Marketing',
    phone: '+1-555-0303',
    address: '654 Marketing Blvd, City, State',
    isActive: true
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms_db');
    console.log('✅ MongoDB Connected');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create users
    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.email} (${user.role}) - Employee ID: ${user.employeeId}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@hrms.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 HR Officer:');
    console.log('   Email: hr@hrms.com');
    console.log('   Password: hr1234');
    console.log('');
    console.log('👤 Employee:');
    console.log('   Email: alice@hrms.com');
    console.log('   Password: alice123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
