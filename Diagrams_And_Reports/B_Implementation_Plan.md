```markdown
# Morshed Backend Implementation Plan (Strict & Detailed)

**Deadline:** 2 Days
**Status Legend:** [x] Done | [ ] Remaining

---

## 🚨 GLOBAL CONSTRAINTS & BEST PRACTICES (MANDATORY)

**Before implementing ANY task,you adhere to these rules. If a task violates these, it is considered incomplete.**

1. **Security - RBAC on EVERY Endpoint:**
   - Every new route MUST use the `protect` middleware.
   - Every new route MUST use the `authorize` middleware with the specific role(s) allowed (e.g., `authorize('student')`, `authorize('admin', 'advisor')`).
   - No public routes unless explicitly stated.
2. **Security - Ownership Validation:**
   - Students can ONLY see/modify their own data (`req.user.id` -> `Student.userId`).
   - Professors can ONLY manage courses assigned to them (`req.user.id` -> `Professor.userId`).
   - Advisors can ONLY view students assigned to them.
3. **Security - Data Leakage Prevention:**
   - NEVER return `password` or `refreshToken` fields in any GET request or Populated query. Always use `.select('-password -refreshToken')` when querying the User model.
4. **Architecture - Modular Flow:**
   - `Model` -> `Validation (Zod)` -> `Service (Business Logic/DB)` -> `Controller (HTTP)` -> `Route`.
   - Keep controllers thin. All Mongoose queries and logic belong in the `Service` layer.
5. **Architecture - Zod Validation:**
   - Every POST/PATCH route MUST have a corresponding Zod validation middleware applied _before_ the controller.
6. **Architecture - Pagination for Lists:**
   - Any endpoint returning an array (e.g., list of users, list of complaints) MUST support pagination. Use query params `?page=1&limit=10`. Default limit should be 10 or 20 to prevent DB overload.
7. **Architecture - Transactions:**
   - Any operation that writes to multiple collections (e.g., creating a user AND their role profile) MUST use Mongoose Transactions (`session`).
8. **Frontend Contract Alignment:**
   - Response payloads MUST match the `Schemas_Documentation.MD` exactly. If the frontend expects `departmentName`, the backend must populate and format it, even if the DB stores `departmentId`.

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
  - **Route:** `POST /auth/forgot-password`
  - **Access:** Public
  - **Logic:** Accepts `email`. Find user. Generate a random hex string (use `crypto`). Hash it and save to a `resetPasswordToken` and `resetPasswordExpire` (1 hour) field on the User model (add these fields to User.js). Return `{ message: "Reset token generated" }` and the _unhashed_ token in the response (for testing, skip actual email sending).
- [ ] **Task 1.2:** Reset Password Flow
  - **Route:** `POST /auth/reset-password`
  - **Access:** Public
  - **Logic:** Accepts `token` and `newPassword`. Hash the incoming token, find the user with matching `resetPasswordToken` AND `resetPasswordExpire > Date.now()`. If found, set new password and clear the reset token fields.
- [ ] **Task 1.3:** Change Password Flow
  - **Route:** `POST /auth/change-password`
  - **Access:** Protected (Any logged-in user)
  - **Logic:** Accepts `currentPassword`, `newPassword`. Fetch user WITH password selected (`.select('+password')`). Use `user.matchPassword(currentPassword)`. If match, set new password and save.

---

## Phase 2: Professor Portal (Data Generation)

**Goal:** Professors need to generate data (Grades, Attendance, Assignments) before the rest of the Student Portal can be built.

- [ ] **Task 2.1:** Assignment Model & Professor APIs
  - **Model:** `Assignment` (offeringId, title, dueDate, maxScore).
  - **Route:** `POST /professors/assignments` | **Access:** `protect, authorize('professor')`
  - **Logic:** Validate ownership (Professor must own the offeringId). Create assignment.
  - **Route:** `GET /professors/offerings/:offeringId/assignments` | **Access:** `protect, authorize('professor')`
  - **Logic:** Validate ownership. Return assignments for that offering.
- [ ] **Task 2.2:** Attendance Model & Professor APIs
  - **Model:** `Attendance` (offeringId, date, records: [{studentId, status: 'present'/'absent'/'late'}]).
  - **Route:** `POST /professors/offerings/:offeringId/attendance` | **Access:** `protect, authorize('professor')`
  - **Logic:** Validate ownership. Accept array of `{ studentId, status }`. Create/update attendance record for that date.
  - **Route:** `GET /professors/offerings/:offeringId/attendance` | **Access:** `protect, authorize('professor')`
  - **Logic:** Validate ownership. Return attendance history.
- [ ] **Task 2.3:** Professor Schedule API
  - **Route:** `GET /professors/schedule` | **Access:** `protect, authorize('professor')`
  - **Logic:** Find professor's offerings for the current semester, extract schedule fields.

---

## Phase 3: Advisor Portal

**Goal:** Build the academic support system.

- [ ] **Task 3.1:** Advisor Profile & Dashboard
  - **Route:** `GET /advisors/profile` | **Access:** `protect, authorize('advisor')`
  - **Route:** `GET /advisors/dashboard` | **Access:** `protect, authorize('advisor')`
  - **Logic:** Return counts of assigned advisees, and count of advisees with GPA < 2.0 (at-risk).
- [ ] **Task 3.2:** Advisee Management
  - **Route:** `GET /advisors/students` | **Access:** `protect, authorize('advisor')`
  - **Logic:** Find students where `advisorId` matches the logged-in advisor. Populate `userId` (select name, universityId). Support pagination.
- [ ] **Task 3.3:** Advising Sessions
  - **Model:** `AdvisingSession` (studentId, advisorId, semesterId, notes, status).
  - **Route:** `POST /advisors/sessions` | **Access:** `protect, authorize('advisor')`
  - **Route:** `GET /advisors/sessions` | **Access:** `protect, authorize('advisor')` (Filter by query param `?studentId=`)
  - **Route:** `PATCH /advisors/sessions/:sessionId` | **Access:** `protect, authorize('advisor')` (Validate ownership)
- [ ] **Task 3.4:** Student Progress & Graduation Audit
  - **Route:** `GET /advisors/student-progress/:studentId` | **Access:** `protect, authorize('advisor')`
  - **Logic:** Validate this advisor owns this student. Fetch student's enrollments, grades, and attendance summary.
  - **Route:** `GET /advisors/graduation/:studentId` | **Access:** `protect, authorize('advisor')`
  - **Logic:** Compare completed courses against total required courses for the student's department.
- [ ] **Task 3.5:** Issue Resolution
  - **Route:** `GET /advisors/issues` | **Access:** `protect, authorize('advisor')`
  - **Logic:** Fetch complaints assigned to this advisor. Support pagination.
  - **Route:** `PATCH /advisors/issues/:issueId` | **Access:** `protect, authorize('advisor')`
  - **Logic:** Validate ownership. Update complaint status.

---

## Phase 4: Admin Portal

**Goal:** System management and oversight.

- [ ] **Task 4.1:** Admin Dashboard
  - **Route:** `GET /admin/dashboard` | **Access:** `protect, authorize('admin')`
  - **Logic:** Count total users grouped by role, count open complaints.
- [ ] **Task 4.2:** User Management
  - **Route:** `GET /admin/users` | **Access:** `protect, authorize('admin')`
  - **Logic:** Fetch all users. Support pagination (`?page&limit`) and filtering (`?role=student`). NEVER return passwords.
  - **Route:** `PATCH /admin/users/:id` | **Access:** `protect, authorize('admin')`
  - **Logic:** Update `isActive` or `role`. (Prevent admin from changing their own role to non-admin).
- [ ] **Task 4.3:** Complaint Management
  - **Route:** `GET /admin/complaints` | **Access:** `protect, authorize('admin')`
  - **Route:** `PATCH /admin/complaints/:complaintId` | **Access:** `protect, authorize('admin')`
  - **Logic:** Allow admin to assign `adminId` or change `status`.
- [ ] **Task 4.4:** Semester Configuration
  - **Route:** `PATCH /admin/semesters/:id` | **Access:** `protect, authorize('admin')`
  - **Logic:** Update `registrationStatus` (e.g., close registration).
- [ ] **Task 4.5:** Registration Control (Manual Override)
  - **Route:** `POST /admin/semester-registration` | **Access:** `protect, authorize('admin')`
  - **Logic:** Admin can manually enroll a student into an offering, bypassing capacity limits. Use Transaction.
- [ ] **Task 4.6:** System Settings
  - **Model:** `Setting` (key, value).
  - **Route:** `GET /admin/settings` & `PUT /admin/settings` | **Access:** `protect, authorize('admin')`

---

## Phase 5: Student Portal Completion

**Goal:** Fill in the missing student views. (Depends on Phases 2 & 3).

- [ ] **Task 5.1:** Schedule View
  - **Route:** `GET /students/schedule` | **Access:** `protect, authorize('student')`
  - **Logic:** Fetch student's enrollments for current semester, populate offeringId (select schedule, classroom), populate courseId (select code, name), populate professorId (select name). Format into array of schedule items matching `ScheduleItemSchema`.
- [ ] **Task 5.2:** Attendance View
  - **Route:** `GET /students/attendance` | **Access:** `protect, authorize('student')`
  - **Logic:** Query `Attendance` model for records containing this student's ID. Aggregate by course to calculate `attended`, `total`, `percent` matching `AttendanceCourseSchema`.
- [ ] **Task 5.3:** Exam Schedule View
  - **Route:** `GET /students/exams` | **Access:** `protect, authorize('student')`
  - **Logic:** (Mock logic for now since Exam model isn't built) Return an array of objects matching `ExamItemSchema` for the student's enrolled courses.
- [ ] **Task 5.4:** Transcript View
  - **Route:** `GET /students/transcript` | **Access:** `protect, authorize('student')`
  - **Logic:** Fetch all 'completed' or 'enrolled' enrollments for the student. Group by semester. Calculate semester GPA. Format matching `TranscriptResponseSchema`.
- [ ] **Task 5.5:** Study Plan View
  - **Route:** `GET /students/study-plan` | **Access:** `protect, authorize('student')`
  - **Logic:** Fetch all courses in the student's department. Mark which ones the student has completed. Group by year/semester. Format matching `StudyPlanResponseSchema`.
- [ ] **Task 5.6:** Notifications System
  - **Model:** `Notification` (userId, type, title, message, date, read).
  - **Route:** `GET /students/notifications` | **Access:** `protect, authorize('student')` (Paginated)
  - **Route:** `PATCH /notifications/:id/read` | **Access:** `protect, authorize('student')` (Validate ownership of notification).
- [ ] **Task 5.7:** Advising Sessions (Student side)
  - **Route:** `GET /students/advising-sessions` | **Access:** `protect, authorize('student')`
  - **Route:** `POST /students/advising-sessions` | **Access:** `protect, authorize('student')`
- [ ] **Task 5.8:** Professor List (Public/Student)
  - **Route:** `GET /professors` | **Access:** `protect, authorize('student', 'admin')`
  - **Logic:** Return list of all professors. Populate `userId` (select name) and `departmentId` (select name). Exclude sensitive data.
```

---
