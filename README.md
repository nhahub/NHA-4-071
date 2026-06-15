```markdown
# 🎓 Morshed - Academic Guidance Platform

Morshed is a comprehensive university electronic platform aimed at simplifying and facilitating academic and administrative procedures for students. Through it, students can register for courses, access academic advising, track their study plans, and pay university fees seamlessly.

---

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Zustand (State Management), React Hook Form, Axios
- **Backend:** Express.js, Mongoose (ODM), JWT (Authentication), Bcryptjs
- **Database:** MongoDB (Local instance - no Atlas)
- **Validation:** Zod (Shared across Frontend & Backend)
- **Architecture:** Modular MVC (Backend) & Feature-based (Frontend)

---

## 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Must be running locally on the default port `27017`)
- [Git](https://git-scm.com/)
- A code editor like [VS Code](https://code.visualstudio.com/)

---

## 🚀 Installation & Local Setup

Follow these steps carefully to get the project running on your local machine.

### 1. Clone the Repository
If you haven't already, clone the repo and navigate into it:
```bash
git clone <YOUR_REPO_URL_HERE>
cd NHA-4-071
```

### 2. Backend Setup
Open a terminal in the root folder and run:
```bash
cd BackEndLayer
npm install
```

**Setup Environment Variables:**
Copy the example environment file to create your local configuration:
```bash
cp .env.example .env
```
*(Note: Never commit the `.env` file to Git! It is already ignored.)*

**Start the Backend Server:**
```bash
npm run dev
```
*✅ Backend should now be running on `http://localhost:5000` and connected to your local MongoDB.*

---

### 3. Frontend Setup
Open a **new** terminal tab/window (keep the backend running in the other one) and run:
```bash
cd FrontEndLayer
npm install
```

**Setup Environment Variables:**
Just like the backend, copy the example environment file:
```bash
cp .env.example .env
```

**Start the Frontend App:**
```bash
npm run dev
```
*✅ Frontend should now be running on `http://localhost:5173`.*

---

## 📂 Project Architecture

We are using a balanced modular architecture to keep the codebase clean and scalable.

```text
Morshed Root/
├── BackEndLayer/             # Express API & Mongoose Models
│   ├── src/
│   │   ├── config/           # DB connection setup
│   │   ├── controllers/      # Request handlers (Route logic)
│   │   ├── middlewares/      # Auth, RBAC, Zod validation catcher
│   │   ├── models/           # Mongoose Schemas (DB middleware)
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic & DB queries
│   │   └── validations/      # Zod request schemas
│   ├── .env.example          # Example environment variables
│   └── server.js             # Entry point
│
├── FrontEndLayer/            # React UI (Vite)
│   ├── src/
│   │   ├── pages/            # Role-specific views (Student, Admin, etc.)
│   │   ├── Schemas/          # Zod request/response validation
│   │   │   ├── RequestSchemas/
│   │   │   └── ResponseSchemas/
│   │   ├── services/         # API fetching (genericFetchService.js)
│   │   ├── shared/           # Global utils (GPA calc, Notifications)
│   │   ├── store/            # Zustand global state
│   │   ├── hooks/            # Custom React hooks
│   │   └── components/       # Reusable UI components
│   ├── .env.example          # Example environment variables
│   └── App.jsx               # Root component
│
├── Diagrams_And_Reports/     # ERD, System Design, and reports
├── .gitignore                # Global gitignore rules
└── README.md                 # You are here!
```

---

## 🤝 Team Guidelines & Git Workflow

To avoid code conflicts and keep the repository clean, please follow these rules:

1. **Never commit `.env` files:** They are already in `.gitignore`. If you add new secret keys, update the `.env.example` file to let others know, but never commit the actual `.env` file.
2. **Never commit `node_modules`:** If you accidentally stage them, undo it immediately.
3. **Branching Strategy:**
   - Never push directly to `main`.
   - Create a feature branch for your task: `git checkout -b feature/your-feature-name` (e.g., `feature/student-login`).
   - Push your branch and create a Pull Request to merge into `main`.
4. **Commit Messages:** Use clear, descriptive commit messages. 
   - Good: `feat: added student course enrollment API`
   - Bad: `updates`
5. **Zod Schemas:** When creating a new API endpoint, create the Zod validation schema in the backend `validations/` folder first. On the frontend, use `Schemas/RequestSchemas` for form validation and `Schemas/ResponseSchemas` to validate incoming data in `genericFetchService.js`.


