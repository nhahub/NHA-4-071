# Morshed University Management System — Technical Explanation

---

## Frontend

### Architecture
- **Framework**: React 18 with Vite build tool
- **Routing**: React Router v7 (createBrowserRouter) with nested layout routes
- **State**: Redux Toolkit (21 domain slices) with createAsyncThunk for all API calls
- **Styling**: Tailwind CSS 4 with utility-first approach
- **HTTP Client**: Axios with interceptors for auth token injection and 401 redirect
- **Validation**: Zod schemas for both request (form) and response (API) validation — 13 request + 36 response schemas
- **Charts**: Recharts for analytics dashboards
- **Icons**: Lucide React icon library

### Modular Structure
```
src/
├── pages/           # 37 page components grouped by role
│   ├── Student/     # 14 pages
│   ├── Professor/   # 8 pages
│   ├── Advisor/     # 6 pages
│   ├── Admin/       # 10 pages (with 7 sub-components)
│   ├── Auth/        # 3 pages
│   └── Public/      # 3 pages
├── shared/          # 15 reusable UI components
├── store/           # 21 Redux slices
├── hooks/           # 21 custom hooks (one per domain)
├── services/        # 6 API service modules
├── Schemas/         # Zod schemas (request + response)
└── routes/          # AppRoutes, ProtectedRoute, RoutePaths
```

---

### Student Pages (14)

| Page | Description | Key Data Displayed |
|------|-------------|-------------------|
| **Dashboard** | Home screen with GPA, enrolled courses, exams, notifications, payment status | GPA (computed from enrollments), course list, upcoming exams, recent notifications, payment summary |
| **Semester Registration** | Register for current semester courses | Available offerings, study plan progress, registration info |
| **Schedule** | Weekly class timetable | Course names, times, locations per day |
| **Exam Schedule** | Exam dates for enrolled courses | Date, time, room, exam type for each enrolled offering |
| **Transcript** | Full academic transcript with per-semester breakdown | Courses, grades, credits, GPA per semester, cumulative |
| **Study Plan** | Multi-year degree plan | Year/semester breakdown, completed/pending courses, degree progress |
| **Advising** | Request and view advising sessions | Advisor info, session history, create new session requests |
| **Complaints** | Submit and track complaints | Subject, description, status timeline, admin assignment |
| **Payments** | Tuition fee management | Amount due, payment status, history, make payment |
| **Attendance** | Course attendance records | Per-course attendance percentages, date-by-date records |
| **Profile** | Personal information | Name, email, department, advisor, GPA, level, program |
| **Notifications** | System notifications | Notification list by type (urgent/academic/info/system), read/unread |
| **GPA Calculator** | GPA simulation tool | Input grades per course, calculate hypothetical GPA |
| **Settings** | Preference configuration | Show GPA toggle, preferred language |

### Professor Pages (8)

| Page | Description | Key Interactions |
|------|-------------|-----------------|
| **Dashboard** | Teaching overview | Courses taught, student counts, recent activity |
| **My Courses** | Assigned course offerings | Offering list with schedule, classroom, enrolled count |
| **Assignments** | Create and manage assignments | Title, due date, max score per offering |
| **Attendance** | Mark student attendance | Per-date recording with present/absent/late per student |
| **Grades** | Submit student grades | Letter grade submission (A, A-, B+, ..., F) per enrollment |
| **Student Performance** | Analytics view | Grades and attendance across students per offering |
| **Schedule** | Weekly teaching timetable | Course offerings by day/time |
| **Notifications** | System notifications | Grade deadlines, course updates |

### Advisor Pages (6)

| Page | Description | Key Interactions |
|------|-------------|-----------------|
| **Dashboard** | Overview | Total assigned students, at-risk count |
| **Student List** | Assigned students | Searchable list with department, level, GPA |
| **Advising Sessions** | Session management | Create, view, update sessions with notes and status |
| **Student Progress** | Detailed student view | Grades per course, attendance records, course completion |
| **Graduation Audit** | Degree requirements check | Completed vs required credits, course coverage |
| **Issue Resolution** | Complaint management | View assigned complaints, update status/resolution |

### Admin Pages (10)

| Page | Description | Key Interactions |
|------|-------------|-----------------|
| **Dashboard** | System KPIs | User counts, enrollment stats, complaint counts, revenue |
| **User Management** | CRUD all users | Create/edit users, assign roles, activate/deactivate |
| **Course Management** | Course catalog management | Create/edit courses with code, name, credits, department |
| **Department Management** | Department configuration | Add/update departments |
| **Semester Configuration** | Academic term management | Create semesters, control registration status lifecycle |
| **Complaint Management** | Global complaint administration | View all complaints, assign to admin, update status |
| **Registration Control** | Manual enrollment + stats | Enroll students in courses, registration analytics |
| **Reports & Analytics** | System-wide data | User distribution, GPA by department, enrollment trends |
| **Academic Policies** | Policy configuration | Max credits, GPA thresholds, registration dates |
| **System Settings** | Global configuration | Key-value settings (academic year, fees, etc.) |

