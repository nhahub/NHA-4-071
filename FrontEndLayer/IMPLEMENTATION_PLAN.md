# Implementation Plan: Remove Dummy Data & Fully Connect Frontend to Backend

## Current State Summary

**Backend (77 endpoints):** Complete MVC with auth, student (20), professor (9), advisor (10), admin (11), university (8), courses (3), enrollment (3), payment (2), complaint (2), notifications (1).

**Frontend:** Redux Toolkit (20 slices), services via `genericFetchService.js` (Axios), Zod validation. Three data source patterns:
1. **Dual-mode (interceptor):** Student pages, AdminDashboard, UserManagement, ProfessorSchedule, AdvisorDashboard — work when dummy toggle is OFF
2. **Hardcoded mock functions (always-on):** ProfessorDashboard, MyCoursesPage, AssignmentsPage, AttendanceManagement, GradeManagement, StudentPerformance, ProfessorNotifications — bypass the toggle entirely
3. **Direct dummy imports (no toggle):** 6 Admin pages (SemesterConfiguration, ComplaintManagement, DepartmentManagement, ReportsAnalytics, RegistrationControl, SystemSettings) + 1 unused Advisor import

---

## PHASE 1: Backend — Add Missing Endpoints (~8 new endpoints)

The backend is missing endpoints that 8 frontend pages need.

### 1A. Professor Notifications
- **Create:** `BackEndLayer/src/routes/professorNotificationRoutes.js`
- Mount at `/api/professors/notifications` in `server.js`
- `GET /` — Returns notifications where `userId = req.user.id` (reuses existing `Notification` model)
- `protect` + `authorize("professor")` middleware
- Same logic as `studentService.getNotifications`

### 1B. Professor Dashboard (aggregated overview)
- **Add to:** `BackEndLayer/src/routes/professorRoutes.js` + controller + service
- `GET /api/professors/dashboard`
- Returns:
  - Count of students across all offerings (`CourseOffering → Enrollment`)
  - Average attendance rate across offerings (`Attendance`)
  - Count of pending grades (enrollments with `grade: null` and `status: "enrolled"`)
  - Count of upcoming assignments (`Assignment` where `dueDate > now`)
  - Recent activity (last 10 notifications for this user)
  - Today's agenda (offerings whose `schedule` matches today's day)
  - Performance chart data (average grades per offering)

### 1C. Professor Grades Overview (all offerings)
- **Add to:** `BackEndLayer/src/routes/professorRoutes.js`
- `GET /api/professors/grades-overview`
- Returns all students with grades across all of the professor's offerings
- Computed metrics: average score, highest score, graded items count
- Reuses `Enrollment` + `CourseOffering` models

### 1D. Professor Performance Analytics
- **Add to:** `BackEndLayer/src/routes/professorRoutes.js`
- `GET /api/professors/performance`
- Computes from attendance + grade data:
  - Per-student: GPA, attendance rate, risk level (CRITICAL/WARNING/HEALTHY)
  - Engagement metrics (assignment submission rates)
  - At-risk student count

### 1E. Admin Reports & Analytics
- **Add to:** `BackEndLayer/src/routes/adminRoutes.js`
- `GET /api/admin/reports`
- Returns:
  - KPIs: total users, total courses, total enrollments, total complaints
  - Enrollment trends (monthly counts for current semester)
  - GPA by department
  - Institutional growth (users per role, semester-over-semester)

### 1F. Admin Registration Stats
- **Add to:** `BackEndLayer/src/routes/adminRoutes.js`
- `GET /api/admin/registration-stats`
- Returns:
  - Total registered students this semester
  - Auto-enrolled count
  - Pending overrides (manual enrollment requests)
  - Whether registration window is open

### 1G. Missing Backend Validations
- **File:** `BackEndLayer/src/validations/studentValidation.js` — currently empty, add:
  - `updateProfileSchema` (program: string optional)
  - `updateSettingsSchema` (showGpa: boolean optional, preferredLanguage: string optional)
  - `createAdvisingSessionStudentSchema` (semesterId: string, notes: string optional)
- **File:** `BackEndLayer/src/validations/courseValidation.js` — currently empty, add if needed
- Apply these validations in `studentRoutes.js` and other affected routes

