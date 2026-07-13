# Morshed University Management System

## Project Overview
A full-stack university management platform connecting students, professors, advisors, and administrators through a unified digital ecosystem. The system handles the complete academic lifecycle — from admission through graduation — including course enrollment, grade management, advising, payments, and administrative oversight.

---

## Tech Stack
- **Frontend**: React 18, Redux Toolkit, React Router v7, Tailwind CSS 4, Vite, Axios, Zod, Recharts, Lucide React
- **Backend**: Node.js, Express 5, Mongoose, MongoDB Atlas, JWT, bcryptjs, Zod, Helmet, CORS, Rate Limiting
- **Deployment**: Vercel (backend serverless), Vite build (frontend static)

---

## User Roles & Features (User Stories)

### 🧑‍🎓 Student (14 features)

| # | User Story |
|---|-----------|
| 1 | As a student, I want a **dashboard** so I can see my current GPA, enrolled courses, upcoming exams, recent notifications, and payment status at a glance |
| 2 | As a student, I want to **register for semesters** so I can enroll in available courses each term |
| 3 | As a student, I want to browse the **course catalog** so I can see what courses are offered in the current semester |
| 4 | As a student, I want a **weekly schedule** so I can view my class timings and locations |
| 5 | As a student, I want an **exam schedule** so I can prepare for midterms and finals with dates, times, and rooms |
| 6 | As a student, I want to view my **grades and transcript** so I can track my academic performance and cumulative GPA per semester |
| 7 | As a student, I want a **study plan** so I can see my multi-year degree requirements and track completed courses |
| 8 | As a student, I want to **request advising sessions** so I can get academic guidance from my assigned advisor |
| 9 | As a student, I want to **submit complaints** so I can report issues like grade disputes or registration conflicts and track their resolution |
| 10 | As a student, I want to view and **pay tuition fees** so I can manage my financial obligations and see payment history |
| 11 | As a student, I want to view my **attendance records** so I can monitor my presence across courses |
| 12 | As a student, I want a **GPA calculator** so I can simulate different grade scenarios |
| 13 | As a student, I want to manage my **profile and settings** so I can update personal info and configure preferences (show GPA, language) |
| 14 | As a student, I want **notifications** so I can stay informed about grades, deadlines, and system updates |

### 👨‍🏫 Professor (8 features)

| # | User Story |
|---|-----------|
| 1 | As a professor, I want a **dashboard** so I can see an overview of my courses, student counts, and recent activity |
| 2 | As a professor, I want to view **my assigned courses** so I can see which offerings I am teaching each semester |
| 3 | As a professor, I want to **create and manage assignments** so I can set tasks with due dates and max scores for each course |
| 4 | As a professor, I want to **mark attendance** so I can record student presence (present/absent/late) per class date |
| 5 | As a professor, I want to **submit and update grades** so I can evaluate student performance with letter grades |
| 6 | As a professor, I want to view **student performance** so I can analyze grades and attendance across enrolled students |
| 7 | As a professor, I want a **weekly schedule** so I can see my teaching times and classrooms |
| 8 | As a professor, I want **notifications** so I can receive grade submission deadlines and course updates |

### 🧑‍🏫 Advisor (6 features)

| # | User Story |
|---|-----------|
| 1 | As an advisor, I want a **dashboard** so I can see total assigned students and at-risk counts |
| 2 | As an advisor, I want to view **my assigned students** so I can search and review their profiles |
| 3 | As an advisor, I want to **manage advising sessions** so I can create, update, and track meetings with students |
| 4 | As an advisor, I want to view **student progress** so I can see detailed grades, attendance, and course completion per student |
| 5 | As an advisor, I want to run a **graduation audit** so I can check if a student meets degree requirements |
| 6 | As an advisor, I want to **resolve student issues** so I can view and respond to complaints assigned to me |

### 🛡️ Admin (10 features)

