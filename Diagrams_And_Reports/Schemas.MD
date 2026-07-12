# Morshed API Schema Documentation

> **Validation**: All request bodies are validated server-side using **Zod** schemas.  
> The frontend also uses Zod for client-side validation (shared schemas in `FrontEndLayer/src/Schemas/`).

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

## Authentication Endpoints (`/api/auth`)

### POST /api/auth/register
**Public** - Create a new user account.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | yes | min 1 |
| `email` | string (email) | yes | valid email format |
| `universityId` | string | yes | min 1 |
| `password` | string | yes | min 6 |
| `role` | enum | yes | `"student"` \| `"professor"` \| `"advisor"` \| `"admin"` |

**Zod Schema:**
```javascript
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  universityId: z.string().min(1, "University ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "professor", "advisor"]), // "admin" is NOT allowed via registration
});
```

**Success (201):**
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

**Error (400):** `{ "success": false, "message": "User with this email or University ID already exists" }`

---

### POST /api/auth/login
**Public** - Authenticate a user and return JWT tokens.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `universityId` | string | yes | min 1 |
| `password` | string | yes | min 6 |

**Zod Schema:**
```javascript
const loginSchema = z.object({
  universityId: z.string({ required_error: "University ID is required" }),
  password: z.string({ required_error: "Password is required" }).min(6),
});
```

**Success (200):**
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

> Token is a JWT Access Token (15min expiry). Refresh Token is set as HttpOnly cookie (7d).

**Error (401):** `{ "success": false, "message": "Invalid credentials" }`

---

### GET /api/auth/me
**Protected** - Get the currently authenticated user's profile.

**Success (200):**
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
**Protected** - Clear the refresh token and log out.

**Success (200):** `{ "success": true, "message": "Logged out successfully" }`

---

### POST /api/auth/forgot-password
**Public** - Generate a password reset token.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `email` | string (email) | yes | valid email |

**Zod Schema:**
```javascript
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});
```

**Success (200):**
```json
{
  "success": true,
  "data": {
    "message": "Reset token generated",
    "token": "a1b2c3..."
  }
}
```

> In dev mode, the token is returned directly. In production, it would be emailed.

---

### POST /api/auth/reset-password
**Public** - Reset password using a valid token.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `token` | string | yes | min 1 |
| `newPassword` | string | yes | min 6 |

**Zod Schema:**
```javascript
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
```

**Success (200):** `{ "success": true, "data": { "message": "Password reset successful" } }`

---

### POST /api/auth/change-password
**Protected** - Change password (requires current password).

| Field | Type | Required | Constraints |
|---|---|---|---|
| `currentPassword` | string | yes | min 6 |
| `newPassword` | string | yes | min 6 |
| `confirmPassword` | string | yes | min 6, must match `newPassword` |

**Zod Schema:**
```javascript
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

**Success (200):** `{ "success": true, "data": { "message": "Password changed successfully" } }`

---

## University Structure Endpoints

### POST /api/departments
**Protected** - **Admin** - Create a new department.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | yes | min 1 |
| `code` | string | yes | max 10 |

**Zod Schema:**
```javascript
const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().max(10, "Code must be at most 10 characters"),
});
```

**Success (201):**
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

**Success (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "60f7...", "name": "Computer Science", "code": "CS" }
  ]
}
```

---

### POST /api/semesters
**Protected** - **Admin** - Create a new semester.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | yes | min 1 |
| `code` | string | yes | max 10 |
| `registrationStatus` | enum | no | `"upcoming"` \| `"open"` \| `"closed"` \| `"ongoing"` \| `"ended"` |
| `startDate` | string | no | ISO date |
| `endDate` | string | no | ISO date |

**Zod Schema:**
```javascript
const semesterSchema = z.object({
  name: z.string().min(1, "Semester name is required"),
  code: z.string().max(10, "Code must be at most 10 characters"),
  registrationStatus: z.enum(["upcoming", "open", "closed", "ongoing", "ended"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
```

