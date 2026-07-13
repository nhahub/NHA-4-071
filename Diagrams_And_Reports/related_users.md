# Related Users — Seed Data Relationships

> Use this guide to verify frontend actions are wired to the correct backend data.
> **Common password for all accounts: `Test@123`** (Admin uses `password123`)

---

## Login Credentials

| Role | ID | Name | Email |
|------|----|------|-------|
| **Admin** | AD001 | Admin | admin@morshed.com |
| **Professor** | PR001 | Dr. Ahmed Hassan | ahmed.hassan@morshed.com |
| **Professor** | PR002 | Dr. Sara Khalil | sara.khalil@morshed.com |
| **Professor** | PR003 | Dr. Omar Farouk | omar.farouk@morshed.com |
| **Professor** | PR004 | Dr. Layla Mahmoud | layla.mahmoud@morshed.com |
| **Professor** | PR005 | Dr. Youssef Ali | youssef.ali@morshed.com |
| **Professor** | PR006 | Dr. Nour Ibrahim | nour.ibrahim@morshed.com |
| **Professor** | PR007 | Dr. Karim Mansour | karim.mansour@morshed.com |
| **Advisor** | ADVS001 | Prof. Mona Said | mona.said@morshed.com |
| **Advisor** | ADVS002 | Prof. Tamer Nour | tamer.nour@morshed.com |
| **Advisor** | ADVS003 | Prof. Hana Youssef | hana.youssef@morshed.com |
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

## 1. Advisor → Students

| Advisor | Students They Advise |
|---------|---------------------|
| **ADVS001 Prof. Mona Said** | STU001 Mohamed Ali (CS L3), STU004 Yasmin Khalid (IS L4), STU007 Khaled Mostafa (CS L1), STU010 Mariam Ashraf (IS L1) |
| **ADVS002 Prof. Tamer Nour** | STU002 Fatma Hassan (AI L2), STU005 Ahmed Nabil (IT L2), STU008 Nada Samir (AI L2), STU011 Tarek Fathy (IT L2) |
| **ADVS003 Prof. Hana Youssef** | STU003 Omar Mahmoud (SE L1), STU006 Salma Adel (MED L3), STU009 Hassan Ibrahim (SE L3), STU012 Huda Mansi (CS L4) |

---

## 2. Student → Advisor → Advising Sessions

| Student | Advisor | Sessions |
|---------|---------|----------|
| **STU001 Mohamed Ali** | ADVS001 Mona Said | F24 _(completed)_ — Discussed fall course load and research opportunities · S25 _(scheduled)_ — Spring registration, discuss capstone project |
| **STU002 Fatma Hassan** | ADVS002 Tamer Nour | F24 _(completed)_ — Reviewed ML specialization track options · S25 _(scheduled)_ — Discuss summer internship and fall registration |
| **STU003 Omar Mahmoud** | ADVS003 Hana Youssef | F24 _(completed)_ — First-year student orientation and course planning |
| **STU004 Yasmin Khalid** | ADVS001 Mona Said | F24 _(completed)_ — Discussed IS elective choices for final year |
| **STU005 Ahmed Nabil** | ADVS002 Tamer Nour | F24 _(cancelled)_ — Student did not attend |
| **STU006 Salma Adel** | ADVS003 Hana Youssef | S25 _(pending)_ — Clinical rotation schedule planning |
| **STU007 Khaled Mostafa** | ADVS001 Mona Said | S25 _(pending)_ — Academic probation follow-up |
| **STU008 Nada Samir** | ADVS002 Tamer Nour | S25 _(completed)_ — Reviewed progress toward AI specialization |

---

## 3. Student → Complaints → Assigned Admin (Advisor)

| Student | Complaint | Status | Assigned To |
|---------|-----------|--------|-------------|
| **STU001 Mohamed Ali** | Grade Dispute — CS102 Midterm | pending | ADVS001 Mona Said |
| **STU003 Omar Mahmoud** | Course Registration Conflict | in_progress | ADVS003 Hana Youssef |
| **STU005 Ahmed Nabil** | Missing Assignment Score | resolved | ADVS002 Tamer Nour |
| **STU009 Hassan Ibrahim** | Academic Probation Appeal | pending | ADVS003 Hana Youssef |
| **STU006 Salma Adel** | Clinical Rotation Schedule | in_progress | ADVS003 Hana Youssef |
| **STU004 Yasmin Khalid** | Transcript Request Delay | rejected | ADVS001 Mona Said |

