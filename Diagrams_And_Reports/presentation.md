# Morshed University Management System

A full-stack university management platform connecting students, professors, advisors, and administrators through a unified digital ecosystem. The system handles the complete academic lifecycle — from enrollment through graduation — including course registration, grade management, advising, payments, complaints, and administrative oversight.

**Tech Stack:** React 18 + Redux Toolkit + Tailwind CSS 4 (frontend) · Node.js + Express 5 + MongoDB Atlas (backend) · Vite (build) · JWT + bcryptjs (auth) · Zod (validation) · Recharts (charts)

---

## Student User Stories (14 Features)

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
| 13 | As a student, I want to manage my **profile and settings** so I can update personal info and configure preferences |
| 14 | As a student, I want **notifications** so I can stay informed about grades, deadlines, and system updates |

---

## Professor User Stories (8 Features)

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

---

## Advisor User Stories (6 Features)

| # | User Story |
|---|-----------|
| 1 | As an advisor, I want a **dashboard** so I can see total assigned students and at-risk counts |
| 2 | As an advisor, I want to view **my assigned students** so I can search and review their profiles |
| 3 | As an advisor, I want to **manage advising sessions** so I can create, update, and track meetings with students |
| 4 | As an advisor, I want to view **student progress** so I can see detailed grades, attendance, and course completion per student |
| 5 | As an advisor, I want to run a **graduation audit** so I can check if a student meets degree requirements |
| 6 | As an advisor, I want to **resolve student issues** so I can view and respond to complaints assigned to me |

---

## Admin User Stories (10 Features)

| # | User Story |
|---|-----------|
| 1 | As an admin, I want a **dashboard** so I can see system-wide KPIs — user counts, enrollment stats, open complaints, and financial overview |
| 2 | As an admin, I want to **manage users** so I can create, update, and deactivate student, professor, and advisor accounts |
| 3 | As an admin, I want to **manage courses** so I can create and update the course catalog with codes, names, credits, and departments |
| 4 | As an admin, I want to **manage departments** so I can add and update academic departments |
| 5 | As an admin, I want to **configure semesters** so I can create academic terms and control registration status |
| 6 | As an admin, I want to **manage complaints** so I can view all student complaints, assign them to staff, and update their status |
| 7 | As an admin, I want **registration control** so I can manually enroll students and view registration statistics |
| 8 | As an admin, I want **reports and analytics** so I can see system-wide data including GPA distribution by department |
| 9 | As an admin, I want to configure **academic policies** so I can set rules like max credits per semester and GPA thresholds |
| 10 | As an admin, I want **system settings** so I can configure global application values |

---

## Cross-Cutting Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Login with university ID + password. Registration, forgot/reset password, change password. JWT-based with role-based access control |
| **Role-Based Access** | Each role sees only their relevant pages and data. Dynamic navigation sidebar changes per user. 403 page for unauthorized access |
| **Notifications** | System-wide notification system with types (urgent/academic/info/system). Read/unread tracking per user across all roles |
| **Data Validation** | End-to-end validation with Zod — form validation on frontend and request validation on backend |
| **Real-Time Charts** | Interactive charts and KPIs using Recharts for analytics dashboards |

---

## Database Collections (20)

`users` → `students` · `professors` · `advisors` · `admins` (1-to-1 profiles)
`departments` → `courses` · `students` · `professors` · `advisors`
`semesters` → `courseofferings` → `enrollments` · `assignments` · `attendance` · `exams`
`payments` — tuition per student per semester (pending/paid/overdue)
`complaints` — student issues with admin assignment (pending/in_progress/resolved/rejected)
`advising sessions` — advisor-student meeting records
`notifications` — user-targeted messages with read tracking
`semester registrations` — student semester enrollment tracking
`settings` — global key-value configuration store

---

## API Endpoints (~85)

| Category | Count | Examples |
|----------|-------|---------|
| Auth | 7 | login, register, forgot/reset password, change password |
| University | 8 | departments, semesters, courses, offerings CRUD |
| Students | 17 | dashboard, profile, schedule, grades, transcript, payments, complaints, advising, attendance, exams, study plan, registration |
| Professors | 14 | dashboard, courses, assignments, attendance, grades, schedule, notifications |
| Advisors | 11 | dashboard, students, sessions, progress, graduation audit, issue resolution |
| Admin | 13 | dashboard, users, courses, departments, semesters, complaints, settings, reports, registration control |
| Enrollments | 4 | enroll, drop, recalibrate |
| Payments | 3 | summary, make payment, history |
| Complaints | 2 | submit, list |
| Notifications | 2 | mark read (student), list (professor) |

---

## Seed Data

| Entity | Count | Entity | Count |
|--------|-------|--------|-------|
| Departments | 7 | Advising Sessions | 10 |
| Semesters | 3 | Attendance Records | 79 |
| Courses | 45 | Assignments | 11 |
| Course Offerings | 90 | Exams | 56 |
| Students | 12 | Complaints | 6 |
| Professors | 7 | Notifications | 10 |
| Advisors | 3 | Payments | 18 |
| Enrollments | 68 | Study Plans | 3 |
