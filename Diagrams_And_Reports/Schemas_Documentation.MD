# Frontend Schemas Documentation

This document describes the request and response schemas used in the frontend layer under `FrontEndLayer/src/Schemas`. These schemas are defined using `zod` and represent the expected shape of payloads sent to, and received from, backend endpoints.

## Request Schemas

### `authSchemas.js`

#### `LoginRequestSchema`
- `universityId`: string, required
- `password`: string, required, minimum 6 characters

#### `RegisterRequestSchema`
- `name`: string, required
- `email`: string, required, must be a valid email
- `universityId`: string, required
- `password`: string, required, minimum 6 characters
- `confirmPassword`: string, required
- `role`: enum, required, one of `student`, `professor`, `advisor`, `admin`
- refinement: `password` and `confirmPassword` must match

#### `ForgotPasswordRequestSchema`
- `email`: string, required, must be a valid email

#### `ChangePasswordRequestSchema`
- `currentPassword`: string, required
- `newPassword`: string, required, minimum 6 characters
- `confirmPassword`: string, required
- refinement: `newPassword` and `confirmPassword` must match

### `assignmentSchemas.js`

#### `AssignmentRequestSchema`
- `offeringId`: string, required
- `title`: string, required, maximum 200 characters
- `dueDate`: string, required
- `maxScore`: integer number, required, minimum 1

### `advisingSessionSchemas.js`

#### `AdvisingSessionRequestSchema`
- `studentId`: string, required
- `semesterId`: string, required
- `notes`: string, optional (defaults to empty string)

### `complaintSchemas.js`

#### `ComplaintRequestSchema`
- `subject`: string, required, maximum 200 characters
- `description`: string, required, minimum 10 characters, maximum 2000 characters

### `enrollmentSchemas.js`

#### `EnrollmentRequestSchema`
- `courseId`: string, required

### `gradeSchemas.js`

#### `GradeRequestSchema`
- `enrollmentId`: string, required
- `grade`: string, required

### `paymentSchemas.js`

#### `MakePaymentRequestSchema`
- `semesterId`: string, required
- `amount`: number, required, must be positive


## Response Schemas

### `authResponseSchema.js`

#### `UserSchema`
- `_id`: string, required
- `universityId`: string, required
- `email`: string, required, valid email
- `role`: string, required
- `isActive`: boolean, optional
- `name`: string, optional
- passthrough: additional properties allowed

#### `LoginResponseSchema`
- `user`: `UserSchema`
- passthrough: additional properties allowed

#### `MessageResponseSchema`
- `message`: string, required
- passthrough: additional properties allowed

### `studentResponseSchema.js`

#### `StudentResponseSchema`
- `_id`: string, required
- `userId`: string, required
- `departmentId`: string, required
- `advisorId`: string or null, required
- `GPA`: number, required, range 0 to 4
- `level`: integer number, required, minimum 1
- `name`: string, optional
- `email`: string, optional
- `universityId`: string, optional
- `departmentName`: string, optional
- `program`: string, optional

### `professorResponseSchema.js`

#### `ProfessorProfileSchema`
- `_id`: string, required
- `userId`: string, optional
- `departmentId`: string, optional
- `title`: string, optional
- passthrough: additional properties allowed

#### `AdvisorProfileSchema`
- `_id`: string, required
- `userId`: string, optional
- `departmentId`: string, optional
- passthrough: additional properties allowed

### `courseResponseSchema.js`

#### `CourseSchema`
- `_id`: string, required
- `code`: string, required
- `name`: string, required
- `credits`: integer number, required
- `departmentId`: string, required

#### `CourseResponseSchema`
- array of `CourseSchema`

### `departmentResponseSchema.js`

#### `DepartmentSchema`
- `_id`: string, required
- `name`: string, optional
- `code`: string, optional
- passthrough: additional properties allowed

#### `DepartmentsResponseSchema`
- array of `DepartmentSchema`

### `semesterResponseSchema.js`

#### `SemesterSchema`
- `_id`: string, required
- `name`: string, optional
- `code`: string, optional
- `registrationStatus`: string, optional
- `startDate`: string, optional
- `endDate`: string, optional
- passthrough: additional properties allowed

#### `SemesterListResponseSchema`
- array of `SemesterSchema`

#### `CurrentSemesterResponseSchema`
- `SemesterSchema`

### `scheduleResponseSchema.js`

#### `ScheduleItemSchema`
- `day`: string, required
- `start`: string, required
- `end`: string, required
- `code`: string, required
- `name`: string, required
- `room`: string, required
- `professor`: string, required

#### `ScheduleResponseSchema`
- array of `ScheduleItemSchema`

### `paymentResponseSchema.js`

#### `PaymentItemSchema`
- `_id`: string, required
- `studentId`: string, required
- `semesterId`: string, required
- `semesterName`: string, optional
- `amount`: number, required
- `status`: enum, one of `pending`, `paid`, `overdue`, required
- `createdAt`: string, optional

#### `PaymentResponseSchema`
- array of `PaymentItemSchema`

### `offeringResponseSchema.js`