**Success (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "name": "Fall 2024",
    "code": "F24",
    "registrationStatus": "open"
  }
}
```

---

### GET /api/semesters
**Protected** - Get all semesters.

**Success (200):** Array of semester objects.

---

### GET /api/semesters/current
**Protected** - Get the current active semester (where `registrationStatus` is `"open"` or `"ongoing"`).

**Success (200):** Single semester object or error if none active.

---

### POST /api/courses
**Protected** - **Admin** - Create a new course (mounted at `/api`).

| Field | Type | Required | Constraints |
|---|---|---|---|
| `code` | string | yes | min 1 |
| `name` | string | yes | min 1 |
| `credits` | number (int) | yes | 1–6 |
| `departmentId` | string | yes | MongoDB ObjectId |

**Zod Schema:**
```javascript
const courseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  name: z.string().min(1, "Course name is required"),
  credits: z.number().int("Credits must be an integer").min(1).max(6),
  departmentId: z.string().min(1, "Department ID is required"),
});
```

**Success (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "code": "CS101",
    "name": "Intro to Programming",
    "credits": 3,
    "departmentId": "60f7..."
  }
}
```

---

### GET /api/courses/available
**Protected** - Get courses that have offerings in the current semester.

---

### POST /api/offerings
**Protected** - **Admin** - Create a course offering (section).

| Field | Type | Required | Constraints |
|---|---|---|---|
| `courseId` | string | yes | MongoDB ObjectId |
| `semesterId` | string | yes | MongoDB ObjectId |
| `professorId` | string | no | MongoDB ObjectId |
| `schedule` | string | no | e.g. "Mon/Wed 10:00" |
| `classroom` | string | no | e.g. "Hall A" |
| `capacity` | number (int) | no | positive, default 30 |

**Zod Schema:**
```javascript
const courseOfferingSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  semesterId: z.string().min(1, "Semester ID is required"),
  professorId: z.string().optional(),
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  capacity: z.number().int("Capacity must be an integer").positive("Capacity must be positive").optional(),
});
```

**Success (201):** `{ "success": true, "data": <offering> }`

---

## Course Endpoints (`/api/courses`)

### GET /api/courses
**Protected** - Get all courses.

**Success (200):** Array of course objects.

---

### GET /api/courses/:id
**Protected** - Get course by ID.

**Success (200):** Single course object.

---

### GET /api/courses/:id/offerings
**Protected** - Get offerings for a specific course (includes professor, schedule, capacity, enrolled count).

**Success (200):** Array of offering objects.

---

## Enrollment Endpoints (`/api/enrollments`)

### POST /api/enrollments
**Protected** - **Student** - Enroll in a course.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `courseId` | string | yes | MongoDB ObjectId |

**Zod Schema:**
```javascript
const enrollmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});
```

**Success (201):**
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

**Success (200):** Array of enrollment objects (populated with course and offering data).

---

### DELETE /api/enrollments/:id
**Protected** - **Student** - Drop a course (marks enrollment as `"dropped"`).

**Success (200):** Updated enrollment object.

---

## Student Endpoints (`/api/students`)

All routes are **Protected** - **Student** only.

### GET /api/students/dashboard
Get dashboard summary (GPA, current semester info, enrolled count, pending payments, open complaints, GPA trend, current courses with progress).

---

### GET /api/students/profile
Get student profile.