### Shared Components (15)

| Component | Purpose |
|-----------|---------|
| `DashboardLayout` | Main authenticated layout (sidebar + header + content area) |
| `DashboardSidebar` | Role-aware navigation sidebar (links from roleNavConfig) |
| `DashboardHeader` | Top bar with page title, search, notification bell, user dropdown |
| `DataTable` | Generic table with column config, sorting, row clicks |
| `KPICard` | Metric card with label, value, progress indicator |
| `PageHeader` | Page title + subtitle + action buttons |
| `StatusBadge` | Color-coded status (pending/green, in_progress/blue, resolved/amber, etc.) |
| `NotificationBell` | Dropdown notification list with unread count |
| `EmptyState` | Placeholder for empty data states |
| `LoadingSkeleton` | Loading animation placeholder |
| `CircularProgress` | Circular progress indicator |
| `ProgressBar` | Horizontal completion bar |
| `AlertItem` | Individual alert/notification display |
| `AdvisorCard` | Advisor profile card |
| `SessionCard` | Advising session summary card |

### State Management (Redux Slices)

21 slices following a consistent pattern:
- **auth**: login/logout/register/getMe lifecycle, tokens, user object
- **student**, **professor**, **advisor**, **admin**: role-specific data
- **course**, **enrollment**, **semester**, **department**: academic entities
- **complaint**, **payment**: financial and issue tracking
- **advisingSession**, **assignment**, **attendance**, **exam**: session-level data
- **notification**, **transcript**, **studyPlan**, **schedule**, **settings**: user-facing features

Each slice exports `createAsyncThunk` actions and handles `pending/fulfilled/rejected` states for loading/error UX.

### Custom Hooks (21)

Each hook (e.g., `useAuth`, `useStudent`, `useCourse`) encapsulates `useDispatch` + `useSelector` patterns, exposing domain-specific actions and state. Example pattern from `useAuth`:
```js
const { user, isAuthenticated, loading, error, login, logout } = useAuth();
```

---

## Backend

### Architecture Pattern: Layered MVC + Service Layer

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Routes   │────▶│ Controllers  │────▶│   Services   │────▶│  Models  │
│ (routes/) │     │(controllers/)│     │ (services/)  │     │(models/) │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘
                                                              │
                                                        ┌─────▼──────┐
                                                        │ MongoDB    │
                                                        │ (Mongoose) │
                                                        └────────────┘
```

### Middleware Pipeline

```
Request → helmet → cors → express.json(10kb) → cookie-parser → rate-limit
  → protect (JWT verify) → authorize(roles) → validate(zod schema)
  → Controller → Service → Response
```

### Authentication Flow

1. **Register** (`POST /api/auth/register`): Creates User document with hashed password (bcrypt, salt rounds: 12). Can optionally create Student/Professor/Advisor profile in same transaction
2. **Login** (`POST /api/auth/login`): Validates universityId + password → generates JWT access token (15 min, payload: `{id, role}`) + refresh token (7 days, HttpOnly cookie) → stores refresh token hash in user document
3. **Authorization**: `protect` middleware extracts Bearer token, verifies JWT, attaches `req.user`. `authorize('student','professor')` checks role membership
4. **Forgot/Reset Password**: Token-based reset with SHA256 hashed tokens stored in user document (1-hour expiry)

### API Endpoints

#### Auth (`/api/auth`) — 7 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |
| POST | `/forgot-password` | Public |
| POST | `/reset-password` | Public |
| GET | `/me` | Authenticated |
| POST | `/logout` | Authenticated |
| POST | `/change-password` | Authenticated |

#### Student (`/api/students`) — 17 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/dashboard` | Student |
| GET | `/profile` | Student |
| PATCH | `/profile` | Student |
| GET | `/settings` | Student |
| PUT | `/settings` | Student |
| GET | `/courses` | Student |
| GET | `/schedule` | Student |
| GET | `/grades` | Student |
| GET | `/payments` | Student |
| GET | `/enrollments` | Student |
| GET | `/complaints` | Student |
| GET | `/advising-sessions` | Student |
| POST | `/advising-sessions` | Student |
| GET | `/notifications` | Student |
| GET | `/attendance` | Student |
| GET | `/exams` | Student |
| GET | `/transcript` | Student |
| GET | `/study-plan` | Student |
| POST | `/semester-registration` | Student |
| GET | `/semester-registration/info` | Student |
| POST | `/gpa-calculations` | Student |

