# FrontEndLayer Documentation

This document describes the frontend layer at `FrontEndLayer/`, focusing on structure, data flow, backend interaction, business logic, auth flow, route access, service contracts, and state management.

## 1. Project Structure

- `FrontEndLayer/package.json`: React + Vite project definition.
- `FrontEndLayer/src/index.jsx`: application entry point; renders `App` inside Redux `Provider`.
- `FrontEndLayer/src/App.jsx`: root component that renders router via `RouterProvider`.
- `FrontEndLayer/src/routes/`: routing configuration and access control.
- `FrontEndLayer/src/services/`: backend communication layer and schema validation.
- `FrontEndLayer/src/Schemas/`: Zod request and response schemas.
- `FrontEndLayer/src/hooks/`: custom hooks wrapping Redux state and thunks.
- `FrontEndLayer/src/store/`: Redux Toolkit slices and async thunks.
- `FrontEndLayer/src/pages/`: UI pages organized by role (Auth, Student, Professor, Advisor, Admin, Public).
- `FrontEndLayer/src/shared/`: shared layout and components.
- `FrontEndLayer/src/dummyData/`: mock API interceptor/data for local development mode.

## 2. Routing and Access Control

### Routes

Routes are centralized in `src/routes/RoutePaths.js` and used by `src/routes/AppRoutes.jsx`.

- Public:
  - `/`
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/403`
- Student:
  - `/student/dashboard`
  - `/student/enrollment`
  - `/student/semester-registration`
  - `/student/schedule`
  - `/student/exam-schedule`
  - `/student/transcript`
  - `/student/study-plan`
  - `/student/advising`
  - `/student/complaints`
  - `/student/payments`
  - `/student/attendance`
  - `/student/profile`
  - `/student/notifications`
  - `/student/gpa-calculator`
  - `/student/settings`
- Professor:
  - `/professor/dashboard`
  - `/professor/courses`
  - `/professor/assignments`
  - `/professor/attendance`
  - `/professor/grades`
  - `/professor/students`
  - `/professor/schedule`
  - `/professor/notifications`
- Advisor:
  - `/advisor/dashboard`
  - `/advisor/students`
  - `/advisor/sessions`
  - `/advisor/graduation`
  - `/advisor/issues`
  - `/advisor/student-progress/:id`
- Admin:
  - `/admin/dashboard`
  - `/admin/users`
  - `/admin/courses`
  - `/admin/departments`
  - `/admin/semesters`
  - `/admin/complaints`
  - `/admin/registration`
  - `/admin/reports`
  - `/admin/policies`
  - `/admin/settings`

### ProtectedRoute

Implemented in `src/routes/ProtectedRoute.jsx`.

- Uses `useRoleAccess(allowedRoles)` to verify session state.
- If `loading`, renders a loading view.
- If not authenticated, redirects to `/login`.
- If authenticated but missing required role, redirects to `/403`.
- Otherwise renders the route children.

### Role check behavior

`useRoleAccess` is based on `useAuth()` and checks `allowedRoles.includes(user?.role)`.

- Authentication state is loaded from Redux.
- `user.role` is expected from backend auth response.
- The role check is performed client-side only, so the backend still needs server-side RBAC to enforce.

## 3. State Management and Auth Flow

### Redux Store

Defined in `src/store/store.js`.

Reducers:

- auth
- student
- course
- enrollment
- complaint
- payment
- semester
- advisor
- professor
- admin
- department
- advisingSession
- assignment
- notification
- attendance
- schedule
- exam
- transcript
- studyPlan
- settings

### Auth Flow

`src/hooks/useAuth.js` exposes:

- `user`
- `isAuthenticated`
- `loading`
- `error`
- `forgotPasswordLoading`
- `forgotPasswordSuccess`
- `login(creds)`
- `register(data)`
- `forgotPassword(data)`
- `logout()`
- `checkSession()`
- `clearError()`
- `resetForgotPassword()`

#### Auth thunks

Defined in `src/store/auth/authThunks.js`.

- `login`: calls `authService.loginUser`, stores user and `isAuthenticated=true` on success.
- `register`: calls `authService.registerUser`, stores user and `isAuthenticated=true` on success.
- `forgotPasswordAction`: sends request to forgotten password endpoint.
- `logout`: calls logout endpoint and resets auth state.
- `getMe`: fetches `/auth/me` and restores user session.

#### Auth slice behavior

Defined in `src/store/auth/authSlice.js`.

- Stores `user`, `isAuthenticated`, `loading`, `error`, `forgotPasswordLoading`, `forgotPasswordSuccess`.
- Handles pending/fulfilled/rejected states for auth operations.

#### `useRoleAccess`

Wraps `useAuth` and calculates:

- `isAuthenticated`
- `hasAccess`
- `loading`
- `user`

Used to guard all protected routes.

## 4. API Layer and Schema Contracts

### Generic API client

`src/services/genericFetchService.js` creates an Axios client:

- `baseURL` from `VITE_API_URL` or fallback `http://localhost:5000/api`
- `withCredentials: true`
- Optional dummy API interceptor when `VITE_USE_DUMMY_DATA === 'true'`
- Interceptor redirects to `/login` on 401.

