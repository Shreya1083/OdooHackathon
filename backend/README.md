# HRMS Backend - Complete API

A fully functional Human Resource Management System backend built with Node.js, Express, and MongoDB.

## Features

- Authentication System (JWT-based)
- Role-based access control (Admin/Employee)
- User Profile Management
- Attendance System (Check-in/Check-out)
- Leave Management with Approval Workflow
- Payroll System with Auto-calculations
- Admin Dashboard

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for Password Security

## Installation

1. Install dependencies: `npm install`
2. Create .env file with required variables
3. Start MongoDB
4. Run: `npm run dev`

Server runs on http://localhost:5000

## API Endpoints

See API_DOCUMENTATION.md for complete reference.

Base URL: http://localhost:5000/api

## Testing

1. Create admin account via POST /api/auth/signup
2. Login to get JWT token
3. Use token in Authorization header for protected routes