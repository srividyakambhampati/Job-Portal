# Job Portal Application (MERN Stack)

A full-stack Job Portal application built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS (Bootstrap).

## Features
- **Authentication**: Role-based login/signup (Candidate, Employer, Admin).
- **Jobs**: View, Post, Edit, Delete jobs.
- **Applications**: Candidates can apply with resume uploads (PDF/DOC).
- **Dashboard**: 
  - Candidates: View application status.
  - Employers: Manage posted jobs and view applications.
  - Admin: Full access.

## Prerequisites
- Node.js installed.
- MongoDB installed and running locally on port 27017.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal in the root directory.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file (already created) with:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/jobportal
   JWT_SECRET=supersecretkey123
   ```
5. Seed the database (optional):
   ```bash
   npm run seed
   ```
6. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### 2. Frontend Setup
1. The frontend is static HTML/JS. You can open `frontend/index.html` directly in your browser.
2. For better experience (and strict CORS handling), serve it using a live server (like VS Code Live Server Extension) or `npx serve`.

## Usage
- **Admin**: admin@example.com / 123456
- **Employer**: employer@example.com / 123456
- **Candidate**: john@example.com / 123456

## Project Structure
- `backend/` - API Server & Database Models
- `frontend/` - User Interface
