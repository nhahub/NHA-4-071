# Related Users — Seed Data Relationships

> Use this guide to verify frontend actions are wired to the correct backend data.
> **Common password for all accounts: `Test@123`** (Admin uses `password123`)

---

## Login Credentials Quick Reference

| Role | ID | Full Name | Email |
|------|----|-----------|-------|
| **Admin** | AD001 | Admin | admin@morshed.com |
| | | | |
| **Professor** | PR001 | Dr. Ahmed Hassan | ahmed.hassan@morshed.com |
| **Professor** | PR002 | Dr. Sara Khalil | sara.khalil@morshed.com |
| **Professor** | PR003 | Dr. Omar Farouk | omar.farouk@morshed.com |
| **Professor** | PR004 | Dr. Layla Mahmoud | layla.mahmoud@morshed.com |
| **Professor** | PR005 | Dr. Youssef Ali | youssef.ali@morshed.com |
| **Professor** | PR006 | Dr. Nour Ibrahim | nour.ibrahim@morshed.com |
| **Professor** | PR007 | Dr. Karim Mansour | karim.mansour@morshed.com |
| | | | |
| **Advisor** | ADVS001 | Prof. Mona Said | mona.said@morshed.com |
| **Advisor** | ADVS002 | Prof. Tamer Nour | tamer.nour@morshed.com |
| **Advisor** | ADVS003 | Prof. Hana Youssef | hana.youssef@morshed.com |
| | | | |
| **Student** | STU001 | Mohamed Ali | mohamed.ali@student.morshed.com |
| **Student** | STU002 | Fatma Hassan | fatma.hassan@student.morshed.com |
| **Student** | STU003 | Omar Mahmoud | omar.mahmoud@student.morshed.com |
| **Student** | STU004 | Yasmin Khalid | yasmin.khalid@student.morshed.com |
| **Student** | STU005 | Ahmed Nabil | ahmed.nabil@student.morshed.com |
| **Student** | STU006 | Salma Adel | salma.adel@student.morshed.com |
| **Student** | STU007 | Khaled Mostafa | khaled.mostafa@student.morshed.com |
| **Student** | STU008 | Nada Samir | nada.samir@student.morshed.com |
| **Student** | STU009 | Hassan Ibrahim | hassan.ibrahim@student.morshed.com |
| **Student** | STU010 | Mariam Ashraf | mariam.ashraf@student.morshed.com |
| **Student** | STU011 | Tarek Fathy | tarek.fathy@student.morshed.com |
| **Student** | STU012 | Huda Mansi | huda.mansi@student.morshed.com |

---

## 1. Advisor → Students (who advises whom)

| Advisor | Assigned Students |
|---------|------------------|
| **ADVS001 — Prof. Mona Said** (CS dept) | STU001 Mohamed Ali (CS L3), STU004 Yasmin Khalid (IS L4), STU007 Khaled Mostafa (CS L1), STU010 Mariam Ashraf (IS L1) |
| **ADVS002 — Prof. Tamer Nour** (SE dept) | STU002 Fatma Hassan (AI L2), STU005 Ahmed Nabil (IT L2), STU008 Nada Samir (AI L2), STU011 Tarek Fathy (IT L2) |
| **ADVS003 — Prof. Hana Youssef** (IS dept) | STU003 Omar Mahmoud (SE L1), STU006 Salma Adel (MED L3), STU009 Hassan Ibrahim (SE L3), STU012 Huda Mansi (CS L4) |

---

## 2. Student → Advisor → Advising Sessions

| Student | Advisor | Advising Sessions |
|---------|---------|-------------------|
| **STU001 Mohamed Ali** | ADVS001 Mona Said | F24 (completed): Discussed fall course load. S25 (scheduled): Discuss capstone project |
| **STU002 Fatma Hassan** | ADVS002 Tamer Nour | F24 (completed): Reviewed ML specialization. S25 (scheduled): Summer internship discussion |
| **STU003 Omar Mahmoud** | ADVS003 Hana Youssef | F24 (completed): First-year orientation |
| **STU004 Yasmin Khalid** | ADVS001 Mona Said | F24 (completed): IS elective choices |
| **STU005 Ahmed Nabil** | ADVS002 Tamer Nour | F24 (cancelled): Student did not attend |
| **STU006 Salma Adel** | ADVS003 Hana Youssef | S25 (pending): Clinical rotation planning |
| **STU007 Khaled Mostafa** | ADVS001 Mona Said | S25 (pending): Academic probation follow-up |
| **STU008 Nada Samir** | ADVS002 Tamer Nour | S25 (completed): AI specialization progress |

