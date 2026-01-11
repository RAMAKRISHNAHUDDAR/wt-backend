# University Course Registration System - Frontend

A React + Vite frontend application for the University Course Registration System.

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Plain CSS (no frameworks)

## Setup Instructions

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Backend Configuration

Make sure your backend server is running on `http://localhost:5000` (or update the proxy in `vite.config.js`).

## Features

- **Login Page**: Student authentication with SRN and password
- **Register Page**: New student registration with validation
- **Dashboard**: Overview with total courses and credits
- **Profile Page**: Display student information
- **Register Courses**: Manually add and register courses
- **My Courses**: View all registered courses

## Routes

- `/` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected)
- `/profile` - Student profile (protected)
- `/register-courses` - Course registration (protected)
- `/my-courses` - View registered courses (protected)

## API Integration

All API calls are handled through the `api.js` service which:
- Automatically adds JWT token from localStorage to requests
- Handles 401 errors by redirecting to login
- Uses the base URL `/api` (proxied to backend)