### Backend Files Summary

| Action | File |
|--------|------|
| **Create** | `BackEndLayer/src/routes/professorNotificationRoutes.js` |
| **Create** | `BackEndLayer/src/services/professorDashboardService.js` |
| **Create** | `BackEndLayer/src/controllers/professorDashboardController.js` |
| **Modify** | `BackEndLayer/src/routes/professorRoutes.js` — add dashboard, grades-overview, performance endpoints |
| **Modify** | `BackEndLayer/src/controllers/professorController.js` — add 3 new controller methods |
| **Modify** | `BackEndLayer/src/services/professorService.js` — add 3 new service methods |
| **Modify** | `BackEndLayer/src/routes/adminRoutes.js` — add reports, registration-stats endpoints |
| **Modify** | `BackEndLayer/src/controllers/adminController.js` — add 2 new controller methods |
| **Modify** | `BackEndLayer/src/services/adminService.js` — add 2 new service methods |
| **Modify** | `BackEndLayer/src/server.js` — mount professor notification routes |
| **Modify** | `BackEndLayer/src/validations/studentValidation.js` — add missing schemas |
| **Modify** | `BackEndLayer/src/validations/courseValidation.js` — add if needed |
| **Modify** | `BackEndLayer/src/routes/studentRoutes.js` — apply new validations |

---

## PHASE 2: Frontend — Remove Dummy Data Infrastructure

| Action | File | Change |
|--------|------|--------|
| **Delete** | `FrontEndLayer/src/dummyData/` (all 26 files) | Remove entire directory |
| **Edit** | `FrontEndLayer/src/services/genericFetchService.js` | Remove `installDummyInterceptor` import (line 3) and the `if (VITE_USE_DUMMY_DATA...)` block (lines 10-13) |
| **Edit** | `FrontEndLayer/.env` | Set `VITE_USE_DUMMY_DATA=false` (or remove the variable) |
| **Edit** | `FrontEndLayer/.env.example` | Set `VITE_API_URL=http://localhost:5000/api`, remove or set `VITE_USE_DUMMY_DATA=false` |
| **Edit** | `FrontEndLayer/src/pages/Advisor/AdvisorDashboard.jsx` | Remove unused `import { advisors } from "../../dummyData/advisors"` |

### Files in dummyData/ to delete

`index.js`, `dummyApiHandler.js`, `users.js`, `students.js`, `professors.js`, `advisors.js`, `admins.js`, `departments.js`, `courses.js`, `semesters.js`, `courseOfferings.js`, `enrollments.js`, `payments.js`, `complaints.js`, `advisingSessions.js`, `assignments.js`, `exams.js`, `transcripts.js`, `studyPlans.js`, `notifications.js`, `attendance.js`, `schedule.js`, `settings.js`, `adminDashboard.js`, `registrationOverrides.js`, `reportsData.js`

---

## PHASE 3: Frontend — Remove Professor Mock Functions & Wire to Real APIs

### 3A. `FrontEndLayer/src/services/professorService.js`
- **Delete** all 8 `getMock*` functions (lines 26-174)
- **Add** new real API functions:

| Function | Method | Endpoint | Request Schema | Response Schema |
|----------|--------|----------|----------------|-----------------|
| `getProfessorDashboard()` | GET | `/professors/dashboard` | — | `ProfessorDashboardSchema` (new) |
| `getProfessorNotifications()` | GET | `/professors/notifications` | — | `NotificationResponseSchema` (existing) |
| `getProfessorGradesOverview()` | GET | `/professors/grades-overview` | — | `ProfessorGradesSchema` (new) |
| `getProfessorPerformance()` | GET | `/professors/performance` | — | `ProfessorPerformanceSchema` (new) |
| `getProfessorSchedule()` | GET | `/professors/schedule` | — | `ScheduleResponseSchema` (existing) |
| `getOfferingStudents(offeringId)` | GET | `/professors/offerings/:offeringId/students` | — | (new schema) |
| `markAttendance(offeringId, data)` | POST | `/professors/offerings/:offeringId/attendance` | `AttendanceRequestSchema` (existing) | — |
| `getAttendanceRecords(offeringId)` | GET | `/professors/offerings/:offeringId/attendance` | — | (new schema) |

