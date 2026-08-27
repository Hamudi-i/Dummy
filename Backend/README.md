# Express + TypeScript + Prisma + PostgreSQL Starter Pack

A clean, modern backend starter pack built with **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL (Docker)** with JWT authentication, role management, and modular architecture.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (>= 20)
- **Framework:** Express 4
- **Language:** TypeScript 5
- **ORM:** Prisma 7 + `@prisma/adapter-pg`
- **Database:** PostgreSQL (running in Docker)
- **Authentication:** JWT (Access & Refresh tokens) + bcrypt password hashing

---

## 🚀 Quick Start

### 1. Start PostgreSQL with Docker
```bash
docker compose up -d
# or via npm script
npm run docker:up
```

### 2. Configure Environment Variables
Verify your `.env` contains your database connection string:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/workspace_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_SECRET_TOKEN=your-super-secret-refresh-key-change-in-production
BcryptHashRound=10
```

### 3. Run Migrations & Seed Database
```bash
# Push schema migrations to Docker PostgreSQL
npm run prisma:migrate

# Seed initial admin user
npm run seed
```
> Default Admin: `admin@example.com` / `Admin@12345`

### 4. Start the Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

## 📂 Project Structure

```
backend-starter-pack/
├── docker-compose.yml       # PostgreSQL Docker container configuration
├── prisma/
│   └── schema.prisma        # Prisma data models & schema definition
├── prisma.config.ts         # Prisma configuration file
├── src/
│   ├── index.ts             # Express server entry point
│   ├── infrastructure/
│   │   ├── prisma.ts        # Prisma Client singleton
│   │   ├── http-exceptions.ts # Custom API exceptions
│   │   └── filters/         # Centralized error filter
│   ├── controllers/         # Request handlers (auth, users)
│   ├── routes/              # Express route definitions
│   ├── services/            # Business logic & Prisma queries
│   ├── middleware/          # JWT Auth middleware
│   └── common/              # Utilities (JWT, bcrypt hashing)
├── scripts/
│   └── seed.ts              # Database seeding script
└── package.json
```

---

## 🔧 Working with Prisma in your New Project

### How to Add New Models
1. Open [`prisma/schema.prisma`](prisma/schema.prisma) and define your model:
   ```prisma
   model Product {
     id          String   @id @default(uuid())
     title       String
     description String?
     price       Float
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt

     @@map("products")
   }
   ```

2. Run migration to apply changes to PostgreSQL and regenerate the client:
   ```bash
   npm run prisma:migrate
   ```

3. Use the model in your services:
   ```typescript
   import prisma from "../infrastructure/prisma";

   const products = await prisma.product.findMany();
   ```

### Prisma Studio (Visual Database Browser)
Open a web interface to view, edit, and query your database data in real-time:
```bash
npm run prisma:studio
```
Available at `http://localhost:5555`.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server with auto-reload (`nodemon`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm run seed` | Seed database with default admin user |
| `npm run prisma:migrate` | Create and apply a new migration (`prisma migrate dev`) |
| `npm run prisma:generate` | Generate Prisma client types (`prisma generate`) |
| `npm run prisma:studio` | Open interactive database GUI (`prisma studio`) |
| `npm run docker:up` | Start PostgreSQL container in background |
| `npm run docker:down` | Stop PostgreSQL container |

---

## 🔐 API Endpoints

### Public & Health
- `GET /` — API root
- `GET /health` — Health check status

### Auth (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`{ email, password, name }`)
- `POST /api/auth/login` — Login with email/password (`{ email, password }`)
- `GET /api/auth/me` — Get current logged-in user profile (Requires `Bearer <token>`)

### Users (`/api/users`) (Protected)
- `GET /api/users` — List all users
- `GET /api/users/:id` — Get user by ID
- `POST /api/users` — Create user
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user