`fetchService(endpoint, options, schema)`:

- Calls Axios
- If `schema` is provided, validates the response using Zod
- Returns `{ success: true, data }` or `{ success: false, error }`
- For `ZodError`, logs and returns validation error message.
- For HTTP/network failure returns backend `error.response.data.message` or `Network Error`.

### Request and Response schema usage

The frontend validates outgoing payloads with Zod request schemas before sending them, and validates incoming server responses with Zod response schemas.

This means the backend should match both request payloads and response structures exactly.

## 5. Auth-related Backend Contract

### Requests

#### Login

- Endpoint: `POST /auth/login`
- Payload: `{ universityId, password }`
- Validated by `LoginRequestSchema`

#### Register

- Endpoint: `POST /auth/register`
- Payload: `{ name, email, universityId, password, confirmPassword, role }`
- Validated by `RegisterRequestSchema`

#### Forgot Password

- Endpoint: `POST /auth/forgot-password`
- Payload: `{ email }`
- Validated by `ForgotPasswordRequestSchema`

#### Change Password

- Endpoint: `POST /auth/change-password`
- Payload: `{ currentPassword, newPassword, confirmPassword }`
- Validated by `ChangePasswordRequestSchema`

### Responses

#### Login / Register / Get Current User

- Expected response schema: `LoginResponseSchema`
- Should return:
  - `user`: object with fields
    - `_id`: string
    - `universityId`: string
    - `email`: string
    - `role`: string
    - `isActive`: boolean (optional)
    - `name`: string (optional)

#### Logout

- Response can be any object, frontend ignores response except success.

#### Forgot Password / Change Password

- Response schema: `MessageResponseSchema`
- Expected: `{ message: string }`

## 6. Student Backend Contract

### Profile

- `GET /students/profile` => `StudentResponseSchema`
- `PATCH /students/profile` => `StudentResponseSchema`

Student model fields:

- `_id`, `userId`, `departmentId`, `advisorId` (nullable)
- `GPA`: number 0-4
- `level`: integer >= 1
- optional `name`, `email`, `universityId`, `departmentName`, `program`

### Settings

- `GET /students/settings` => `SettingsResponseSchema`
- `PUT /students/settings` => `SettingsResponseSchema`

Settings fields:

- `showGpa`: boolean optional
- `preferredLanguage`: string optional

### Dashboard

- `GET /students/dashboard` => `DashboardResponseSchema`

Dashboard fields:

- `student`: `{ GPA: number, level: number, departmentName: string }`
- `currentSemester`: object or null
  - `name`: string
  - `registrationStatus`: string
- `enrolledCourses`: integer
- `pendingPayments`: integer
- `openComplaints`: integer
- `gpaTrend`: optional array of `{ semester: string, gpa: number }`
- `currentCourses`: optional array of `{ code, name, credits, grade }`
- `courseProgress`: optional array of `{ code, name, percent, grade }`

### Enrollment

- `GET /courses/available` => `CourseResponseSchema` (array)
- `GET /courses/:courseId/offerings` => `CourseOfferingsResponseSchema` (array)
- `GET /students/enrollments` => `EnrollmentResponseSchema` (array)
- `POST /enrollments` => no explicit response schema, but request payload validated by `EnrollmentRequestSchema`
- `DELETE /enrollments/:id` => no schema

Enrollment request fields:

- `courseId`: string

Course schema fields:

- `_id`, `code`, `name`, `credits`, `departmentId`

Offering schema fields:

- `_id`, `courseId?`, `professorId?`, `semesterId?`, `schedule?`, `classroom?`, `capacity?`, `enrolledCount?`

Enrollment response item:

- `_id`, `studentId`, `offeringId`, `courseId?`, `status` (`enrolled`, `dropped`, `completed`), `grade` nullable

### Complaints

- `GET /students/complaints` => `ComplaintResponseSchema`
- `POST /complaints` => request payload validated by `ComplaintRequestSchema`

Complaint fields:

