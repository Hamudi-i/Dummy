# Project File Structure

```text
backend-starter-pack/
├── .env.example                     # Sample environment variable configuration
├── .gitignore                       # Git ignore rules
├── DEPLOYMENT.md                    # Deployment instructions (Render, Railway, Docker)
├── docker-compose.yml               # Local Docker services (PostgreSQL, MinIO)
├── LICENSE                          # Project license
├── package.json                     # Project dependencies, scripts, and metadata
├── package-lock.json                # Locked dependency tree
├── prisma.config.ts                 # Prisma configuration & client generation settings
├── railway.json                     # Railway deployment configuration
├── render.yaml                      # Render Blueprint deployment configuration
├── skills-lock.json                 # Agent / IDE skill configuration lock file
├── tsconfig.json                    # TypeScript compiler configuration
├── README.md                        # Project overview and getting started guide
│
├── prisma/                          # Prisma ORM schema & migrations
│   ├── migrations/                  # Database migration history
│   │   ├── 20260826130810_init/     # Initial migration SQL scripts
│   │   │   └── migration.sql
│   │   └── migration_lock.toml      # Engine migration lockfile
│   └── schema.prisma                # Prisma data models and database provider setup
│
├── scripts/                         # Utility and automation scripts
│   └── seed.ts                      # Database seeding script (initial admin/user data)
│
└── src/                             # Application source code
    ├── index.ts                     # Main application entry point & Express server bootstrap
    ├── test-db.ts                   # Database connection test utility
    │
    ├── common/                      # Shared helper utilities and core integrations
    │   ├── email.ts                 # Brevo (Sendinblue) transactional email service
    │   ├── global-config.ts         # Environment variables validation & centralized configuration
    │   ├── minio-service.ts         # MinIO / S3 object storage upload & download client
    │   └── utils.ts                 # Shared helper functions (hashing, tokens, pagination)
    │
    ├── controllers/                 # Request handlers & HTTP responses
    │   ├── auth-controller.ts       # Authentication endpoints (login, register, reset password)
    │   └── users-controller.ts      # User management & profile CRUD controllers
    │
    ├── infrastructure/              # Infrastructure-level abstractions & database clients
    │   ├── http-exceptions.ts       # Custom HTTP error classes (BadRequest, NotFound, etc.)
    │   ├── prisma.ts                # Prisma Client instance & pg adapter initialization
    │   └── filters/                 # Global error handling and formatting
    │       ├── exception-filter.ts  # Express error-handling middleware
    │       └── exception-handler.ts # Error formatters and uncaught exception catchers
    │
    ├── libs/                        # Utility libraries & query builders
    │   └── filter-operators.ts      # Dynamic Prisma filter and pagination operator utilities
    │
    ├── middleware/                  # Express middleware functions
    │   ├── auth.ts                  # JWT authentication & role-based authorization guards
    │   └── file-uploader.ts         # Multer multipart file upload middleware
    │
    ├── routes/                      # API route definitions & router mapping
    │   ├── auth-route.ts            # `/api/v1/auth` routing rules
    │   └── users-route.ts           # `/api/v1/users` routing rules
    │
    └── services/                    # Business logic and database operations
        ├── auth-service.ts          # Core authentication & credential verification logic
        └── user-service.ts          # User querying, creation, updating, and deletion logic
```

---

## Directory & File Overview

### Root Level

- **[`package.json`](./package.json)**: Declares Node.js dependencies (`express`, `@prisma/client`, `pg`, `jsonwebtoken`, `bcrypt`, `minio`, `@getbrevo/brevo`), build scripts, and engine specifications.
- **[`tsconfig.json`](./tsconfig.json)**: TypeScript compiler configuration targeting Node.js execution.
- **[`docker-compose.yml`](./docker-compose.yml)**: Sets up containerized services for local development, such as PostgreSQL and MinIO storage.
- **[`.env.example`](./.env.example)**: Reference document containing all required and optional environment keys (Database URL, JWT secrets, MinIO, Brevo, SMTP).
- **[`render.yaml`](./render.yaml)** & **[`railway.json`](./railway.json)**: Cloud hosting platform build and deployment configs.

---

### Database Layer (`prisma/` & `scripts/`)

- **[`prisma/schema.prisma`](./prisma/schema.prisma)**: Defines data models, relationships, field constraints, and PostgreSQL connection settings.
- **[`prisma/migrations/`](./prisma/migrations/)**: Version-controlled SQL migration files generated by Prisma Migrate.
- **[`scripts/seed.ts`](./scripts/seed.ts)**: Seeds initial records (e.g. default admin, roles, or lookup data) into the database.

---

### Application Core (`src/`)

#### 1. Entry Point

- **[`src/index.ts`](./src/index.ts)**: Initializes Express app, registers global middlewares (CORS, JSON parser, URL encoding), mounts API routers, and attaches global error filters.

#### 2. Routes (`src/routes/`)

- **[`src/routes/auth-route.ts`](./src/routes/auth-route.ts)**: Maps authentication endpoints (`/login`, `/register`, `/forgot-password`, etc.) to `auth-controller.ts`.
- **[`src/routes/users-route.ts`](./src/routes/users-route.ts)**: Maps user resource routes (`/users`, `/users/:id`, `/users/avatar`, etc.) to `users-controller.ts`.

#### 3. Controllers (`src/controllers/`)

- **[`src/controllers/auth-controller.ts`](./src/controllers/auth-controller.ts)**: Handles incoming auth requests, extracts input data, delegates logic to `auth-service.ts`, and returns standard HTTP responses.
- **[`src/controllers/users-controller.ts`](./src/controllers/users-controller.ts)**: Handles request/response lifecycles for user operations.

#### 4. Services (`src/services/`)

- **[`src/services/auth-service.ts`](./src/services/auth-service.ts)**: Contains core authentication logic, password verification (bcrypt), and JWT generation.
- **[`src/services/user-service.ts`](./src/services/user-service.ts)**: Executes database queries via Prisma for user retrieval, updates, and filtering.

#### 5. Middleware (`src/middleware/`)

- **[`src/middleware/auth.ts`](./src/middleware/auth.ts)**: Verifies incoming JWT bearer tokens, decodes user payload, and attaches `req.user`.
- **[`src/middleware/file-uploader.ts`](./src/middleware/file-uploader.ts)**: Configures Multer memory storage / file handling for file uploads (e.g., avatars, attachments).

#### 6. Common & Services (`src/common/`)

- **[`src/common/global-config.ts`](./src/common/global-config.ts)**: Centralized environment variable validator and config object.
- **[`src/common/email.ts`](./src/common/email.ts)**: Wrapper for Brevo (Sendinblue) transactional email API.
- **[`src/common/minio-service.ts`](./src/common/minio-service.ts)**: Handles S3/MinIO bucket creation, file upload, and pre-signed URL generation.
- **[`src/common/utils.ts`](./src/common/utils.ts)**: General reusable utility functions.

#### 7. Infrastructure (`src/infrastructure/`)

- **[`src/infrastructure/prisma.ts`](./src/infrastructure/prisma.ts)**: Instantiates and exports the singleton `PrismaClient` using `@prisma/adapter-pg`.
- **[`src/infrastructure/http-exceptions.ts`](./src/infrastructure/http-exceptions.ts)**: Custom domain error classes with HTTP status codes.
- **[`src/infrastructure/filters/`](./src/infrastructure/filters/)**: Intercepts unhandled errors and formats clean JSON error responses for the client.
