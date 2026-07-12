# Morshed University Platform — Integration Plan

## Project Overview

The Morshed University Platform is a full-stack academic management system with role-based access for **Students**, **Professors**, **Advisors**, and **Admins**. The backend is built with **Express.js + MongoDB (Mongoose)** and the frontend with **React 18 + Redux Toolkit + Axios**.

## Postman Collection

The complete API collection is located at:

```
BackEndLayer/Morshed.postman_collection.json
```

Import this file into Postman. Create an environment with:

| Variable | Value |
|---|---|
| `baseUrl` | `http://localhost:5000/api` |

The collection uses the `{{token}}` variable automatically. Log in via the **Auth > Login** endpoint — the test script auto-saves the token.

---

## API Base URL

```
http://localhost:5000/api
```

**Health Check:** `GET /api/health` → `{ status: "ok", message: "Morshed API is running!" }`

---

## Authentication

All endpoints except **register**, **login**, **forgot-password**, and **reset-password** require a Bearer JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

- **Access Token:** Expires in 15 minutes
- **Refresh Token:** Sent as httpOnly cookie, expires in 7 days
- **Login Response:** Returns `{ success: true, data: { accessToken, user } }`

### Rate Limiting

Auth routes (`/api/auth/*`) are limited to **10 requests per 15 minutes per IP**.

---

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

## Complete Endpoint Reference

### 1. Authentication (Public + Any Role)

| Method | Endpoint | Auth | Validation | Description |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ name, email, universityId, password, role }` | Register new user |
| POST | `/auth/login` | No | `{ universityId, password }` | Login, returns accessToken + sets refresh cookie |
| POST | `/auth/forgot-password` | No | `{ email }` | Sends reset token |
| POST | `/auth/reset-password` | No | `{ token, newPassword }` | Reset password with token |
| GET | `/auth/me` | Yes (any) | — | Get current authenticated user |
| POST | `/auth/logout` | Yes (any) | — | Logout, clears refresh cookie |
| POST | `/auth/change-password` | Yes (any) | `{ currentPassword, newPassword, confirmPassword }` | Change password while logged in |

---

### 2. Student Endpoints (Role: `student`)

All require `Authorization: Bearer <token>` and the user must have role `student`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students/dashboard` | GPA, counts, current courses, `courseProgress[]` |
| GET | `/students/profile` | Full profile with department name |
| PATCH | `/students/profile` | Update program, etc. |
| GET | `/students/settings` | `{ showGpa, preferredLanguage }` |
| PUT | `/students/settings` | Update settings |
| GET | `/students/courses` | Available course offerings for current semester |
| GET | `/students/schedule` | Parsed timetable: `[{ day, start, end, code, name, room, professor }]` |
| GET | `/students/grades` | `{ GPA, grades: [{ courseCode, courseName, credits, grade }] }` |
| GET | `/students/payments` | Payment history with `semesterName` |
| GET | `/students/enrollments` | Enrolled courses (alias for `/enrollments/my`) |
| GET | `/students/complaints` | My complaints (alias for `/complaints`) |
| GET | `/students/advising-sessions` | My advising sessions |
| POST | `/students/advising-sessions` | Create advising session `{ semesterId, notes? }` |
| GET | `/students/notifications` | All notifications |
| GET | `/students/attendance` | Attendance summary per course: `{ courses: [{ code, name, attended, total, percent }] }` |
| GET | `/students/exams` | Exam schedule: `[{ courseCode, courseName, date, startTime, endTime, room }]` |
| GET | `/students/transcript` | Full transcript grouped by semester: `{ semesters: [{ name, courses }] }` |
| GET | `/students/study-plan` | Degree study plan: `{ degreeName, totalRequired, years: [{ year, semesters: [{ name, courses }] }] }` |
| POST | `/students/semester-registration` | Submit semester registration |
| POST | `/students/gpa-calculations` | Save GPA calculation result |