---

## 3. Student → Complaints → Assigned Admin (Advisor)

| Student | Complaint Subject | Status | Assigned To (adminId) |
|---------|------------------|--------|----------------------|
| **STU001 Mohamed Ali** | Grade Dispute — CS102 Midterm | pending | **ADVS001 Mona Said** |
| **STU003 Omar Mahmoud** | Course Registration Conflict | in_progress | **ADVS003 Hana Youssef** |
| **STU005 Ahmed Nabil** | Missing Assignment Score | resolved | **ADVS002 Tamer Nour** |
| **STU009 Hassan Ibrahim** | Academic Probation Appeal | pending | **ADVS003 Hana Youssef** |
| **STU006 Salma Adel** | Clinical Rotation Schedule | in_progress | **ADVS003 Hana Youssef** |
| **STU004 Yasmin Khalid** | Transcript Request Delay | rejected | **ADVS001 Mona Said** |

---

## 4. Professor → Course Offerings (S25 — Current Semester)

| Professor | S25 Courses They Teach |
|-----------|----------------------|
| **PR001 Dr. Ahmed Hassan** (CS) | MED101, SE102, CS201, IT103 |
| **PR002 Dr. Sara Khalil** (AI) | MED102, SE103, CS202, AI201, IT201 |
| **PR003 Dr. Omar Farouk** (SE) | GEN101, MED103, SE201, CS203, AI202, IT202 |
| **PR004 Dr. Layla Mahmoud** (IS) | GEN102, MED201, SE202, CS301, AI203, IT203 |
| **PR005 Dr. Youssef Ali** (IT) | GEN103, MED202, SE301, CS101, AI301, IT301 |
| **PR006 Dr. Nour Ibrahim** (MED) | GEN201, MED301, IS101, CS102, AI101, IT101 |
| **PR007 Dr. Karim Mansour** (GEN) | GEN202, MED103, SE101, IS102, AI102, IT102 |

> **Note:** F24 assignments shift by +3 professors (e.g., GEN101 was Karim in F24, now Omar in S25)

---

## 5. Student → S25 Enrolled Courses → Professor

| Student | S25 Courses | Professor |
|---------|-------------|-----------|
| **STU001 Mohamed Ali** (CS L3) | CS201 — Algorithms | PR005 Youssef Ali |
| | CS202 — Operating Systems | PR002 Sara Khalil |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU002 Fatma Hassan** (AI L2) | AI201 — Deep Learning | PR002 Sara Khalil |
| | AI202 — NLP | PR003 Omar Farouk |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU003 Omar Mahmoud** (SE L1) | SE102 — Requirements Engineering | PR001 Ahmed Hassan |
| | SE103 — Software Design Patterns | PR002 Sara Khalil |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU004 Yasmin Khalid** (IS L4) | IS201 — Enterprise Systems | PR002 Sara Khalil |
| | IS202 — Business Intelligence | PR003 Omar Farouk |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU005 Ahmed Nabil** (IT L2) | IT201 — Cybersecurity Fundamentals | PR002 Sara Khalil |
| | IT202 — Cloud Computing | PR003 Omar Farouk |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| | _(dropped GEN201)_ | |
| **STU006 Salma Adel** (MED L3) | MED201 — Pharmacology | PR004 Layla Mahmoud |
| | MED202 — Pathology | PR005 Youssef Ali |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU007 Khaled Mostafa** (CS L1) | CS102 — Data Structures | PR006 Nour Ibrahim |
| | CS103 — Discrete Mathematics | PR007 Karim Mansour |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU008 Nada Samir** (AI L2) | AI102 — Machine Learning | PR007 Karim Mansour |
| | AI103 — Mathematics for AI | PR001 Ahmed Hassan |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU009 Hassan Ibrahim** (SE L3) | SE201 — Software Testing & Quality | PR003 Omar Farouk |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| | _(dropped GEN201)_ | |
| **STU010 Mariam Ashraf** (IS L1) | IS102 — Systems Analysis & Design | PR007 Karim Mansour |
| | IS103 — Database Management | PR001 Ahmed Hassan |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU011 Tarek Fathy** (IT L2) | IT102 — Web Development | PR007 Karim Mansour |
| | IT103 — Network Administration | PR001 Ahmed Hassan |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |
| **STU012 Huda Mansi** (CS L4) | CS201 — Algorithms | PR005 Youssef Ali |
| | CS203 — Computer Networks | PR003 Omar Farouk |
| | GEN201 — Technical Writing | PR006 Nour Ibrahim |