### 3B. `FrontEndLayer/src/store/professor/professorThunks.js`
- Replace all 8 mock imports with real service imports
- Rewrite thunks to call real API functions
- Each thunk: call service → check success → return data or `rejectWithValue`

### 3C. `FrontEndLayer/src/store/professor/professorSlice.js`
- Update `extraReducers` to handle real API response shapes
- Remove/simplify client-side metric computation (backend now provides metrics)
- The slice should store raw API data; components can derive display data if needed

### 3D. `FrontEndLayer/src/hooks/useProfessor.js`
- Wire stub methods (`loadOfferingStudents`, `createAssignment`) to real thunks
- Add new methods: `loadDashboard`, `loadNotifications`, `loadGradesOverview`, `loadPerformance`, `loadSchedule`

---

## PHASE 4: Frontend — Wire Admin Pages to Real APIs

### 4A. `FrontEndLayer/src/pages/Admin/SemesterConfiguration.jsx`
- Remove `import { semesters as initialSemesters } from "../../dummyData"`
- Use `useSemester()` hook for `fetchAllSemesters`
- Create semester via `useAdmin().addSemester()`
- Update semester status via `adminService.updateSemesterStatus(id, { registrationStatus })`

### 4B. `FrontEndLayer/src/pages/Admin/ComplaintManagement.jsx`
- Remove `import { complaints as initialComplaints } from "../../dummyData"`
- Use `useAdmin()` hook: `loadComplaints()` on mount
- Update via `resolveComplaint(id, status)` (already in useAdmin)
- Wire `agent` assignment to `adminService.updateComplaintStatus`

### 4C. `FrontEndLayer/src/pages/Admin/DepartmentManagement.jsx`
- Remove `import { departments as initialDepts, pendingAllocations as initialAllocations } from "../../dummyData"`
- Use `adminService.getDepartments()` on mount
- Create department via new `adminService.createDepartment(name, code)`
- Pending allocations: store in admin settings or local state

### 4D. `FrontEndLayer/src/pages/Admin/ReportsAnalytics.jsx`
- Remove `import { reportsData } from "../../dummyData"`
- Wire to new `GET /api/admin/reports` endpoint
- Add `adminService.getReports()` → new service function
- Use local `useEffect` + `useState` to load and display

### 4E. `FrontEndLayer/src/pages/Admin/RegistrationControl.jsx`
- Remove `import { initialOverrides, registrationStats } from "../../dummyData"`
- Wire to new `GET /api/admin/registration-stats` endpoint
- Add `adminService.getRegistrationStats()`

### 4F. `FrontEndLayer/src/pages/Admin/SystemSettings.jsx`
- Remove `import { systemSettingsData } from "../../dummyData"`
- Wire to existing `GET /api/admin/settings` + `PUT /api/admin/settings`
- Map flat key-value pairs from Setting model to structured UI (apiGateway.*, securityProtocol.*, etc.)

### 4G. Admin Service Additions (`FrontEndLayer/src/services/adminService.js`)

| Function | Method | Endpoint |
|----------|--------|----------|
| `createDepartment(name, code)` | POST | `/departments` |
| `getReports()` | GET | `/admin/reports` |
| `getRegistrationStats()` | GET | `/admin/registration-stats` |
| `updateSemesterStatus(id, data)` | PATCH | `/admin/semesters/:id` |

---

## PHASE 5: Frontend — Wire Advisor Pages to Real APIs

### 5A. Advisor Service Additions (`FrontEndLayer/src/services/advisorService.js`)

| Function | Method | Endpoint |
|----------|--------|----------|
| `getSessions()` | GET | `/advisors/sessions` |
| `createSession(data)` | POST | `/advisors/sessions` |
| `getStudentProgress(studentId)` | GET | `/advisors/student-progress/:studentId` |
| `getGraduationAudit(studentId)` | GET | `/advisors/graduation/:studentId` |
| `getIssues()` | GET | `/advisors/issues` |
| `updateIssueStatus(issueId, status)` | PATCH | `/advisors/issues/:issueId` |