#### Professor (`/api/professors`) — 14 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/dashboard` | Professor |
| GET | `/grades-overview` | Professor |
| GET | `/performance` | Professor |
| GET | `/profile` | Professor |
| PATCH | `/profile` | Professor |
| GET | `/notifications` | Professor |
| GET | `/schedule` | Professor |
| GET | `/offerings` | Professor |
| GET | `/offerings/:offeringId/students` | Professor |
| GET | `/offerings/:offeringId/assignments` | Professor |
| POST | `/assignments` | Professor |
| POST | `/offerings/:offeringId/attendance` | Professor |
| GET | `/offerings/:offeringId/attendance` | Professor |
| POST | `/grades` | Professor |

#### Advisor (`/api/advisors`) — 11 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/profile` | Advisor |
| PATCH | `/profile` | Advisor |
| GET | `/dashboard` | Advisor |
| GET | `/students` | Advisor |
| POST | `/sessions` | Advisor |
| GET | `/sessions` | Advisor |
| PATCH | `/sessions/:sessionId` | Advisor |
| GET | `/student-progress/:studentId` | Advisor |
| GET | `/graduation/:studentId` | Advisor |
| GET | `/issues` | Advisor |
| PATCH | `/issues/:issueId` | Advisor |

#### Admin (`/api/admin`) — 13 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/dashboard` | Admin |
| POST | `/semesters` | Admin |
| POST | `/courses` | Admin |
| GET | `/users` | Admin |
| PATCH | `/users/:id` | Admin |
| GET | `/complaints` | Admin |
| PATCH | `/complaints/:complaintId` | Admin |
| PATCH | `/semesters/:id` | Admin |
| POST | `/semester-registration` | Admin |
| GET | `/settings` | Admin |
| PUT | `/settings` | Admin |
| GET | `/reports` | Admin |
| GET | `/registration-stats` | Admin |

#### University (`/api/`) — 8 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/departments` | Admin |
| GET | `/departments` | Authenticated |
| POST | `/semesters` | Admin |
| GET | `/semesters` | Authenticated |
| GET | `/semesters/current` | Authenticated |
| POST | `/courses` | Admin |
| GET | `/courses/available` | Authenticated |
| POST | `/offerings` | Admin |

#### Enrollments (`/api/enrollments`) — 4 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/` | Student |
| GET | `/my` | Student |
| DELETE | `/:id` | Student |
| POST | `/recalibrate` | Admin |

#### Payments (`/api/payments`) — 3 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/summary` | Student |
| POST | `/` | Student |
| GET | `/` | Student |

#### Complaints (`/api/complaints`) — 2 endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/` | Student |
| GET | `/` | Student |

### Database Models (20 Mongoose Schemas)

| Model | Key Fields | Relationships |
|-------|-----------|--------------|
| **User** | universityId, email, password (hashed), name, role, isActive, refreshToken, resetPasswordToken | Parent to Student/Professor/Advisor/Admin |
| **Student** | userId, departmentId, advisorId, GPA, level, program, settings {showGpa, preferredLanguage} | 1-to-1 User, N-to-1 Department, N-to-1 Advisor |
| **Professor** | userId, departmentId, title | 1-to-1 User, N-to-1 Department |
| **Advisor** | userId, departmentId, title | 1-to-1 User, N-to-1 Department |
| **Admin** | userId | 1-to-1 User |
| **Department** | name, code (unique) | Parent to Course, Student, Professor, Advisor |
| **Semester** | name, code, registrationStatus (enum), startDate, endDate | Parent to CourseOffering, Enrollment, Exam |
| **Course** | code, name, credits, departmentId | N-to-1 Department |
| **CourseOffering** | courseId, professorId, semesterId, schedule, classroom, capacity, enrolledCount | Links Course + Professor + Semester |
| **Enrollment** | studentId, offeringId, courseId, status, grade | Unique (studentId + offeringId). Tracks academic history |
| **Assignment** | offeringId, title, dueDate, maxScore | N-to-1 CourseOffering |
| **Attendance** | offeringId, date, records[{studentId, status}] | Unique (offeringId + date). Embedded subdocuments for students |
| **Exam** | offeringId, courseId, semesterId, date, startTime, endTime, room, type | Links Offering + Course + Semester |
| **Payment** | studentId, semesterId, amount, description, paymentMethod, transactionId, status, paidAt, dueDate | Tracks tuition lifecycle per student per semester |
| **Complaint** | studentId, adminId, subject, description, status | Tracks issue lifecycle with admin assignment |
| **AdvisingSession** | studentId, advisorId, semesterId, notes, status | Tracks advisor meetings |
| **Notification** | userId, type, title, message, read | User-targeted messages |
| **StudyPlan** | studentId, degreeName, totalRequired, years (embedded) | Per-student degree plan with deeply nested structure |
| **SemesterRegistration** | studentId, semesterId, registeredAt | Unique (studentId + semesterId) |
| **Setting** | key (unique), value (Mixed) | Global key-value configuration |