**Success (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "userId": "60f7...",
    "departmentId": "60f7...",
    "advisorId": "60f7...",
    "GPA": 3.5,
    "level": 2,
    "program": "Computer Science"
  }
}
```

---

### PATCH /api/students/profile
Update student profile. Accepts partial update of any profile fields.

---

### GET /api/students/settings
Get student settings (showGpa, preferredLanguage, etc.).

---

### PUT /api/students/settings
Update student settings.

---

### GET /api/students/courses
Get course catalog for current semester.

---

### GET /api/students/schedule
Get class schedule for enrolled courses.

---

### GET /api/students/grades
Get grades for enrolled courses.

---

### GET /api/students/payments
Get payment history.

---

### GET /api/students/enrollments
Get enrollments (convenience alias for `/api/enrollments/my`).

---

### GET /api/students/complaints
Get own complaints (convenience alias for `/api/complaints` via student controller).

---

### GET /api/students/advising-sessions
Get advising sessions.

---

### POST /api/students/advising-sessions
Create a new advising session request.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `semesterId` | string | yes | MongoDB ObjectId |
| `notes` | string | no | free text |

**Zod Schema:**
```javascript
const createAdvisingSessionStudentSchema = z.object({
  semesterId: z.string().min(1, "Semester ID is required"),
  notes: z.string().optional(),
});
```

**Success (201):** Created session object.

---

### GET /api/students/notifications
Get all notifications for the student.

---

### GET /api/students/attendance
Get attendance summary per course.

---

### GET /api/students/exams
Get exam schedule.

---

### GET /api/students/transcript
Get full academic transcript.

---

### GET /api/students/study-plan
Get degree study plan.

---

### POST /api/students/semester-registration
Submit semester registration.

---

### POST /api/students/gpa-calculations
Save GPA calculation result.

---

## Complaint Endpoints (`/api/complaints`)

### POST /api/complaints
**Protected** - **Student** - Create a complaint.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `subject` | string | yes | min 1, max 200 |
| `description` | string | yes | min 10, max 2000 |

**Zod Schema:**
```javascript
const complaintSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
});
```

**Success (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "studentId": "60f7...",
    "adminId": null,
    "subject": "Schedule Conflict",
    "description": "My classes overlap.",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### GET /api/complaints
**Protected** - **Student** - Get own complaints.

**Success (200):** Array of complaint objects.

---

## Payment Endpoints (`/api/payments`)

### POST /api/payments
**Protected** - **Student** - Make a payment.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `semesterId` | string | yes | MongoDB ObjectId |
| `amount` | number | yes | positive |

**Zod Schema:**
```javascript
const paymentSchema = z.object({
  semesterId: z.string().min(1, "Semester ID is required"),
  amount: z.number().positive("Amount must be positive"),
});
```

**Success (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7...",
    "studentId": "60f7...",
    "semesterId": "60f7...",
    "amount": 5000,
    "status": "paid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### GET /api/payments
**Protected** - **Student** - Get payment history.

**Success (200):** Array of payment objects.

---

## Notification Endpoints (`/api/notifications`)

### PATCH /api/notifications/:notificationId/read
**Protected** - Mark a notification as read.

| Parameter | Type | Location |
|---|---|---|
| `notificationId` | string (MongoDB ID) | URL path |

**Success (200):** Updated notification object.

---

## Professor Endpoints (`/api/professors`)

All routes are **Protected** - **Professor** only.

### GET /api/professors/profile
Get professor profile.

---

### PATCH /api/professors/profile
Update professor profile.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | no | free text |

**Zod Schema:**
```javascript
const updateProfileSchema = z.object({
  title: z.string().optional(),
});
```

**Success (200):** Updated professor profile object.

---

### GET /api/professors/notifications
Get professor notifications.

**Success (200):** Array of notification objects.

---

### GET /api/professors/schedule
Get teaching schedule for current semester.

---

### GET /api/professors/offerings
Get assigned course offerings.

---

### GET /api/professors/offerings/:offeringId/students
Get students enrolled in a specific offering.

---

### GET /api/professors/offerings/:offeringId/assignments
Get assignments for a specific offering.

---

### POST /api/professors/assignments
Create a new assignment.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `offeringId` | string | yes | MongoDB ObjectId |
| `title` | string | yes | max 200 |
| `dueDate` | string | yes | ISO datetime |
| `maxScore` | number (int) | yes | >= 1 |

**Zod Schema:**
```javascript
const assignmentSchema = z.object({
  offeringId: z.string().min(1, "Offering ID is required"),
  title: z.string().min(1, "Title is required").max(200),
  dueDate: z.string().min(1, "Due date is required"),
  maxScore: z.number().int("Max score must be an integer").min(1),
});
```

**Success (201):** Created assignment object.

---

### POST /api/professors/offerings/:offeringId/attendance
Mark attendance for a specific offering and date.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `date` | string | yes | ISO date |
| `records` | array | yes | non-empty array of attendance records |
| `records[].studentId` | string | yes | MongoDB ObjectId |
| `records[].status` | enum | yes | `"present"` \| `"absent"` \| `"late"` |

**Zod Schema:**
```javascript
const attendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  records: z.array(z.object({
    studentId: z.string().min(1),
    status: z.enum(["present", "absent", "late"]),
  })).nonempty("At least one attendance record is required"),
});
```

**Success (200):** Created/updated attendance records.

---

### GET /api/professors/offerings/:offeringId/attendance
Get attendance history for a specific offering.

---

### POST /api/professors/grades
Submit a grade for a student enrollment.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `enrollmentId` | string | yes | MongoDB ObjectId |
| `grade` | string | yes | letter grade |

**Zod Schema:**
```javascript
const gradeSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment ID is required"),
  grade: z.string().min(1, "Grade is required"),
});
```

**Success (200):** Updated enrollment object with grade.

---

## Advisor Endpoints (`/api/advisors`)

All routes are **Protected** - **Advisor** only.

### GET /api/advisors/profile
Get advisor profile.

---

### PATCH /api/advisors/profile
Update advisor profile.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | no | free text |

**Zod Schema:**
```javascript
const updateProfileSchema = z.object({
  title: z.string().optional(),
});
```

**Success (200):** Updated advisor profile object.

---

### GET /api/advisors/dashboard
Get advisor dashboard (total advisees, at-risk students, completion rates, today's sessions, alerts).

| Query Param | Type | Default |
|---|---|---|
| (none) | | |

---

### GET /api/advisors/students
Get advised students (paginated).

| Query Param | Type | Default |
|---|---|---|
| `page` | int | 1 |
| `limit` | int | 20 |

**Success (200):** Paginated array of student objects.

---

### POST /api/advisors/sessions
Create a new advising session.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `studentId` | string | yes | MongoDB ObjectId |
| `semesterId` | string | yes | MongoDB ObjectId |
| `notes` | string | no | free text |

**Zod Schema:**
```javascript
const createAdvisingSessionSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  semesterId: z.string().min(1, "Semester ID is required"),
  notes: z.string().optional(),
});
```

**Success (201):** Created session object.

---

### GET /api/advisors/sessions
Get advising sessions (optional query filters).

| Query Param | Type | Description |
|---|---|---|
| `studentId` | string | Filter by student |

---

### PATCH /api/advisors/sessions/:sessionId
Update an advising session.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `status` | enum | no | `"scheduled"` \| `"completed"` \| `"cancelled"` \| `"pending"` |
| `notes` | string | no | free text |

**Zod Schema:**
```javascript
const updateAdvisingSessionSchema = z.object({
  notes: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled", "pending"]).optional(),
});
```

**Success (200):** Updated session object.

---

### GET /api/advisors/student-progress/:studentId
Get student progress (enrollments, grades, attendance).

---

### GET /api/advisors/graduation/:studentId
Get graduation audit (compares completed courses against department requirements).

---

### GET /api/advisors/issues
Get student issues/complaints (paginated).

| Query Param | Type | Default |
|---|---|---|
| `page` | int | 1 |
| `limit` | int | 20 |

---

### PATCH /api/advisors/issues/:issueId
Update a complaint/issue status.

Accepts partial update of complaint fields (status, adminId, etc.).

**Success (200):** Updated complaint object.

---

## Admin Endpoints (`/api/admin`)

All routes are **Protected** - **Admin** only.

### GET /api/admin/dashboard
Get admin dashboard (user counts by role, open complaints count).

---

### POST /api/admin/semesters
**Admin** - Create a new semester (alternative to `/api/semesters`).

Same schema as `POST /api/semesters` above.

**Zod Schema:** `semesterSchema`

---

### POST /api/admin/courses
**Admin** - Create a new course (alternative to `/api/courses`).

Same schema as `POST /api/courses` above.

**Zod Schema:** `courseSchema`

---

### GET /api/admin/users
Get all users (paginated with optional role filter).

| Query Param | Type | Default |
|---|---|---|
| `page` | int | 1 |
| `limit` | int | 20 |
| `role` | enum | (all) `"student"` \| `"professor"` \| `"advisor"` \| `"admin"` |

---

### PATCH /api/admin/users/:id
Update a user's role or active status.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `role` | enum | no | `"student"` \| `"professor"` \| `"advisor"` \| `"admin"` |
| `isActive` | boolean | no | |

**Zod Schema:**
```javascript
const updateUserSchema = z.object({
  role: z.enum(["student", "professor", "advisor", "admin"]).optional(),
  isActive: z.boolean().optional(),
});
```

> Admin cannot change their own role.

---

### GET /api/admin/complaints
Get all complaints (paginated).

| Query Param | Type | Default |
|---|---|---|
| `page` | int | 1 |
| `limit` | int | 20 |

---

### PATCH /api/admin/complaints/:complaintId
Update a complaint (status, assign admin).

| Field | Type | Required | Constraints |
|---|---|---|---|
| `status` | enum | no | `"pending"` \| `"in_progress"` \| `"resolved"` \| `"rejected"` |
| `adminId` | string | no | MongoDB ObjectId |

**Zod Schema:**
```javascript
const updateComplaintSchema = z.object({
  status: z.enum(["pending", "in_progress", "resolved", "rejected"]).optional(),
  adminId: z.string().optional(),
});
```

---

### PATCH /api/admin/semesters/:id
Update a semester's registration status.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `registrationStatus` | enum | no | `"upcoming"` \| `"open"` \| `"closed"` \| `"ongoing"` \| `"ended"` |

**Zod Schema:**
```javascript
const updateSemesterSchema = z.object({
  registrationStatus: z.enum(["upcoming", "open", "closed", "ongoing", "ended"]).optional(),
});
```

---

### POST /api/admin/semester-registration
Manually enroll a student in a course offering (bypasses capacity limits).

| Field | Type | Required | Constraints |
|---|---|---|---|
| `studentUserId` | string | yes | User MongoDB ObjectId (not Student profile ID) |
| `offeringId` | string | yes | CourseOffering MongoDB ObjectId |

**Zod Schema:**
```javascript
const manualEnrollSchema = z.object({
  studentUserId: z.string().min(1, "Student User ID is required"),
  offeringId: z.string().min(1, "Offering ID is required"),
});
```

**Success (201):** Created enrollment object.

---

### GET /api/admin/settings
Get system settings.

---

### PUT /api/admin/settings
Update system settings.

**Zod Schema:** `updateSettingsSchema` — passthrough object (accepts any JSON).

```javascript
const updateSettingsSchema = z.object({}).passthrough();
```

---

## Health Check

### GET /api/health
**Public** - API health check.

**Success (200):**
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

---

## Complete Endpoint Index (80 Endpoints)

| # | Method | Path | Auth | Role |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Public | - |
| 2 | POST | `/api/auth/login` | Public | - |
| 3 | POST | `/api/auth/forgot-password` | Public | - |
| 4 | POST | `/api/auth/reset-password` | Public | - |
| 5 | GET | `/api/auth/me` | Protect | Any |
| 6 | POST | `/api/auth/logout` | Protect | Any |
| 7 | POST | `/api/auth/change-password` | Protect | Any |
| 8 | POST | `/api/departments` | Protect | Admin |
| 9 | GET | `/api/departments` | Protect | Any |
| 10 | POST | `/api/semesters` | Protect | Admin |
| 11 | GET | `/api/semesters` | Protect | Any |
| 12 | GET | `/api/semesters/current` | Protect | Any |
| 13 | POST | `/api/courses` | Protect | Admin |
| 14 | GET | `/api/courses/available` | Protect | Any |
| 15 | POST | `/api/offerings` | Protect | Admin |
| 16 | GET | `/api/courses` | Protect | Any |
| 17 | GET | `/api/courses/:id` | Protect | Any |
| 18 | GET | `/api/courses/:id/offerings` | Protect | Any |
| 19 | PATCH | `/api/notifications/:notificationId/read` | Protect | Any |
| 20 | POST | `/api/enrollments` | Protect | Student |
| 21 | GET | `/api/enrollments/my` | Protect | Student |
| 22 | DELETE | `/api/enrollments/:id` | Protect | Student |
| 23 | GET | `/api/students/dashboard` | Protect | Student |
| 24 | GET | `/api/students/profile` | Protect | Student |
| 25 | PATCH | `/api/students/profile` | Protect | Student |
| 26 | GET | `/api/students/settings` | Protect | Student |
| 27 | PUT | `/api/students/settings` | Protect | Student |
| 28 | GET | `/api/students/courses` | Protect | Student |
| 29 | GET | `/api/students/schedule` | Protect | Student |
| 30 | GET | `/api/students/grades` | Protect | Student |
| 31 | GET | `/api/students/payments` | Protect | Student |
| 32 | GET | `/api/students/enrollments` | Protect | Student |
| 33 | GET | `/api/students/complaints` | Protect | Student |
| 34 | GET | `/api/students/advising-sessions` | Protect | Student |
| 35 | POST | `/api/students/advising-sessions` | Protect | Student |
| 36 | GET | `/api/students/notifications` | Protect | Student |
| 37 | GET | `/api/students/attendance` | Protect | Student |
| 38 | GET | `/api/students/exams` | Protect | Student |
| 39 | GET | `/api/students/transcript` | Protect | Student |
| 40 | GET | `/api/students/study-plan` | Protect | Student |
| 41 | POST | `/api/students/semester-registration` | Protect | Student |
| 42 | POST | `/api/students/gpa-calculations` | Protect | Student |
| 43 | POST | `/api/complaints` | Protect | Student |
| 44 | GET | `/api/complaints` | Protect | Student |
| 45 | POST | `/api/payments` | Protect | Student |
| 46 | GET | `/api/payments` | Protect | Student |
| 47 | GET | `/api/professors/profile` | Protect | Professor |
| 48 | PATCH | `/api/professors/profile` | Protect | Professor |
| 49 | GET | `/api/professors/notifications` | Protect | Professor |
| 50 | GET | `/api/professors/schedule` | Protect | Professor |
| 51 | GET | `/api/professors/offerings` | Protect | Professor |
| 52 | GET | `/api/professors/offerings/:offeringId/students` | Protect | Professor |
| 53 | GET | `/api/professors/offerings/:offeringId/assignments` | Protect | Professor |
| 54 | POST | `/api/professors/assignments` | Protect | Professor |
| 55 | POST | `/api/professors/offerings/:offeringId/attendance` | Protect | Professor |
| 56 | GET | `/api/professors/offerings/:offeringId/attendance` | Protect | Professor |
| 57 | POST | `/api/professors/grades` | Protect | Professor |
| 58 | GET | `/api/advisors/profile` | Protect | Advisor |
| 59 | PATCH | `/api/advisors/profile` | Protect | Advisor |
| 60 | GET | `/api/advisors/dashboard` | Protect | Advisor |
| 61 | GET | `/api/advisors/students` | Protect | Advisor |
| 62 | POST | `/api/advisors/sessions` | Protect | Advisor |
| 63 | GET | `/api/advisors/sessions` | Protect | Advisor |
| 64 | PATCH | `/api/advisors/sessions/:sessionId` | Protect | Advisor |
| 65 | GET | `/api/advisors/student-progress/:studentId` | Protect | Advisor |
| 66 | GET | `/api/advisors/graduation/:studentId` | Protect | Advisor |
| 67 | GET | `/api/advisors/issues` | Protect | Advisor |
| 68 | PATCH | `/api/advisors/issues/:issueId` | Protect | Advisor |
| 69 | GET | `/api/admin/dashboard` | Protect | Admin |
| 70 | POST | `/api/admin/semesters` | Protect | Admin |
| 71 | POST | `/api/admin/courses` | Protect | Admin |
| 72 | GET | `/api/admin/users` | Protect | Admin |
| 73 | PATCH | `/api/admin/users/:id` | Protect | Admin |
| 74 | GET | `/api/admin/complaints` | Protect | Admin |
| 75 | PATCH | `/api/admin/complaints/:complaintId` | Protect | Admin |
| 76 | PATCH | `/api/admin/semesters/:id` | Protect | Admin |
| 77 | POST | `/api/admin/semester-registration` | Protect | Admin |
| 78 | GET | `/api/admin/settings` | Protect | Admin |
| 79 | PUT | `/api/admin/settings` | Protect | Admin |
| 80 | GET | `/api/health` | Public | - |