### 5B. Advisor Store Additions
- Extend `advisorSlice.js` with thunks for: sessions, studentProgress, graduationAudit, issues
- Extend `advisorThunks.js` with new thunks
- Extend `advisorSlice.js` `extraReducers`

### 5C. Advisor Hook Updates (`useAdvisor.js`)
- Add methods: `loadSessions`, `createSession`, `updateSession`, `loadStudentProgress`, `loadGraduationAudit`, `loadIssues`, `updateIssue`

### 5D. Stub Pages to Build

| Page | Backend Endpoint | Description |
|------|-----------------|-------------|
| `StudentListPage.jsx` | `GET /advisors/students` | Use `useAdvisor().assignedStudents` |
| `AdvisingSessionsPage.jsx` | `GET /advisors/sessions`, `POST /advisors/sessions`, `PATCH /advisors/sessions/:id` | List/create/update sessions |
| `GraduationRequirements.jsx` | `GET /advisors/graduation/:studentId` | Search student, show audit |
| `IssueResolutionPage.jsx` | `GET /advisors/issues`, `PATCH /advisors/issues/:issueId` | List/update issues |
| `StudentProgressDetail.jsx` | `GET /advisors/student-progress/:studentId` | Accept `:id` param, show progress |

---

## PHASE 6: Frontend — Fix Service Endpoint URL Bugs

| File | Function | Current URL | Correct URL |
|------|----------|-------------|-------------|
| `studentService.js` | `submitSemesterRegistration` | `POST /semester-registration` | `POST /students/semester-registration` |
| `studentService.js` | `saveGpaCalculation` | `POST /gpa-calculations` | `POST /students/gpa-calculations` |

---

## PHASE 7: Frontend — Complete Zod Validation Revision

### CRITICAL: 7A. Fix `fetchService` Envelope Unwrapping

**Problem:** `fetchService` passes `response.data` (the full `{ success: true, data: {...} }` envelope) directly to `schema.parse()`. But most schemas validate the INNER data shape (without envelope). This means **ALL response validations fail with the real backend**, returning `"Received invalid data from server."` for every endpoint. The app only works with dummy data because the interceptor returns unwrapped data.

**Fix in `FrontEndLayer/src/services/genericFetchService.js`:**

```js
// BEFORE (line 30):
const validatedData = schema.parse(response.data);

// AFTER:
const envelope = response.data;
const hasEnvelope = envelope && typeof envelope === 'object' && 'success' in envelope && 'data' in envelope;
const payload = hasEnvelope ? envelope.data : envelope;
const validatedData = schema.parse(payload);
```

This detects the `{ success, data }` wrapper and extracts the inner `data` before validation. Dummy data (no envelope) passes through unchanged.

---

### 7B. Fix Auth Response Schemas (`authResponseSchema.js`)

After the `fetchService` unwrap fix, auth schemas must validate INNER data only (remove envelope).

| Schema | Before (envelope) | After (inner data) | Notes |
|--------|-------------------|-------------------|-------|
| `LoginResponseSchema` | `{ success, data: { user, token } }` | `{ user: UserSchema, token: z.string().optional() }` | `.passthrough()` |
| `RegisterResponseSchema` | `{ success, data: UserSchema }` | `UserSchema` directly | `.passthrough()` |
| `MessageResponseSchema` | `{ message: z.string() }` | No change needed | Used for `changePassword`, `resetPassword` — inner data IS `{ message }` |
| NEW `MeResponseSchema` | — | `{ user: UserSchema }` | For `GET /auth/me` which returns `{ user: {...} }` (no token) |
| NEW `ForgotPasswordResponseSchema` | — | `{ message: z.string(), token: z.string() }` | `forgotPassword` returns `{ message, token }` in inner data |

**Backend fix required:** `logout` endpoint returns `{ success: true, message: "..." }` (message at top level, no `data` wrapper). Must change to `{ success: true, data: { message: "..." } }` for consistency. File: `BackEndLayer/src/controllers/authController.js` → `logout` method.