---

## 6. Student → F24 Completed Courses → Grades

| Student | F24 Courses Completed | Grades |
|---------|----------------------|--------|
| STU001 Mohamed Ali (CS) | CS101, CS102, GEN101, GEN102 | A, A-, B+, B |
| STU002 Fatma Hassan (AI) | AI101, AI102, GEN101 | A, A-, B+ |
| STU003 Omar Mahmoud (SE) | SE101, GEN101, GEN102 | B, B+, C+ |
| STU004 Yasmin Khalid (IS) | IS101, IS102, GEN101 | A-, B+, B |
| STU005 Ahmed Nabil (IT) | IT101, GEN101 | C+, B |
| STU006 Salma Adel (MED) | MED101, MED102, GEN101 | A, A, A- |
| STU007 Khaled Mostafa (CS) | CS101, GEN101 | B-, C+ |
| STU008 Nada Samir (AI) | AI101, GEN101 | B+, B |
| STU009 Hassan Ibrahim (SE) | SE101, GEN101 | C, B- |
| STU010 Mariam Ashraf (IS) | IS101, GEN101 | B+, A- |
| STU011 Tarek Fathy (IT) | IT101, GEN101 | B, B+ |
| STU012 Huda Mansi (CS) | CS101, CS102, GEN101 | A-, B+, A |

---

## 7. Student → Payments

| Student | F24 Payment | S25 Payment |
|---------|-------------|-------------|
| STU001 Mohamed Ali | $5,000 **paid** (bank transfer) | $5,000 **pending** |
| STU002 Fatma Hassan | $5,000 **paid** (credit card) | $5,000 **pending** |
| STU003 Omar Mahmoud | $5,000 **paid** (online) | $5,000 **overdue** |
| STU004 Yasmin Khalid | $5,000 **paid** (bank transfer) | $5,000 **paid** (credit card) |
| STU005 Ahmed Nabil | $4,500 **paid** (debit card) | $4,500 **pending** |
| STU006 Salma Adel | $8,000 **paid** (bank transfer) | $8,000 **paid** (online) |
| STU007 Khaled Mostafa | $4,500 **paid** (cash) | $4,500 **overdue** |
| STU008 Nada Samir | $5,000 **paid** (credit card) | $5,000 **pending** |
| STU012 Huda Mansi | $5,000 **paid** (bank transfer) | $5,000 **paid** (online) |

---

## 8. Admin Actions (for system-wide testing)

| Action | Login As | What to Verify |
|--------|----------|----------------|
| View all users | AD001 Admin | See STU001–STU012, PR001–PR007, ADVS001–ADVS003 listed with correct roles |
| Create a course | AD001 Admin | POST creates course visible in cataog |
| Assign complaint to advisor | AD001 Admin | Open STU001's complaint, set adminId → should appear in ADVS001's Issues page |
| Change semester status | AD001 Admin | Toggle registration from open → closed → ongoing |
| View reports/analytics | AD001 Admin | GPA by department, enrollment counts, user distribution |
| Manual enrollment | AD001 Admin | Enroll a student in an offering |
| Update system settings | AD001 Admin | Change max credits, semester fee, registration dates |

---

## 9. Relationship Test Cases for Frontend

### Test: Advisor sees assigned complaints
1. Login as **ADVS001 Mona Said** → go to Issues
2. Should see 2 complaints: Grade Dispute (STU001) and Transcript Request (STU004)