- `_id`, `studentId`, `adminId` nullable, `subject`, `description`, `status` (`pending`,`in_progress`,`resolved`,`rejected`), `createdAt` optional

### Payments

- `GET /students/payments` => `PaymentResponseSchema`
- `POST /payments` => request payload validated by `MakePaymentRequestSchema`

Payment fields:

- `_id`, `studentId`, `semesterId`, `semesterName?`, `amount`, `status` enum, `createdAt` optional

### Advising Sessions

- `GET /students/advising-sessions` => `AdvisingSessionResponseSchema`
- `POST /students/advising-sessions` => request payload validated by `AdvisingSessionRequestSchema`

Advising session fields:

- `_id`, `studentId`, `advisorId?`, `semesterId?`, `notes?`, `status` (`scheduled`,`completed`,`cancelled`,`pending`), `createdAt` optional

### Notifications

- `GET /students/notifications` => `NotificationResponseSchema`
- `PATCH /notifications/:id/read` => no schema

Notification fields:

- `_id`, `userId`, `type`, `title`, `message`, `date`, `read`

### Attendance

- `GET /students/attendance` => `AttendanceResponseSchema`

Attendance fields:

- `_id`, `studentId`, `courses`: array of `{ code, name, attended, total, percent }`

### Schedule

- `GET /students/schedule` => `ScheduleResponseSchema`

Schedule item fields:

- `day`, `start`, `end`, `code`, `name`, `room`, `professor`

### Exams

- `GET /students/exams` => `ExamResponseSchema`

Exam item fields:

- `_id`, `studentId`, `courseCode`, `courseName`, `date`, `startTime`, `endTime`, `room`, `seat`, `status`

### Transcript

- `GET /students/transcript` => `TranscriptResponseSchema`

Transcript schema:

- `_id`, `studentId`, `semesters`, optional `program`, `degree`, `department`
- Each semester: `{ name, gpa, totalCredits, courses }`
- Course line: `{ code, name, credits, grade }`

### Study Plan

- `GET /students/study-plan` => `StudyPlanResponseSchema`

Study plan schema:

- `_id`, `studentId`, optional `degreeName`, `departmentName`, `totalRequired`, `years`
- Each year: `{ year, semesters }`
- Each semester: `{ name, courses }`
- Each course: `{ code, name, credits, completed }`

### Registration / GPA Calculation

- `POST /semester-registration` => no schema
- `POST /gpa-calculations` => no schema

## 7. Professor Backend Contract

### Profile and Offerings

- `GET /professors/profile` => `ProfessorProfileSchema`
- `GET /professors/offerings` => `CourseOfferingsResponseSchema`

Professor profile fields:

- `_id`, optional `userId`, optional `departmentId`, optional `title`

### Assignments

- `GET /professors/offerings/:id/assignments` => no schema
- `POST /professors/assignments` => request payload validated by `AssignmentRequestSchema`

Assignment request fields:

- `offeringId`, `title`, `dueDate`, `maxScore`

### Grade submission

- `POST /professors/grades` => request payload validated by `GradeRequestSchema`

Grade request fields:

- `enrollmentId`, `grade`

### Offering students

- `GET /professors/offerings/:id/students` => no schema returned in frontend, but expected list of enrolled students

## 8. Advisor Backend Contract

### Profile

- `GET /advisors/profile` => `AdvisorProfileSchema`

Advisor profile fields:

- `_id`, optional `userId`, optional `departmentId`

### Students and Dashboard

- `GET /advisors/students` => no schema
- `GET /advisors/dashboard` => no schema

### Update sessions

- `PATCH /advisors/sessions/:sessionId` => no response schema

## 9. Admin Backend Contract

### Users / Complaints / Semesters / Departments

- `GET /admin/users` => `UsersResponseSchema`
- `GET /admin/complaints` => `ComplaintsResponseSchema`
- `PATCH /admin/complaints/:complaintId` => no schema
- `GET /semesters` => `SemesterListResponseSchema`
- `GET /semesters/current` => `CurrentSemesterResponseSchema`
- `POST /admin/semesters` => no schema
- `GET /departments` => `DepartmentsResponseSchema`
- `GET /admin/dashboard` => no schema

## 10. Business Logic and Flow

### Authentication and session persistence

- `App` loads routes.
- Protected routes fetch `user` from `useRoleAccess`, which depends on Redux auth state.
- The app expects an authenticated session from `/auth/me` when initialized or on page refresh.
- Client authorization is role-based only in the UI; the backend must enforce the same role restrictions.

### Data validation