---

## 4. Professor → S25 Courses → Enrolled Students

| Professor | Course Offering | Enrolled Students |
|-----------|----------------|-------------------|
| **PR001 Ahmed Hassan** | CS201 — Algorithms | STU001 Mohamed Ali, STU012 Huda Mansi |
| | SE102 — Requirements Engineering | STU003 Omar Mahmoud |
| | AI103 — Mathematics for AI | STU008 Nada Samir |
| | IS103 — Database Management | STU010 Mariam Ashraf |
| | IT103 — Network Administration | STU011 Tarek Fathy |
| **PR002 Sara Khalil** | CS202 — Operating Systems | STU001 Mohamed Ali |
| | AI201 — Deep Learning | STU002 Fatma Hassan |
| | SE103 — Software Design Patterns | STU003 Omar Mahmoud |
| | IS201 — Enterprise Systems | STU004 Yasmin Khalid |
| | IT201 — Cybersecurity | STU005 Ahmed Nabil |
| **PR003 Omar Farouk** | AI202 — NLP | STU002 Fatma Hassan |
| | IS202 — Business Intelligence | STU004 Yasmin Khalid |
| | IT202 — Cloud Computing | STU005 Ahmed Nabil |
| | SE201 — Software Testing | STU009 Hassan Ibrahim |
| | CS203 — Computer Networks | STU012 Huda Mansi |
| **PR004 Layla Mahmoud** | MED201 — Pharmacology | STU006 Salma Adel |
| **PR005 Youssef Ali** | MED202 — Pathology | STU006 Salma Adel |
| **PR006 Nour Ibrahim** | GEN201 — Technical Writing | **ALL 12 students** |
| | CS102 — Data Structures | STU007 Khaled Mostafa |
| **PR007 Karim Mansour** | CS103 — Discrete Mathematics | STU007 Khaled Mostafa |
| | AI102 — Machine Learning | STU008 Nada Samir |
| | IS102 — Systems Analysis | STU010 Mariam Ashraf |
| | IT102 — Web Development | STU011 Tarek Fathy |

---

## 5. Student → S25 Current Enrollments

| Student | S25 Courses | Professor(s) |
|---------|-------------|-------------|
| **STU001 Mohamed Ali** (CS L3, GPA 3.7) | CS201, CS202, GEN201 | Ahmed Hassan, Sara Khalil, Nour Ibrahim |
| **STU002 Fatma Hassan** (AI L2, GPA 3.9) | AI201, AI202, GEN201 | Sara Khalil, Omar Farouk, Nour Ibrahim |
| **STU003 Omar Mahmoud** (SE L1, GPA 3.2) | SE102, SE103, GEN201 | Ahmed Hassan, Sara Khalil, Nour Ibrahim |
| **STU004 Yasmin Khalid** (IS L4, GPA 3.5) | IS201, IS202, GEN201 | Sara Khalil, Omar Farouk, Nour Ibrahim |
| **STU005 Ahmed Nabil** (IT L2, GPA 2.8) | IT201, IT202, ~~GEN201 dropped~~ | Sara Khalil, Omar Farouk |
| **STU006 Salma Adel** (MED L3, GPA 3.8) | MED201, MED202, GEN201 | Layla Mahmoud, Youssef Ali, Nour Ibrahim |
| **STU007 Khaled Mostafa** (CS L1, GPA 3.1) | CS102, CS103, GEN201 | Nour Ibrahim, Karim Mansour, Nour Ibrahim |
| **STU008 Nada Samir** (AI L2, GPA 3.6) | AI102, AI103, GEN201 | Karim Mansour, Ahmed Hassan, Nour Ibrahim |
| **STU009 Hassan Ibrahim** (SE L3, GPA 2.5) | SE201, ~~GEN201 dropped~~ | Omar Farouk |
| **STU010 Mariam Ashraf** (IS L1, GPA 3.4) | IS102, IS103, GEN201 | Karim Mansour, Ahmed Hassan, Nour Ibrahim |
| **STU011 Tarek Fathy** (IT L2, GPA 3.0) | IT102, IT103, GEN201 | Karim Mansour, Ahmed Hassan, Nour Ibrahim |
| **STU012 Huda Mansi** (CS L4, GPA 3.3) | CS201, CS203, GEN201 | Ahmed Hassan, Omar Farouk, Nour Ibrahim |