**Additional student endpoints (non-/students paths):**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/enrollments` | Enroll in course `{ courseId }` |
| GET | `/enrollments/my` | My enrollments |
| DELETE | `/enrollments/:enrollmentId` | Drop a course |
| POST | `/complaints` | Submit complaint `{ subject, description }` |
| GET | `/complaints` | My complaints |
| POST | `/payments` | Make payment `{ semesterId, amount }` |
| GET | `/payments` | My payments |
| PATCH | `/notifications/:notificationId/read` | Mark notification as read |

---

### 3. Professor Endpoints (Role: `professor`)

All require `Authorization: Bearer <token>` and the user must have role `professor`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/professors/profile` | Full profile |
| GET | `/professors/schedule` | Weekly schedule |
| GET | `/professors/offerings` | My course offerings |
| GET | `/professors/offerings/:offeringId/students` | Enrolled students with grades |
| GET | `/professors/offerings/:offeringId/assignments` | Assignments for an offering |
| POST | `/professors/assignments` | Create assignment `{ offeringId, title, dueDate, maxScore }` |
| GET | `/professors/offerings/:offeringId/attendance` | Attendance records |
| POST | `/professors/offerings/:offeringId/attendance` | Mark attendance `{ date, records: [{ studentId, status }] }` |
| POST | `/professors/grades` | Submit grade `{ enrollmentId, grade }` |

---

### 4. Advisor Endpoints (Role: `advisor`)

All require `Authorization: Bearer <token>` and the user must have role `advisor`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/advisors/profile` | Full profile |
| GET | `/advisors/dashboard` | Stats (totalAdvisees, atRiskAdvisees) |
| GET | `/advisors/students` | Assigned students (supports `?page=&limit=`) |
| POST | `/advisors/sessions` | Create session `{ studentId, semesterId, notes? }` |
| GET | `/advisors/sessions` | Sessions (supports `?studentId=`) |
| PATCH | `/advisors/sessions/:sessionId` | Update session `{ notes?, status? }` |
| GET | `/advisors/student-progress/:studentId` | Student progress with enrollments + attendance |
| GET | `/advisors/graduation/:studentId` | Graduation audit with completion % |
| GET | `/advisors/issues` | Student complaints (supports `?page=&limit=`) |
| PATCH | `/advisors/issues/:issueId` | Update complaint status |

---

### 5. Admin Endpoints (Role: `admin`)

All require `Authorization: Bearer <token>` and the user must have role `admin`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | User counts by role + open complaints |
| GET | `/admin/users` | Paginated user list (`?page=&limit=&role=`) |
| PATCH | `/admin/users/:userId` | Update `{ isActive?, role? }` |
| GET | `/admin/complaints` | All complaints (`?page=&limit=`) |
| PATCH | `/admin/complaints/:complaintId` | Update `{ status?, adminId? }` |
| PATCH | `/admin/semesters/:semesterId` | Update `{ registrationStatus? }` |
| POST | `/admin/semesters` | Create semester `{ name, code, startDate?, endDate? }` |
| POST | `/admin/courses` | Create course `{ code, name, credits, departmentId }` |
| POST | `/admin/semester-registration` | Manual enroll `{ studentUserId, offeringId }` |
| GET | `/admin/settings` | Get system settings (key-value) |
| PUT | `/admin/settings` | Update settings (any JSON) |

---

### 6. Shared / University Endpoints (Any Authenticated Role)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/departments` | All departments |
| GET | `/semesters` | All semesters |
| GET | `/semesters/current` | Current active semester |
| GET | `/courses/available` | All courses with department info |
| GET | `/courses` | All courses (same as available) |
| GET | `/courses/:courseId` | Course detail |
| GET | `/courses/:courseId/offerings` | Offerings with professor, schedule, capacity, seats |