- Request bodies are validated by Zod before sending.
- Responses are validated by Zod on receipt, so backend responses must match the selected schema exactly.
- If backend returns invalid data, frontend returns `success: false` from `fetchService`.

### Error handling

- `fetchService` catches network and validation errors.
- For HTTP 401 responses, the interceptor redirects the browser to `/login`.
- Thunks reject with backend error text when `result.success` is false.

### Mock API support

- In `src/services/genericFetchService.js`, `VITE_USE_DUMMY_DATA === 'true'` installs a dummy interceptor from `src/dummyData/dummyApiHandler.js`.
- This mock handler defines request routes and sample data for local testing without a backend.
- Production should use actual backend endpoints matching the same contract.

## 11. Important backend expectations

### Common patterns

- Many frontend services call `/students/*`, `/professors/*`, `/advisors/*`, `/admin/*`.
- The frontend assumes session membership: endpoints for protected routes should only work for the current authenticated user.
- `GET /auth/me` must return the same `LoginResponseSchema` shape used by login/register.

### Role-specific APIs

- Student pages call student-specific routes and also common routes like `/courses/available`.
- Professor pages call profile, offerings, assignments, grade, and offering students endpoints.
- Advisor pages call advisor profile, student list, dashboard stats, and advising session update endpoints.
- Admin pages call user list, complaints, semesters, departments, and dashboard endpoints.

### Data shape contracts

- Request validation is strict; payload omissions or wrong field types will fail before the request is made.
- Response schema validation requires field names and types to match.
- Optional fields in response schemas may be omitted by the backend, but required fields must exist.

## 12. Recommendations for backend implementation

- Mirror the Zod response schemas exactly for all `fetchService` calls that pass a schema.
- Support `withCredentials: true` if using cookies/sessions.
- Enforce role-based access server-side for the same endpoints that the frontend guards.
- Ensure `401` is returned for unauthenticated requests, since the frontend redirects to login on 401.
- For user profile and auth, return `user` object containing `_id`, `universityId`, `email`, `role`, and optionally `name`, `isActive`.

## 13. Page-level backend usage summary

### Student pages

- Dashboard: fetch `/students/dashboard`
- Enrollment: fetch `/courses/available`, `/courses/:id/offerings`, `/students/enrollments`, `POST /enrollments`, `DELETE /enrollments/:id`
- Registration: POST `/semester-registration`
- Schedule: GET `/students/schedule`
- Exam schedule: GET `/students/exams`
- Transcript: GET `/students/transcript`
- Study plan: GET `/students/study-plan`
- Advising: GET `/students/advising-sessions`, POST `/students/advising-sessions`
- Complaints: GET `/students/complaints`, POST `/complaints`
- Payments: GET `/students/payments`, POST `/payments`
- Attendance: GET `/students/attendance`
- Profile: GET `/students/profile`, PATCH `/students/profile`
- Notifications: GET `/students/notifications`, PATCH `/notifications/:id/read`
- Settings: GET `/students/settings`, PUT `/students/settings`

### Professor pages

- Dashboard: GET `/professors/profile`, GET `/professors/offerings`
- Courses: GET `/professors/offerings`
- Assignments: GET `/professors/offerings/:id/assignments`, POST `/professors/assignments`
- Attendance: GET `/professors/offerings`, GET `/professors/offerings/:id/students`
- Grades: GET `/professors/offerings`, GET `/professors/offerings/:id/students`, POST `/professors/grades`
- Student performance: GET offerings and offering students
- Schedule: GET `/professors/offerings`
- Notifications: likely frontend-only or shared notifications endpoint not explicitly defined in this service layer.

### Advisor pages

- Dashboard: GET `/advisors/dashboard`
- Student list: GET `/advisors/students`
- Sessions: GET `/students/advising-sessions` or advisor-specific endpoint and PATCH `/advisors/sessions/:sessionId`
- Graduation requirements / issue resolution / student progress: likely use advisor dashboard or student endpoint data.

### Admin pages

- Users management: GET `/admin/users`
- Course management: likely GET `/courses/available` and other course endpoints not explicitly defined
- Department management: GET `/departments`
- Semester configuration: GET `/semesters`, GET `/semesters/current`, POST `/admin/semesters`
- Complaint management: GET `/admin/complaints`, PATCH `/admin/complaints/:complaintId`
- Registration control: POST `/semester-registration`
- Reports: GET `/admin/dashboard`
- Academic policies, system settings: no explicit backend service defined; may be frontend-only or not implemented yet.

---

This documentation should be used as the backend contract reference: all protected endpoints, request payloads, response shapes, role checks, and business logic assumptions are defined here.