---

## 6. Student → F24 Completed Grades

| Student | F24 Courses (Grades) | Computed GPA |
|---------|---------------------|--------------|
| STU001 Mohamed Ali | CS101-A, CS102-A-, GEN101-B+, GEN102-B | **3.50** |
| STU002 Fatma Hassan | AI101-A, AI102-A-, GEN101-B+ | **3.67** |
| STU003 Omar Mahmoud | SE101-B, GEN101-B+, GEN102-C+ | **2.87** |
| STU004 Yasmin Khalid | IS101-A-, IS102-B+, GEN101-B | **3.33** |
| STU005 Ahmed Nabil | IT101-C+, GEN101-B | **2.65** |
| STU006 Salma Adel | MED101-A, MED102-A, GEN101-A- | **3.92** |
| STU007 Khaled Mostafa | CS101-B-, GEN101-C+ | **2.50** |
| STU008 Nada Samir | AI101-B+, GEN101-B | **3.15** |
| STU009 Hassan Ibrahim | SE101-C, GEN101-B- | **2.35** |
| STU010 Mariam Ashraf | IS101-B+, GEN101-A- | **3.50** |
| STU011 Tarek Fathy | IT101-B, GEN101-B+ | **3.15** |
| STU012 Huda Mansi | CS101-A-, CS102-B+, GEN101-A | **3.67** |

---

## 7. Student → Payments

| Student | F24 | S25 |
|---------|-----|-----|
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

## 8. Key Test Cases for Frontend

### 8.1 Advisor sees assigned complaints
1. Login as **ADVS001 Mona Said** (`Test@123`)
2. Go to **Issues**
3. Should see 2 complaints: "Grade Dispute" (STU001) and "Transcript Request Delay" (STU004)
4. Try updating their status → should persist

### 8.2 Advisor sees assigned students
1. Login as **ADVS001 Mona Said**
2. Go to **Students**
3. Should see: STU001, STU004, STU007, STU010
4. Click one → should see Student Progress with all grades/attendance

### 8.3 Professor marks attendance
1. Login as **PR006 Nour Ibrahim** (`Test@123`)
2. Go to **Courses** → select GEN201_S25
3. Should see all 12 students enrolled
4. Mark attendance for a date → verify records appear

### 8.4 Professor submits grades
1. Login as **PR003 Omar Farouk** (`Test@123`)
2. Go to **Courses** → select SE201_S25
3. Should see STU009 Hassan Ibrahim enrolled
4. Submit grade → STU009 sees it in transcript

### 8.5 Student views transcript
1. Login as **STU001 Mohamed Ali** (`Test@123`)
2. Go to **Transcript**
3. F24: 4 courses (A, A-, B+, B) → GPA **3.50**
4. S25: 3 courses (in progress)

### 8.6 Student submits complaint
1. Login as **STU007 Khaled Mostafa** (`Test@123`)
2. Go to **Complaints** → Submit new
3. Fill subject + description → submit
4. Login as advisor **ADVS001 Mona Said** → Issues → should see the new complaint

### 8.7 Student requests advising session
1. Login as **STU006 Salma Adel** (`Test@123`)
2. Go to **Advising**
3. Request session → status should be "pending"
4. Login as advisor **ADVS003 Hana Youssef** → Sessions → should see request

### 8.8 Admin manages complaints
1. Login as **AD001 Admin** (`password123`)
2. Go to **Complaints**
3. Should see all 6 complaints with student names
4. Assign one to an admin → verify advisor sees it in Issues
5. Change status → verify student sees updated status

### 8.9 Admin registration control
1. Login as **AD001 Admin**
2. Go to **Registration**
3. See S25 semester with 12 registered students
4. Manually enroll STU007 in a course
5. Verify STU007 schedule now shows the course

### 8.10 Student views exam schedule
1. Login as **STU001 Mohamed Ali** (`Test@123`)
2. Go to **Exam Schedule**
3. Should see midterm/final dates for CS201, CS202, GEN201
4. CS201 midterm: Apr 15, CS202 midterm: Apr 17, GEN201 midterm: Apr 18