**Admin-only creation endpoints (via university routes):**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/departments` | Create department |
| POST | `/semesters` | Create semester |
| POST | `/courses` | Create course |
| POST | `/offerings` | Create course offering |

---

## Key Request/Response Shapes

### Dashboard Response
```json
{
  "student": { "GPA": 3.5, "level": 2, "departmentName": "Computer Science" },
  "currentSemester": { "name": "Fall 2024", "registrationStatus": "open" },
  "enrolledCourses": 5,
  "pendingPayments": 1,
  "openComplaints": 0,
  "currentCourses": [
    { "code": "CS101", "name": "Intro to Programming", "credits": 3, "grade": "A" }
  ],
  "gpaTrend": [],
  "courseProgress": [
    { "code": "CS101", "name": "Intro to Programming", "percent": 100, "grade": "A" }
  ]
}
```

### Schedule Response
```json
[
  { "day": "Monday", "start": "10:00", "end": "11:30", "code": "CS101", "name": "Intro to Programming", "room": "Hall A", "professor": "Dr. Smith" },
  { "day": "Wednesday", "start": "10:00", "end": "11:30", "code": "CS101", "name": "Intro to Programming", "room": "Hall A", "professor": "Dr. Smith" }
]
```

### Enroll Request
```json
{ "courseId": "64a1b2c3d4e5f6a7b8c9d0e1" }
```

---

## Frontend Setup

1. Copy `FrontEndLayer/.env.example` → `FrontEndLayer/.env`
2. Set `VITE_API_URL=http://localhost:5000/api`
3. Set `VITE_USE_DUMMY_DATA=false` (set to `true` for standalone frontend development)
4. Run: `npm install && npm run dev`

### Dummy Data Mode

When `VITE_USE_DUMMY_DATA=true`, all Axios requests are intercepted by `src/dummyData/dummyApiHandler.js` and return mock data. This allows frontend development without a running backend.

---

## FrontEnd → BackEnd Service Mapping

Each frontend service file maps to specific backend routes:

| Frontend Service | Backend Route Prefix | Functions |
|---|---|---|
| `services/authService.js` | `/auth` | login, register, forgotPassword, logout, getMe, changePassword |
| `services/studentService.js` | `/students`, `/enrollments`, `/complaints`, `/payments`, `/courses`, `/notifications` | 25 functions covering all student features |
| `services/professorService.js` | `/professors` | profile, offerings, grades, assignments, students |
| `services/advisorService.js` | `/advisors` | profile, students, dashboard, sessions |
| `services/adminService.js` | `/admin`, `/semesters`, `/departments` | users, complaints, semesters, dashboard |

---

## Common Error Codes

| HTTP Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error or business logic error (check `message`) |
| 401 | Not authenticated (missing/invalid token) |
| 403 | Not authorized (wrong role) |
| 404 | Resource not found |
| 429 | Rate limited (auth routes: 10 req/15min) |
| 500 | Server error |

---

## Notes for Frontend Developers

1. **Profile data:** The `name`, `email`, and `universityId` fields come from the `User` model, not the role-specific model. The `_id` returned is the role-profile ID (e.g., Student doc), while `userId` is the User doc ID.

2. **Pagination:** List endpoints (`/admin/users`, `/advisors/students`, etc.) accept `?page=1&limit=20` and return `{ pagination: { page, limit, total, pages } }`.

3. **Schedule parsing:** Backend stores schedule as strings (e.g. `"Mon/Wed 10:00-11:30"`). The `/students/schedule` endpoint already parses this into individual `{ day, start, end }` entries. For professor schedule, the backend also parses it.

4. **Grade format:** Grades are stored as strings: `"A"`, `"B+"`, `"C"`, etc. The frontend GPA calculator maps these to numeric values.

5. **Payment flow:** The backend uses a mock auto-approve (status always `"paid"`). In production, integrate a real payment gateway before setting status.

6. **Semester registration:** The `registrationStatus` field on Semester controls whether students can register. Only semesters with `"open"` status accept registrations.

7. **No hardcoded IDs or tokens** in any URL paths — all IDs are passed as path parameters or query parameters.

---

## Known Issues / Missing Features

The following features exist in the **FrontEndLayer** (pages + Redux store) but do not yet have corresponding backend endpoints. They currently work via dummy data only:

- **Admin pages using dummy data directly:** DepartmentManagement, SemesterConfiguration, ComplaintManagement, RegistrationControl, ReportsAnalytics, AcademicPolicies, SystemSettings
- **Advisor pages as stubs:** StudentListPage, AdvisingSessionsPage, GraduationRequirements, IssueResolutionPage, StudentProgressDetail
- **Professor notifications page:** ProfessorNotifications (placeholder only)

These pages will need backend implementation when connecting to the live API. They function correctly in dummy data mode (`VITE_USE_DUMMY_DATA=true`).
