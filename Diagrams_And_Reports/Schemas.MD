# Morshed API Schema Documentation

## Standard Response Format

All API endpoints follow a consistent response structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/register
**Public** - Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@university.edu",
  "universityId": "STD001",
  "password": "password123",
  "role": "student"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "universityId": "STD001",
    "email": "john@university.edu",
    "role": "student",
    "isActive": true,
    "name": "John Doe"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email or University ID already exists"
}
```

---

### POST /api/auth/login
**Public** - Authenticate a user.

**Request Body:**
```json
{
  "universityId": "STD001",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60f7...",
      "universityId": "STD001",
      "email": "john@university.edu",
      "role": "student",
      "name": "John Doe",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

> The `token` is an **Access Token** (JWT) valid for 15 minutes.  
> A **Refresh Token** is automatically set as an HttpOnly cookie.

---

### GET /api/auth/me
**Protected** - Get the currently authenticated user's profile.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60f7...",
      "universityId": "STD001",
      "email": "john@university.edu",
      "role": "student",
      "name": "John Doe",
      "isActive": true
    }
  }
}
```

---

### POST /api/auth/logout
**Protected** - Log out the current user (clears refresh token).

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /api/auth/forgot-password
**Public** - Generate a password reset token.

**Request Body:**
```json
{
  "email": "john@university.edu"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Reset token generated",
    "token": "a1b2c3..."
  }
}
```

> In development mode, the reset token is returned directly.  
> In production, this would be emailed to the user.

---

### POST /api/auth/reset-password
**Public** - Reset password using a valid token.

**Request Body:**
```json
{
  "token": "a1b2c3...",
  "newPassword": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successful"
  }
}
```

---

### POST /api/auth/change-password
**Protected** - Change password (requires current password).

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

## University Endpoints

### POST /api/departments
**Protected** - **Admin** - Create a new department.

**Request Body:**
```json
{
  "name": "Computer Science",
  "code": "CS"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "name": "Computer Science",
    "code": "CS"
  }
}
```

---

### GET /api/departments
**Protected** - Get all departments.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7...",
      "name": "Computer Science",
      "code": "CS"
    }
  ]
}
```

---

### POST /api/semesters
**Protected** - **Admin** - Create a new semester.

**Request Body:**
```json
{
  "name": "Fall 2024",
  "code": "F24",
  "registrationStatus": "open"
}
```

---

### GET /api/semesters
**Protected** - Get all semesters.

---

### GET /api/semesters/current
**Protected** - Get the current active semester.

---

### POST /api/courses
**Protected** - **Admin** - Create a new course.

**Request Body:**
```json
{
  "code": "CS101",
  "name": "Intro to Programming",
  "credits": 3,
  "departmentId": "60f7..."
}
```

---

### GET /api/courses/available
**Protected** - Get courses available for the current semester.

---

### POST /api/offerings
**Protected** - **Admin** - Create a course offering.

**Request Body:**
```json
{
  "courseId": "60f7...",
  "semesterId": "60f7...",
  "schedule": "Mon/Wed 10:00",
  "classroom": "Hall A",
  "capacity": 30
}
```

---

### GET /api/courses
**Protected** - Get all courses.

---

### GET /api/courses/:id
**Protected** - Get course by ID.

---

### GET /api/courses/:id/offerings
**Protected** - Get offerings for a specific course.

---

## Enrollment Endpoints

### POST /api/enrollments
**Protected** - **Student** - Enroll in a course.