### Test: Advisor sees assigned students
1. Login as **ADVS001 Mona Said** → go to Students
2. Should see: STU001, STU004, STU007, STU010

### Test: Professor marks attendance
1. Login as **PR005 Youssef Ali** → go to Courses → select CS101_S25
2. Students enrolled: STU001? No... Wait, let me recalculate.
   Actually, CS101_S25: Looking at the data, CS101 is taught by PR005 in S25. Let me check which students take CS101 in S25.
   From the S25 enrollments: No student takes CS101 in S25. The students in CS-related S25 are:
   - STU001: CS201, CS202, GEN201
   - STU006: CS102, CS103, GEN201
   - STU012: CS201, CS203, GEN201
   
   So for PR005 Youssef Ali, his S25 courses are: GEN103, MED202, SE301, CS101, AI301, IT301
   But none of the seeded students take GEN103, MED202, SE301, CS101, AI301, or IT301 in S25 according to our enrollment data. So this might be an issue.

   Actually, that's OK - the frontend just needs to see that the professor can view their course offerings, even if no students are enrolled in that specific offering. The attendance feature would just show an empty state.

### Test: Student view transcript
1. Login as **STU001 Mohamed Ali** → go to Transcript
2. Should show: F24 semester with 4 courses (A, A-, B+, B) → GPA 3.5
3. S25 semester with 3 courses (in progress)

### Test: Student submit complaint
1. Login as **STU007 Khaled Mostafa** → go to Complaints → Submit new
2. After submitting, login as **ADVS001 Mona Said** → go to Issues → should see it

### Test: Professor grade submission
1. Login as **PR006 Nour Ibrahim** → go to Courses → GEN201_S25
2. See all 12 students enrolled → submit a grade for one
3. Student then sees grade in transcript

Actually, let me recalculate who teaches what for the courses that are actually enrolled:

From S25 enrollments, the courses taken are:
- CS201_S25 → STU001, STU012 → S25 professor = PR001 (Ahmed Hassan)
- CS202_S25 → STU001 → S25 professor = PR002 (Sara Khalil)
- GEN201_S25 → ALL 12 students → S25 professor = PR006 (Nour Ibrahim)
- AI201_S25 → STU002 → S25 professor = PR002 (Sara Khalil)
- AI202_S25 → STU002 → S25 professor = PR003 (Omar Farouk)
- SE102_S25 → STU003 → S25 professor = PR001 (Ahmed Hassan)
- SE103_S25 → STU003 → S25 professor = PR002 (Sara Khalil)
- IS201_S25 → STU004 → S25 professor = PR002 (Sara Khalil)
- IS202_S25 → STU004 → S25 professor = PR003 (Omar Farouk)
- IT201_S25 → STU005 → S25 professor = PR002 (Sara Khalil)
- IT202_S25 → STU005 → S25 professor = PR003 (Omar Farouk)
- MED201_S25 → STU006 → S25 professor = PR004 (Layla Mahmoud)
- MED202_S25 → STU006 → S25 professor = PR005 (Youssef Ali)
- CS102_S25 → STU006 → S25 professor = PR006 (Nour Ibrahim)
- CS103_S25 → STU006 → S25 professor = PR007 (Karim Mansour)
- AI102_S25 → STU008 → S25 professor = PR007 (Karim Mansour)
- AI103_S25 → STU008 → S25 professor = PR001 (Ahmed Hassan)
- SE201_S25 → STU009 → S25 professor = PR003 (Omar Farouk)
- IS102_S25 → STU010 → S25 professor = PR007 (Karim Mansour)
- IS103_S25 → STU010 → S25 professor = PR001 (Ahmed Hassan)
- IT102_S25 → STU011 → S25 professor = PR007 (Karim Mansour)
- IT103_S25 → STU011 → S25 professor = PR001 (Ahmed Hassan)
- CS203_S25 → STU012 → S25 professor = PR003 (Omar Farouk)

This is very important data! Let me include the "enrolled courses that each professor teaches" as a section.

Let me also add the F24 professors for the F24 courses that had completed grades.<｜end▁of▁thinking｜>

<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="read">
<｜｜DSML｜｜parameter name="offset" string="false">100