**Service changes after schema fixes:**
- `authService.js` → `getCurrentUser()`: change response schema from `LoginResponseSchema` to new `MeResponseSchema`
- `authService.js` → `forgotPassword()`: change response schema from `MessageResponseSchema` to new `ForgotPasswordResponseSchema`

---

### 7C. Fix Student Response Schemas

#### `studentResponseSchema.js`

| Field | Current | Backend Actual | Fix |
|-------|---------|---------------|-----|
| `departmentId` | `z.string()` | Can be `null` | `z.string().nullable()` |
| `departmentName` | `z.string().optional()` | Can be `null` | `z.string().nullable().optional()` |
| All fields | No `.passthrough()` | — | Add `.passthrough()` |

#### `dashboardResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` |
| Shape otherwise correct for inner data | No change needed |

#### `courseResponseSchema.js`

| Field | Current | Backend Actual | Fix |
|-------|---------|---------------|-----|
| `departmentId` | `z.string()` | Populated object `{ _id, name, code }` in some endpoints | `z.union([z.string(), z.object({ _id: z.string(), name: z.string(), code: z.string() }).passthrough()])` |
| No `.passthrough()` | — | Add `.passthrough()` |

#### `enrollmentResponseSchema.js`

| Field | Current | Backend Actual | Fix |
|-------|---------|---------------|-----|
| `offeringId` | `z.string()` | Populated `{ _id, schedule, classroom }` in `getMyEnrollments` | `z.union([z.string(), z.object({}).passthrough()])` |
| `courseId` | `z.string().optional()` | Populated `{ _id, code, name, credits }` in `getMyEnrollments` | `z.union([z.string(), z.object({}).passthrough()]).optional()` |
| No `.passthrough()` | — | Add `.passthrough()` |

#### `complaintResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` (for `createdAt`, `updatedAt`) |

#### `paymentResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` (for `createdAt`, `updatedAt`) |

#### `advisingSessionResponseSchema.js`

| Field | Current | Backend Actual | Fix |
|-------|---------|---------------|-----|
| `advisorId` | `z.string().optional()` | Populated `{ _id, name }` in `getMyAdvisingSessions` | `z.union([z.string(), z.object({}).passthrough()]).optional()` |
| `semesterId` | `z.string().optional()` | Populated `{ _id, name, code }` in `getMyAdvisingSessions` | `z.union([z.string(), z.object({}).passthrough()]).optional()` |
| No `.passthrough()` | — | Add `.passthrough()` |

#### `notificationResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` (for `createdAt`, `updatedAt`) |

#### `attendanceResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` |

#### `scheduleResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` |

#### `examResponseSchema.js`

| Field | Current | Backend Actual | Fix |
|-------|---------|---------------|-----|
| `studentId` | `z.string()` (required) | NOT returned by backend | Remove entirely |
| `seat` | `z.string()` (required) | NOT returned by backend | Remove entirely |
| `courseCode` | `z.string()` | Can be `undefined` | `z.string().optional()` |
| `courseName` | `z.string()` | Can be `undefined` | `z.string().optional()` |
| `room` | `z.string()` | Can be `undefined` | `z.string().optional()` |
| No `.passthrough()` | — | Add `.passthrough()` |

#### `studyPlanResponseSchema.js`

| Field | Current | Backend Actual | Fix |
|-------|---------|---------------|-----|
| `year` (in PlanYearSchema) | `z.string()` | Stored as Number in Mongoose | `z.number()` |
| No `.passthrough()` | — | Add `.passthrough()` (for `createdAt`, `updatedAt`) |

#### `transcriptResponseSchema.js`

Already uses `.passthrough()`. Shape correct. ✅

#### `assignmentResponseSchema.js`

| Issue | Fix |
|-------|-----|
| No `.passthrough()` | Add `.passthrough()` (for `createdAt`, `updatedAt`) |

---

### 7D. Fix Professor & Advisor Profile Schemas (`professorResponseSchema.js`)

#### `ProfessorProfileSchema`

Backend returns: `{ _id, userId, name, email, universityId, departmentId, departmentName, title }`

| Field | Current | Fix |
|-------|---------|-----|
| `name` | Missing | Add `z.string().optional()` |
| `email` | Missing | Add `z.string().optional()` |
| `universityId` | Missing | Add `z.string().optional()` |
| `departmentName` | Missing | Add `z.string().optional()` |