**Request Body:**
```json
{
  "courseId": "60f7..."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "studentId": "60f7...",
    "courseId": "60f7...",
    "offeringId": "60f7...",
    "status": "enrolled",
    "grade": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### GET /api/enrollments/my
**Protected** - **Student** - Get current user's enrollments.

---

### DELETE /api/enrollments/:id
**Protected** - **Student** - Drop a course.

---

## Student Endpoints

### GET /api/students/dashboard
**Protected** - **Student** - Get dashboard data (GPA, counts, current courses).

### GET /api/students/profile
**Protected** - **Student** - Get student profile.

### PATCH /api/students/profile
**Protected** - **Student** - Update student profile.

### GET /api/students/settings
**Protected** - **Student** - Get student settings.

### PUT /api/students/settings
**Protected** - **Student** - Update student settings.

### GET /api/students/courses
**Protected** - **Student** - Get course catalog for current semester.

### GET /api/students/schedule
**Protected** - **Student** - Get class schedule.

### GET /api/students/grades
**Protected** - **Student** - Get grades.

### GET /api/students/payments
**Protected** - **Student** - Get payment history.

### GET /api/students/enrollments
**Protected** - **Student** - Get enrollments.

### GET /api/students/complaints
**Protected** - **Student** - Get complaints.

### GET /api/students/advising-sessions
**Protected** - **Student** - Get advising sessions.

### POST /api/students/advising-sessions
**Protected** - **Student** - Create an advising session.

### GET /api/students/notifications
**Protected** - **Student** - Get notifications.

### GET /api/students/attendance
**Protected** - **Student** - Get attendance records.

### GET /api/students/exams
**Protected** - **Student** - Get exam schedule.

### GET /api/students/transcript
**Protected** - **Student** - Get academic transcript.

### GET /api/students/study-plan
**Protected** - **Student** - Get study plan.

### POST /api/students/semester-registration
**Protected** - **Student** - Submit semester registration.

### POST /api/students/gpa-calculations
**Protected** - **Student** - Save GPA calculation.

---

## Professor Endpoints

### GET /api/professors/profile
**Protected** - **Professor** - Get professor profile.

### GET /api/professors/schedule
**Protected** - **Professor** - Get teaching schedule.

### GET /api/professors/offerings
**Protected** - **Professor** - Get assigned course offerings.

### GET /api/professors/offerings/:offeringId/students
**Protected** - **Professor** - Get students in an offering.

### GET /api/professors/offerings/:offeringId/assignments
**Protected** - **Professor** - Get assignments for an offering.

### POST /api/professors/assignments
**Protected** - **Professor** - Create an assignment.

### POST /api/professors/offerings/:offeringId/attendance
**Protected** - **Professor** - Mark attendance.

### GET /api/professors/offerings/:offeringId/attendance
**Protected** - **Professor** - Get attendance records.

### POST /api/professors/grades
**Protected** - **Professor** - Submit a grade.

---

## Advisor Endpoints

### GET /api/advisors/profile
**Protected** - **Advisor** - Get advisor profile.

### GET /api/advisors/dashboard
**Protected** - **Advisor** - Get advisor dashboard.

### GET /api/advisors/students
**Protected** - **Advisor** - Get advised students (paginated: ?page=1&limit=20).

### POST /api/advisors/sessions
**Protected** - **Advisor** - Create advising session.

### GET /api/advisors/sessions
**Protected** - **Advisor** - Get advising sessions.

### PATCH /api/advisors/sessions/:sessionId
**Protected** - **Advisor** - Update advising session.

### GET /api/advisors/student-progress/:studentId
**Protected** - **Advisor** - Get student progress.

### GET /api/advisors/graduation/:studentId
**Protected** - **Advisor** - Get graduation audit.

### GET /api/advisors/issues
**Protected** - **Advisor** - Get student issues (paginated).

### PATCH /api/advisors/issues/:issueId
**Protected** - **Advisor** - Update a complaint/issue.

---

## Admin Endpoints

### GET /api/admin/dashboard
**Protected** - **Admin** - Get admin dashboard.

### POST /api/admin/semesters
**Protected** - **Admin** - Create semester.

### POST /api/admin/courses
**Protected** - **Admin** - Create course.

### GET /api/admin/users
**Protected** - **Admin** - Get all users (paginated: ?page=1&limit=20&role=student).

### PATCH /api/admin/users/:id
**Protected** - **Admin** - Update a user.

### GET /api/admin/complaints
**Protected** - **Admin** - Get all complaints (paginated).

### PATCH /api/admin/complaints/:complaintId
**Protected** - **Admin** - Update a complaint.

### PATCH /api/admin/semesters/:id
**Protected** - **Admin** - Update a semester.

### POST /api/admin/semester-registration
**Protected** - **Admin** - Manual enrollment.

### GET /api/admin/settings
**Protected** - **Admin** - Get system settings.

### PUT /api/admin/settings
**Protected** - **Admin** - Update system settings.

---

## Complaint Endpoints

### POST /api/complaints
**Protected** - **Student** - Create a complaint.

**Request Body:**
```json
{
  "subject": "Schedule Conflict",
  "description": "My CS101 and MATH101 classes overlap."
}
```

---

### GET /api/complaints
**Protected** - **Student** - Get own complaints.

---

## Payment Endpoints

### POST /api/payments
**Protected** - **Student** - Make a payment.

**Request Body:**
```json
{
  "semesterId": "60f7...",
  "amount": 5000
}
```

---

### GET /api/payments
**Protected** - **Student** - Get payment history.

---

## Notification Endpoints

### PATCH /api/notifications/:notificationId/read
**Protected** - Mark a notification as read.

---

## Health Check

### GET /api/health
**Public** - API health check.

**Success Response (200):**
```json
{
  "status": "ok",
  "message": "Morshed API is running!"
}
```

---

## Authentication Flow

### Dual Token Strategy

1. **Access Token** (JWT)
   - Short-lived: 15 minutes
   - Sent in `Authorization: Bearer <token>` header
   - Contains: `{ id, role }`
   - Used to access protected routes

2. **Refresh Token**
   - Long-lived: 7 days
   - Stored as HttpOnly cookie (`refreshToken`)
   - Automatically sent with `withCredentials: true`

### Registration Flow

```
Frontend                    Backend
   |                           |
   |-- POST /api/auth/register -->|
   |                           |-- Check for existing user
   |                           |-- Start MongoDB transaction
   |                           |-- Create User document
   |                           |-- Create Role Profile (Student/Professor/Advisor)
   |                           |-- Commit transaction
   |<-- { success, data } ------|
   |                           |
   |-- Redirect to /login ----->|