| # | User Story |
|---|-----------|
| 1 | As an admin, I want a **dashboard** so I can see system-wide KPIs — user counts, enrollment stats, open complaints, and financial overview |
| 2 | As an admin, I want to **manage users** so I can create, update, and deactivate student, professor, and advisor accounts |
| 3 | As an admin, I want to **manage courses** so I can create and update the course catalog with codes, names, credits, and departments |
| 4 | As an admin, I want to **manage departments** so I can add and update academic departments |
| 5 | As an admin, I want to **configure semesters** so I can create academic terms and control registration status (upcoming/open/closed/ongoing/ended) |
| 6 | As an admin, I want to **manage complaints** so I can view all student complaints, assign them to staff, and update their status |
| 7 | As an admin, I want **registration control** so I can manually enroll students and view registration statistics |
| 8 | As an admin, I want **reports and analytics** so I can see system-wide data including GPA distribution by department |
| 9 | As an admin, I want to configure **academic policies** so I can set rules like max credits per semester and GPA thresholds |
| 10 | As an admin, I want **system settings** so I can configure global application values |

---

## Cross-Cutting Features

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT dual-token strategy (access + refresh). Login with university ID + password. Registration, forgot/reset password, change password |
| **Role-Based Access** | Middleware-enforced route protection. Frontend dynamic navigation per role. 403 handling for unauthorized access |
| **Notifications** | System-wide notification system with types (urgent/academic/info/system). Read/unread tracking per user |
| **Data Validation** | Zod schemas on both frontend (form + response) and backend (request). End-to-end type safety |
| **State Management** | Redux Toolkit with 21 domain slices. Async thunks for all API calls. Loading/error states throughout |
| **Responsive UI** | Tailwind CSS utility-first design. Shared component library (15 reusable components). Charts with Recharts |

---

## Database Schema (20 Collections)

`users` → `students` (1-to-1) | `professors` (1-to-1) | `advisors` (1-to-1) | `admins` (1-to-1)
`departments` → `courses` | `students` | `professors` | `advisors`
`semesters` → `courseofferings` → `enrollments` | `assignments` | `attendance` | `exams`
`enrollments` tracks: student, offering, status (enrolled/dropped/completed), grade (A-F)
`payments` tracks: tuition per student per semester with status lifecycle (pending/paid/overdue)
`complaints` tracks: student issues with admin assignment and status workflow (pending/in_progress/resolved/rejected)
`advising sessions` tracks: advisor-student meetings per semester
`notifications`: user-targeted messages with read tracking
`semester registrations`: student semester enrollment tracking
`settings`: global key-value configuration store

---

## API Surface (~85 endpoints)

| Category | Count | Base Path |
|----------|-------|-----------|
| Auth | 7 | `/api/auth` |
| University | 8 | `/api/` |
| Courses | 3 | `/api/courses` |
| Students | 17 | `/api/students` |
| Professors | 14 | `/api/professors` |
| Advisors | 11 | `/api/advisors` |
| Admin | 13 | `/api/admin` |
| Enrollments | 4 | `/api/enrollments` |
| Payments | 3 | `/api/payments` |
| Complaints | 2 | `/api/complaints` |
| Notifications | 2 | `/api/notifications` |

---

## Deployment Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│  Vercel SPA  │     │  Vercel API  │
│ (Vite/React)│     │ (static)     │     │ (serverless)  │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                                         ┌──────▼───────┐
                                         │ MongoDB Atlas │
                                         │  (Cloud DB)   │
                                         └──────────────┘
```

---

## Seed Data Summary

| Entity | Count |
|--------|-------|
| Departments | 7 |
| Semesters | 3 |
| Courses | 45 |
| Course Offerings | 90 |
| Professors | 7 |
| Advisors | 3 |
| Students | 12 |
| Enrollments | 68 |
| Advising Sessions | 10 |
| Attendance Records | 79 |
| Assignments | 11 |
| Exams | 56 |
| Complaints | 6 |
| Notifications | 10 |
| Payments | 18 |
| Study Plans | 3 |