### Key Business Logic

**GPA Computation** (`studentService.js`):
- Queries all enrollments with `completed` status and non-null grade
- Uses grade-to-point mapping: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0.0
- Formula: `SUM(gradePoint × courseCredits) / SUM(courseCredits)`
- GPA is computed dynamically (not stored) via `computeGPA()` function

**Transcript Generation** (`studentService.js`):
- Groups all enrollments by semester
- Computes per-semester GPA using the same formula
- Returns structured data: semesters → courses → grades + GPA

**Enrollment Capacity Management**:
- CourseOffering has `capacity` and `enrolledCount` fields
- Enrollment controller checks capacity before allowing new enrollment
- Dropping a course decrements `enrolledCount`
- Admin can recalibrate counts via `/api/enrollments/recalibrate`

**Complaint Lifecycle**:
- Student submits → status: "pending", adminId: null
- Admin assigns complaint → adminId set, status can change to "in_progress"
- Advisor/Admin resolves → status: "resolved" or "rejected"
- Advisors see complaints where `adminId == theirUserId` via `/api/advisors/issues`

**Semester Registration Lifecycle**:
- Semesters have `registrationStatus`: upcoming → open → closed → ongoing → ended
- Students can only register when status is "open"
- Admin controls the status transitions

### Security

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcryptjs with 12 salt rounds |
| JWT signing | Two separate secrets (JWT_SECRET, REFRESH_TOKEN_SECRET) |
| Rate limiting | 10 requests/second on auth routes |
| HTTP security | Helmet middleware (CSP, XSS, frame guard, etc.) |
| CORS | Configured for frontend origin only |
| Input validation | Zod schemas on all request bodies |
| Field exclusion | Password and refreshToken have `select: false` |
| HttpOnly cookies | Refresh token stored in cookie (XSS-safe) |

### Validation Layer (Zod)

10 validation files in `/validations/`:
- `authValidation.js`: login, register, forgotPassword, resetPassword, changePassword schemas
- `studentValidation.js`: profile update, settings update, semester registration
- `professorValidation.js`: profile update, assignments, attendance, grades
- `advisorValidation.js`: profile update, sessions, issues
- `adminValidation.js`: user management, complaints, semesters, settings
- Plus validation for courses, enrollments, payments, complaints, university entities

### Data Transfer Objects (DTOs)

4 DTO files in `/dto/`:
- `authDTO.js`: Standardized auth response shape
- `enrollmentDTO.js`: Enrollment data transformation
- `paymentDTO.js`: Payment response formatting
- `studentDTO.js`: Student profile and settings formatting

### Utilities

| File | Purpose |
|------|---------|
| `jwtUtils.js` | Generate access token + refresh token with configurable expiry |
| `responseFormatter.js` | Standard `{ success, data, message }` response helpers |

### Seed Data

`seedData.js` — Comprehensive database seeder with `--reset` mode:
- 7 departments, 3 semesters, 45 courses, 90 course offerings (F24 + S25)
- 12 students, 7 professors, 3 advisors, 1 admin user
- Realistic enrollments with F24 grades + S25 enrolled courses + dropped examples
- Advising sessions, attendance records (79 entries), assignments (11), exams (56)
- Complaints (6 with advisor assignment), notifications (10), payments (18)
- System settings (10), study plans (3), semester registrations (12)
- All accounts use common password `Test@123`; admin uses `password123`

---

## Deployment

### Backend (Vercel Serverless)
```
vercel.json → routes all traffic → api/index.js → connectDB() → app (Express)
```
- Single serverless function handles all API routes
- MongoDB Atlas connection established on cold start
- Environment variables: MONGO_URI, JWT_SECRET, REFRESH_TOKEN_SECRET, CLIENT_URL

### Frontend (Vite Static Build)
```
vite build → dist/ → deploy to Vercel/Netlify as SPA
```
- Environment variable: `VITE_API_URL` pointing to deployed backend
- Client-side routing with React Router (fallback to index.html)