#### `CourseOfferingSchema`
- `_id`: string, required
- `courseId`: string, optional
- `professorId`: string, optional
- `semesterId`: string, optional
- `schedule`: string, optional
- `classroom`: string, optional
- `capacity`: number, optional
- `enrolledCount`: number, optional
- passthrough: additional properties allowed

#### `CourseOfferingsResponseSchema`
- array of `CourseOfferingSchema`

### `notificationResponseSchema.js`

#### `NotificationItemSchema`
- `_id`: string, required
- `userId`: string, required
- `type`: string, required
- `title`: string, required
- `message`: string, required
- `date`: string, required
- `read`: boolean, required

#### `NotificationResponseSchema`
- array of `NotificationItemSchema`

### `examResponseSchema.js`

#### `ExamItemSchema`
- `_id`: string, required
- `studentId`: string, required
- `courseCode`: string, required
- `courseName`: string, required
- `date`: string, required
- `startTime`: string, required
- `endTime`: string, required
- `room`: string, required
- `seat`: string, required
- `status`: string, required

#### `ExamResponseSchema`
- array of `ExamItemSchema`

### `enrollmentResponseSchema.js`

#### `EnrollmentItemSchema`
- `_id`: string, required
- `studentId`: string, required
- `offeringId`: string, required
- `courseId`: string, optional
- `status`: enum, one of `enrolled`, `dropped`, `completed`, required
- `grade`: string or null, required

#### `EnrollmentResponseSchema`
- array of `EnrollmentItemSchema`

### `attendanceResponseSchema.js`

#### `AttendanceCourseSchema`
- `code`: string, required
- `name`: string, required
- `attended`: number, required
- `total`: number, required
- `percent`: number, required

#### `AttendanceResponseSchema`
- `_id`: string, required
- `studentId`: string, required
- `courses`: array of `AttendanceCourseSchema`, required

### `assignmentResponseSchema.js`

#### `AssignmentResponseSchema`
- `_id`: string, required
- `offeringId`: string, required
- `title`: string, required
- `dueDate`: string, required
- `maxScore`: integer number, required

### `complaintResponseSchema.js`

#### `ComplaintItemSchema`
- `_id`: string, required
- `studentId`: string, required
- `adminId`: string or null, required
- `subject`: string, required
- `description`: string, required
- `status`: enum, one of `pending`, `in_progress`, `resolved`, `rejected`, required
- `createdAt`: string, optional

#### `ComplaintResponseSchema`
- array of `ComplaintItemSchema`

### `advisingSessionResponseSchema.js`

#### `AdvisingSessionItemSchema`
- `_id`: string, required
- `studentId`: string, required
- `advisorId`: string, optional
- `semesterId`: string, optional
- `notes`: string, optional
- `status`: enum, one of `scheduled`, `completed`, `cancelled`, `pending`, required
- `createdAt`: string, optional

#### `AdvisingSessionResponseSchema`
- array of `AdvisingSessionItemSchema`

### `dashboardResponseSchema.js`

#### `DashboardResponseSchema`
- `student`: object
  - `GPA`: number, required
  - `level`: number, required
  - `departmentName`: string, required
- `currentSemester`: object or null
  - `name`: string, required
  - `registrationStatus`: string, required
- `enrolledCourses`: integer number, required
- `pendingPayments`: integer number, required
- `openComplaints`: integer number, required
- `gpaTrend`: optional array of objects, default `[]`
  - `semester`: string, required
  - `gpa`: number, required
- `currentCourses`: optional array of objects, default `[]`
  - `code`: string, required
  - `name`: string, required
  - `credits`: number, required
  - `grade`: string, required
- `courseProgress`: optional array of objects, default `[]`
  - `code`: string, required
  - `name`: string, required
  - `percent`: number, required
  - `grade`: string, required

### `studyPlanResponseSchema.js`

#### `PlanCourseSchema`
- `code`: string, required
- `name`: string, required
- `credits`: number, required
- `completed`: boolean, required

#### `PlanSemesterSchema`
- `name`: string, required
- `courses`: array of `PlanCourseSchema`, required

#### `PlanYearSchema`
- `year`: string, required
- `semesters`: array of `PlanSemesterSchema`, required

#### `StudyPlanResponseSchema`
- `_id`: string, required
- `studentId`: string, required
- `degreeName`: string, optional
- `departmentName`: string, optional
- `totalRequired`: number, optional
- `years`: array of `PlanYearSchema`, required

### `transcriptResponseSchema.js`

#### `TranscriptCourseSchema`
- `code`: string, required
- `name`: string, required
- `credits`: number, required
- `grade`: string, required

#### `SemesterSchema`
- `name`: string, required
- `gpa`: number, required
- `totalCredits`: number, required
- `courses`: array of `TranscriptCourseSchema`, required

#### `TranscriptResponseSchema`
- `_id`: string, required
- `studentId`: string, required
- `semesters`: array of `SemesterSchema`, required
- `program`: string, optional
- `degree`: string, optional
- `department`: string, optional
- passthrough: additional properties allowed

### `settingsResponseSchema.js`

#### `SettingsResponseSchema`
- `showGpa`: boolean, optional
- `preferredLanguage`: string, optional
- passthrough: additional properties allowed