#### `AdvisorProfileSchema`

Backend returns: `{ _id, userId, name, email, universityId, departmentId, departmentName, title }`

| Field | Current | Fix |
|-------|---------|-----|
| `name` | Missing | Add `z.string().optional()` |
| `email` | Missing | Add `z.string().optional()` |
| `universityId` | Missing | Add `z.string().optional()` |
| `departmentName` | Missing | Add `z.string().optional()` |
| `title` | Missing | Add `z.string().optional()` |

---

### 7E. Fix Admin Schemas (`usersResponseSchema.js`)

#### `ComplaintAdminSchema`

Backend `getComplaints` returns: `{ _id, studentId (populated), adminId, subject, description, status, createdAt, updatedAt }`

| Field | Current | Fix |
|-------|---------|-----|
| `adminId` | Missing | Add `z.string().nullable().optional()` |
| `description` | Missing | Add `z.string().optional()` |
| `createdAt` | Missing | Add `z.string().optional()` |

#### `UsersResponseSchema`

Backend `getUsers` returns: `{ _id, universityId, email, name, role, isActive, createdAt, updatedAt }`

`UserListSchema` is missing `createdAt`, `updatedAt`. Add `.passthrough()` (already present). Shape otherwise correct. ✅

---

### 7F. Fix Semester & Department Schemas

#### `semesterResponseSchema.js`
Already uses `.passthrough()`. Shape correct. ✅

#### `departmentResponseSchema.js`
Already uses `.passthrough()`. Shape correct. ✅

#### `settingsResponseSchema.js`
Already uses `.passthrough()`. Shape correct. ✅

#### `offeringResponseSchema.js`
Already uses `.passthrough()`. Shape correct. ✅ (populated fields like `courseId` and `semesterId` will have extra keys that `.passthrough()` allows)

---

### 7G. New Response Schemas to Create

All files go in `FrontEndLayer/src/Schemas/ResponseSchemas/`.

#### For Phase 1 backend endpoints:

| File | Schema | Shape (inner data) |
|------|--------|--------------------|
| `professorDashboardResponseSchema.js` | `ProfessorDashboardResponseSchema` | `{ metrics: { totalStudents, studentsTrend, avgAttendance, attendanceTrend, pendingGrades, academicAlerts }, agenda: [...], currentCourses: [...], recentActivity: [...], performanceChart: [...] }.passthrough()` |
| `professorGradesResponseSchema.js` | `ProfessorGradesResponseSchema` | `{ metrics: { averageScore, gradedItems, highestScore, highestGrade, publishStatus }, students: [...] }.passthrough()` |
| `professorPerformanceResponseSchema.js` | `ProfessorPerformanceResponseSchema` | `{ metrics: { gpa, attendance, atRisk, totalStudents }, students: [...], engagementData: [...] }.passthrough()` |
| `professorOfferingStudentsResponseSchema.js` | `ProfessorOfferingStudentsResponseSchema` | `z.array(z.object({ _id, userId: { name, universityId }, GPA, level, grade, courseCode }).passthrough())` |
| `professorAttendanceResponseSchema.js` | `ProfessorAttendanceResponseSchema` | `z.array(z.object({ _id, offeringId, date, records: z.array(z.object({ studentId: z.union([z.string(), z.object({}).passthrough()]), status, _id }).passthrough()) }).passthrough())` |
| `adminReportsResponseSchema.js` | `AdminReportsResponseSchema` | `{ kpis: [...], enrollmentTrends: [...], gpaByDepartment: [...], institutionalGrowth: [...] }.passthrough()` |
| `adminRegistrationStatsResponseSchema.js` | `AdminRegistrationStatsResponseSchema` | `{ totalRegistered, autoEnrolled, pendingOverrides, isWindowOpen }.passthrough()` |
| `adminSettingsResponseSchema.js` | `AdminSettingsResponseSchema` | `z.record(z.string(), z.any())` (dynamic key-value) |
| `advisorSessionsResponseSchema.js` | `AdvisorSessionsResponseSchema` | `z.array(z.object({ _id, studentId: z.union([z.string(), z.object({}).passthrough()]), advisorId, semesterId: z.union([z.string(), z.object({}).passthrough()]), notes, status, createdAt }).passthrough())` |
| `advisorStudentProgressResponseSchema.js` | `AdvisorStudentProgressResponseSchema` | `{ student: {...}, enrollments: [...], attendanceSummary: [...], totalCreditsEarned, completedCoursesCount }.passthrough()` |
| `advisorGraduationAuditResponseSchema.js` | `AdvisorGraduationAuditResponseSchema` | `{ studentName, universityId, departmentName, totalRequiredCourses, completedCourses, completedCount, totalRequiredCredits, completedCredits, progress }.passthrough()` |
| `advisorIssuesResponseSchema.js` | `AdvisorIssuesResponseSchema` | `{ complaints: z.array(z.object({...}).passthrough()), pagination: z.object({ page, limit, total, pages }) }.passthrough()` |
| `adminDashboardResponseSchema.js` | `AdminDashboardResponseSchema` | `{ totalUsers, usersByRole: { students, professors, advisors, admins }, openComplaints }.passthrough()` |
| `adminUsersResponseSchema.js` | `AdminUsersResponseSchema` | `{ users: z.array(UserListSchema), pagination: z.object({ page, limit, total, pages }) }.passthrough()` |

