```markdown
# Morshed Backend Implementation Plan

**Deadline:** 2 Days
**Status Legend:** [x] Done | [ ] Remaining

---

## Phase 0: Completed Features [x]

- [x] Core Setup (Express, Mongoose, Zod, Helmet, Rate Limiting)
- [x] Auth System (Register, Login, Logout, Get Me, JWT Access/Refresh, HttpOnly Cookies)
- [x] Auth Middleware (Protect, RBAC Authorize)
- [x] University Entities (Department, Semester, Course, CourseOffering CRUD)
- [x] Student Portal (Enrollment with atomic capacity check, Dashboard, Profile, Settings, Complaints, Payments)

---

## Phase 1: Auth & Security Completion

**Goal:** Finish the basic auth flows required by the frontend.

- [ ] **Task 1.1:** Forgot Password Flow
  - Implement `POST /auth/forgot-password` (Accepts email, generates a reset token, returns the token for testing—skip actual email sending).
- [ ] **Task 1.2:** Reset Password Flow
  - Implement `POST /auth/reset-password` (Accepts token + new password).
- [ ] **Task 1.3:** Change Password Flow
  - Implement `POST /auth/change-password` (Protected route, accepts current password + new password).

---

## Phase 2: Professor Portal (Data Generation)

**Goal:** Professors need to generate data (Grades, Attendance, Assignments) before the rest of the Student Portal can be built.

- [ ] **Task 2.1:** Assignment Model & Professor APIs
  - Create `Assignment` model.
  - Implement `POST /professors/assignments` (Validate with `AssignmentRequestSchema`).
  - Implement `GET /professors/offerings/:offeringId/assignments`.
- [ ] **Task 2.2:** Attendance Model & Professor APIs
  - Create `AttendanceSession` and `AttendanceRecord` models.
  - Implement `POST /professors/offerings/:offeringId/attendance` (Creates a session and marks all enrolled students as present/absent).
  - Implement `GET /professors/offerings/:offeringId/attendance`.
- [ ] **Task 2.3:** Professor Schedule API
  - Implement `GET /professors/schedule` (Returns the professor's teaching schedule for the current semester based on their offerings).

---

## Phase 3: Advisor Portal

**Goal:** Build the academic support system.

- [ ] **Task 3.1:** Advisor Profile & Dashboard
  - Implement `GET /advisors/profile`.
  - Implement `GET /advisors/dashboard` (Returns stats like total advisees, at-risk students based on low GPA).
- [ ] **Task 3.2:** Advisee Management
  - Implement `GET /advisors/students` (Returns list of assigned advisees with basic info).
- [ ] **Task 3.3:** Advising Sessions
  - Implement `POST /advisors/sessions` (Log a session).
  - Implement `GET /advisors/sessions` (Get session history).
  - Implement `PATCH /advisors/sessions/:sessionId` (Update session notes/status).
- [ ] **Task 3.4:** Student Progress & Graduation Audit
  - Implement `GET /advisors/student-progress/:studentId` (Returns full academic record).
  - Implement `GET /advisors/graduation/:studentId` (Returns completed vs. required courses for graduation).
- [ ] **Task 3.5:** Issue Resolution
  - Implement `GET /advisors/issues` (Returns escalated complaints assigned to this advisor).
  - Implement `PATCH /advisors/issues/:issueId` (Update status to resolved/in_progress).

---

## Phase 4: Admin Portal

**Goal:** System management and oversight.

- [ ] **Task 4.1:** Admin Dashboard
  - Implement `GET /admin/dashboard` (Returns system stats: total users by role, open complaints, active semesters).
- [ ] **Task 4.2:** User Management
  - Implement `GET /admin/users` (List users with pagination and role filtering).
  - Implement `POST /admin/users` (Admin creates a user, e.g., to assign a specific role or bypass registration).
  - Implement `PATCH /admin/users/:id` (Update role, isActive status).
- [ ] **Task 4.3:** Complaint Management
  - Implement `GET /admin/complaints` (List all complaints across students).
  - Implement `PATCH /admin/complaints/:complaintId` (Assign to advisor, update status).
- [ ] **Task 4.4:** Semester Configuration
  - Implement `POST /admin/semesters` (Create semester).
  - Implement `PATCH /admin/semesters/:id` (Update registration status, e.g., open/closed).
- [ ] **Task 4.5:** Department Management
  - Implement `GET /departments` (Already exists, verify).
  - Implement `POST /departments` (Already exists, verify).
  - Implement `PATCH /departments/:id` (Update department details).
- [ ] **Task 4.6:** Registration Control
  - Implement `POST /admin/semester-registration` (Allows admin to manually register a student into an offering).
- [ ] **Task 4.7:** System Settings
  - Implement `GET /admin/settings` (Returns global platform settings).
  - Implement `PUT /admin/settings` (Updates global settings).

---

## Phase 5: Student Portal Completion

**Goal:** Fill in the missing student views. Depends heavily on Phases 2 and 3.

- [ ] **Task 5.1:** Schedule View
  - Implement `GET /students/schedule` (Returns the student's weekly schedule based on their enrollments).
- [ ] **Task 5.2:** Attendance View
  - Implement `GET /students/attendance` (Returns attendance summary per course).
- [ ] **Task 5.3:** Exam Schedule View
  - Implement `GET /students/exams` (Returns upcoming exams for the student's enrolled courses).
- [ ] **Task 5.4:** Transcript View
  - Implement `GET /students/transcript` (Returns full academic history with grades).
- [ ] **Task 5.5:** Study Plan View
  - Implement `GET /students/study-plan` (Returns required courses vs. completed courses).
- [ ] **Task 5.6:** Notifications System
  - Create `Notification` model.
  - Implement `GET /students/notifications`.
  - Implement `PATCH /notifications/:id/read` (Mark as read).
- [ ] **Task 5.7:** Advising Sessions (Student side)
  - Implement `GET /students/advising-sessions` (Student views their own sessions).
  - Implement `POST /students/advising-sessions` (Student requests a session).
- [ ] **Task 5.8:** Professor List (Public/Student)
  - Implement `GET /professors` (Returns a list of all professors with id, name, and department—needed for student UI dropdowns).
```