```

### Login Flow

```
Frontend                    Backend
   |                           |
   |-- POST /api/auth/login ---->|
   |                           |-- Find user by universityId
   |                           |-- Compare password (bcrypt)
   |                           |-- Generate Access Token + Refresh Token
   |                           |-- Save Refresh Token to DB
   |                           |-- Set Refresh Token as HttpOnly cookie
   |<-- { success, data: { user, token } } --|
   |                           |
   |-- Store Access Token -----> (in memory)
   |-- Subsequent API calls --->| Authorization: Bearer <token>
```

---

## Data Transfer Objects (DTOs)

DTOs transform raw Mongoose documents into the API response format. They ensure the API contract is decoupled from the database schema.

### Auth DTO (`authDTO.js`)
- `userToResponseDTO(user)` → `{ _id, universityId, email, role, name, isActive }`
- `loginResponseDTO(user, accessToken)` → `{ user: {...}, token: "..." }`

### Enrollment DTO (`enrollmentDTO.js`)
- `enrollmentToResponseDTO(enrollment)` → `{ _id, studentId, courseId, offeringId, status, grade, createdAt }`

### Student DTO (`studentDTO.js`)
- `studentProfileToResponseDTO(student)` → `{ _id, userId, departmentId, advisorId, GPA, level, program }`

### Payment DTO (`paymentDTO.js`)
- `paymentToResponseDTO(payment)` → `{ _id, studentId, semesterId, amount, status, createdAt }`