---

### 7H. New Request Schemas to Create

All files go in `FrontEndLayer/src/Schemas/RequestSchemas/`.

| File | Schema | Fields | Matches Backend Validation |
|------|--------|--------|---------------------------|
| `profileSchemas.js` | `UpdateProfileRequestSchema` | `{ program: z.string().optional() }` | No backend validation (empty `studentValidation.js`) — will be added in Phase 1G |
| `settingsSchemas.js` | `UpdateSettingsRequestSchema` | `{ showGpa: z.boolean().optional(), preferredLanguage: z.string().optional() }` | No backend validation — will be added in Phase 1G |
| `semesterSchemas.js` | `UpdateSemesterStatusRequestSchema` | `{ registrationStatus: z.enum(['upcoming','open','closed','ongoing','ended']) }` | `adminValidation.js` → `updateSemesterSchema` ✅ |
| `departmentSchemas.js` | `CreateDepartmentRequestSchema` | `{ name: z.string().min(1), code: z.string().min(1).max(10) }` | `universityValidation.js` → `departmentSchema` ✅ |
| `issueSchemas.js` | `UpdateIssueStatusRequestSchema` | `{ status: z.enum(['pending','in_progress','resolved','rejected']) }` | No backend validation — manual check in service |
| `advisingSessionUpdateSchema.js` | `UpdateAdvisingSessionRequestSchema` | `{ notes: z.string().optional(), status: z.enum(['scheduled','completed','cancelled','pending']).optional() }` | `advisorValidation.js` → `updateAdvisingSessionSchema` ✅ |

---

### 7I. Request Schema Notes (existing — no changes needed)

| Schema | Notes |
|--------|-------|
| `LoginRequestSchema` | ✅ Matches backend `loginSchema` exactly |
| `RegisterRequestSchema` | ✅ Extra `confirmPassword` is stripped by Zod before backend |
| `ForgotPasswordRequestSchema` | ✅ Matches backend `forgotPasswordSchema` |
| `ChangePasswordRequestSchema` | ✅ Matches backend `changePasswordSchema` (including `confirmPassword`) |
| `AssignmentRequestSchema` | ✅ Matches backend `assignmentSchema` |
| `AdvisingSessionRequestSchema` | ✅ Matches backend `createAdvisingSessionSchema` |
| `EnrollmentRequestSchema` | ✅ Matches backend `enrollmentSchema` |
| `ComplaintRequestSchema` | ✅ Matches backend `complaintSchema` |
| `GradeRequestSchema` | ✅ Matches backend `gradeSchema` |
| `MakePaymentRequestSchema` | ✅ Matches backend `paymentSchema` |

---

### 7J. Summary: Files to Create/Modify

**Modify existing response schemas (12 files):**

