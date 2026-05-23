# Issue Tracking Application

A full-stack Issue Tracking system built with **React + TypeScript** frontend and an **Express.js + TypeScript** backend, following a modular MVC architecture.

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite 6** - Build tool
- **Material UI (MUI) v6** + **MUI X DataGrid** - UI components
- **Redux Toolkit** + **Redux Thunks** - State management
- **React Router v7** - Routing
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **SCSS (Sass)** - Styling

### Backend

- **Express.js** with **TypeScript**
- **MySQL 8** with **Drizzle ORM**
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Request validation
- **Pino** + **pino-http** - Structured logging
- **Swagger (swagger-jsdoc + swagger-ui-express)** - API documentation
- **json2csv** - CSV export

## 🏗️ Project Structure

```
Issue-Tracking-Application-React-Express-Redux-TS/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── assets/                 # Themes, styles
│   │   ├── components/             # Reusable components
│   │   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── issues/             # Issue components
│   │   │   ├── profile/            # Profile components
│   │   │   ├── report/             # Report components
│   │   │   └── shared/             # Shared UI components
│   │   ├── core/                   # Core app setup
│   │   ├── hooks/                  # Custom React hooks (e.g. debounce)
│   │   ├── pages/                  # Page components
│   │   │   ├── AuthPage/
│   │   │   ├── Dashboard/
│   │   │   ├── Issues/
│   │   │   ├── MyIssues/
│   │   │   ├── IssueReport/
│   │   │   ├── Profile/
│   │   │   ├── Users/
│   │   │   ├── Login/
│   │   │   └── Register/
│   │   ├── redux/                  # Redux Toolkit store
│   │   │   ├── slices/             # State slices
│   │   │   ├── thunks/             # Async thunks
│   │   │   └── store/
│   │   ├── routes/                 # App routing
│   │   ├── services/               # API services
│   │   ├── templates/              # Layout templates
│   │   └── utilities/              # Constants, helpers, models
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Express Backend (TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts               # MySQL pool + Drizzle setup
│   │   │   ├── logger.ts           # Pino logger
│   │   │   └── swagger.ts          # Swagger spec
│   │   ├── db/
│   │   │   └── schema.ts           # Drizzle schema definitions
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT auth + role guards
│   │   │   ├── validate.ts         # Zod request validation
│   │   │   └── errorHandler.ts     # Centralized error handling
│   │   ├── modules/
│   │   │   ├── auth/               # Authentication module
│   │   │   ├── issues/             # Issues module
│   │   │   └── users/              # Users module
│   │   ├── routes/
│   │   │   └── index.ts            # Route aggregator
│   │   ├── shared/
│   │   │   ├── constants/
│   │   │   └── utils/              # Response & export helpers
│   │   ├── types/                  # Shared TS types
│   │   └── server.ts               # Main entry point
│   ├── scripts/
│   │   └── seed.ts                 # Seed users (admin + normal)
│   ├── drizzle.config.ts
│   └── package.json
│
└── README.md
```

## ✨ Features

### User Features

- **Authentication** - Register, Login, JWT-based session
- **Dashboard** - Personal issue statistics with charts (Bar & Pie)
- **My Issues** - Create, view, and manage personal issues
- **Debounced Search** - Optimized search across issue lists
- **Profile** - Update profile info and change password

### Admin Features

- **All Issues** - View and manage every issue in the system
- **User Management** - Enable, disable, or permanently delete users
- **Issue Reports** - Filter and export reports (CSV / JSON)
- **Issue Status Control** - Admin-only status transitions

### Issue Management

- **CRUD Operations** - Create, Read, Update, Delete issues
- **Status Levels** - Open, In Progress, Resolved, Closed
- **Priority Levels** - Low, Medium, High, Critical
- **Filtering & Pagination** - Search, filter, and paginate issues
- **Server-side Validation** - Zod schemas on every endpoint

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Installation

```bash
git clone https://github.com/DhananjayaYapa/Issue-Tracking-Application-React-Express-Redux-TS.git
cd Issue-Tracking-Application-React-Express-Redux-TS
```

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   Create a `.env` file in the `server/` directory:

   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/issue_tracker"
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   LOG_LEVEL=info
   ```

4. **Set up database:**

   ```bash
   # Create database in MySQL
   mysql -u root -p
   CREATE DATABASE issue_tracker;
   ```

   Then push the Drizzle schema:

   ```bash
   npm run db:push
   ```

   Or generate and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Seed initial users (admin + normal):**

   ```bash
   npm run seed
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   - API:    `http://localhost:5000/api/v1`
   - Docs:   `http://localhost:5000/api-docs`

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd client
   ```

2. **Configure environment:**

   Create a `.env` file in the `client/` directory:

   ```env
   VITE_API_BASE_URL=/api/v1
   VITE_APP_ENV=dev
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`

## 📚 API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

Interactive Swagger documentation is available at `http://localhost:5000/api-docs`.

### Authentication

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/auth/register`        | Register new user        |
| POST   | `/auth/login`           | User login               |
| GET    | `/auth/profile`         | Get current user profile |
| PUT    | `/auth/profile`         | Update profile           |
| PUT    | `/auth/change-password` | Change password          |

### Issues

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| GET    | `/issues`                 | Get all issues (Admin)            |
| GET    | `/issues/my-issues`       | Get current user's issues         |
| GET    | `/issues/:id`             | Get issue by ID                   |
| POST   | `/issues`                 | Create new issue                  |
| PUT    | `/issues/:id`             | Update issue                      |
| PATCH  | `/issues/:id/status`      | Update issue status (Admin)       |
| DELETE | `/issues/:id`             | Delete issue                      |
| GET    | `/issues/stats/counts`    | Get status counts (Admin)         |
| GET    | `/issues/my-stats/counts` | Get current user's status counts  |
| GET    | `/issues/export/csv`      | Export filtered issues as CSV     |
| GET    | `/issues/export/json`     | Export filtered issues as JSON    |
| GET    | `/issues/metadata`        | Get issue metadata (statuses etc) |

### Users (Admin)

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/users`            | Get all users           |
| GET    | `/users/:id`        | Get user by ID          |
| PATCH  | `/users/:id/enable` | Enable user             |
| PATCH  | `/users/:id/disable`| Disable user            |
| DELETE | `/users/:id`        | Permanently delete user |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

## 🔐 User Roles

| Role      | Permissions                                       |
| --------- | ------------------------------------------------- |
| **Admin** | Full access — manage all issues, users, reports   |
| **User**  | Manage own issues, view dashboard, update profile |

## 📝 Scripts

### Backend

```bash
npm run dev          # Start dev server (tsx watch)
npm run build        # Compile TypeScript
npm run start        # Run compiled production build
npm run seed         # Seed admin + normal users
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply Drizzle migrations
npm run db:push      # Push schema directly (dev convenience)
npm run db:studio    # Open Drizzle Studio
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Auto-fix ESLint issues
npm run format   # Format with Prettier
```