| File | Changes |
|------|---------|
| `authResponseSchema.js` | Remove envelope from `LoginResponseSchema`, `RegisterResponseSchema`. Add `MeResponseSchema`, `ForgotPasswordResponseSchema` |
| `studentResponseSchema.js` | Fix `departmentId` nullable, `departmentName` nullable, add `.passthrough()` |
| `dashboardResponseSchema.js` | Add `.passthrough()` |
| `courseResponseSchema.js` | Fix `departmentId` union type, add `.passthrough()` |
| `enrollmentResponseSchema.js` | Fix `offeringId`/`courseId` union types, add `.passthrough()` |
| `complaintResponseSchema.js` | Add `.passthrough()` |
| `paymentResponseSchema.js` | Add `.passthrough()` |
| `advisingSessionResponseSchema.js` | Fix `advisorId`/`semesterId` union types, add `.passthrough()` |
| `notificationResponseSchema.js` | Add `.passthrough()` |
| `examResponseSchema.js` | Remove `studentId`/`seat`, fix optionals, add `.passthrough()` |
| `studyPlanResponseSchema.js` | Fix `year` to `z.number()`, add `.passthrough()` |
| `professorResponseSchema.js` | Add missing fields to both profile schemas |
| `assignmentResponseSchema.js` | Add `.passthrough()` |
| `usersResponseSchema.js` | Add missing fields to `ComplaintAdminSchema` |

**Modify existing request schemas (0 files):** No changes needed.

**Modify `genericFetchService.js` (1 file):** Add envelope unwrap logic.

**Create new response schema files (14 files):**
`professorDashboardResponseSchema.js`, `professorGradesResponseSchema.js`, `professorPerformanceResponseSchema.js`, `professorOfferingStudentsResponseSchema.js`, `professorAttendanceResponseSchema.js`, `adminDashboardResponseSchema.js`, `adminReportsResponseSchema.js`, `adminRegistrationStatsResponseSchema.js`, `adminSettingsResponseSchema.js`, `adminUsersResponseSchema.js`, `advisorSessionsResponseSchema.js`, `advisorStudentProgressResponseSchema.js`, `advisorGraduationAuditResponseSchema.js`, `advisorIssuesResponseSchema.js`

**Create new request schema files (6 files):**
`profileSchemas.js`, `settingsSchemas.js`, `semesterSchemas.js`, `departmentSchemas.js`, `issueSchemas.js`, `advisingSessionUpdateSchema.js`

---

## PHASE 8: Frontend — Minor Fixes & Cleanup

- Fix `VITE_API_URL` in `.env.example` from `http://localhost:5173/api` to `http://localhost:5000/api`
- Wire `useProfessor` hook stubs: `loadOfferingStudents` → `fetchOfferingStudents` thunk, `createAssignment` → `addAssignment` thunk
- Remove `// Mock UI Integrations` comment blocks in `professorSlice.js`
- Remove `// Mock Bar Chart` comment in `StudentPerformance.jsx`
- Fix data shape mismatch in `StudentPerformance.jsx` (component reads `performance.students` but API may return different key — align the slice)

---

## Execution Order

1. **Phase 7** — Zod validation revision (schemas + fetchService envelope fix) — must come first because ALL API calls fail validation without this
2. **Phase 1** — Backend missing endpoints (must exist before frontend wiring)
3. **Phase 2** — Remove dummy data infrastructure
4. **Phase 6** — Fix URL bugs (quick wins)
5. **Phase 3** — Professor service + store rewrite
6. **Phase 4** — Admin pages wiring
7. **Phase 5** — Advisor pages + stubs
8. **Phase 8** — Cleanup

---

## Scope Summary

| Category | Count |
|----------|-------|
| New backend files | ~5 |
| Modified backend files | ~14 (including authController logout fix) |
| Deleted frontend files | ~26 (dummyData directory) |
| New frontend response schema files | 14 |
| New frontend request schema files | 6 |
| Modified frontend response schema files | 14 |
| Modified frontend services/thunks/slices/hooks | ~25 |
| Modified frontend pages | ~15 |
| Modified frontend infrastructure | 1 (`genericFetchService.js`) |
| **Total file operations** | **~120** |
