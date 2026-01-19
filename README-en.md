# GigSpot — Installation Guide

## Prerequisites

- **Node.js** 20+
- **pnpm** (recommended) or npm
- **Docker** (for PostgreSQL database)

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd gigspot
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
# Database (Docker)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gigspot

# Database connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gigspot

# NextAuth
NEXTAUTH_SECRET=   # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000 # OPTIONAL: The base URL of the application. For local development it's always http://localhost:3000. Only needs to change in production.

# UploadThing (get token at https://uploadthing.com)
UPLOADTHING_TOKEN=your-uploadthing-token
```

### 3. Start the Database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port 5432.

### 4. Run Database Migrations

```bash
pnpm db:migrate
```

### 5. Start the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command            | Description                                 |
|--------------------|---------------------------------------------|
| `pnpm dev`         | Start development server                    |
| `pnpm build`       | Build for production                        |
| `pnpm start`       | Start production server                     |
| `pnpm lint`        | Run ESLint                                  |
| `pnpm format`      | Format code with Prettier                   |
| `pnpm db:generate` | Generate new migration after schema changes |
| `pnpm db:migrate`  | Apply database migrations                   |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Auth pages (login, signup)
│   ├── api/                # API endpoints
│   ├── events/             # Event pages
│   ├── profile/            # User profile
│   └── users/              # Public user profiles
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── db/                     # Database connection and schema
├── domain/                 # Domain layer (business logic)
│   ├── entities/           # Entity type definitions
│   ├── errors.ts           # Domain error classes
│   ├── repositories/       # Repository interfaces
│   ├── services/           # Business logic services
│   └── validation/         # Zod validation schemas
├── infrastructure/         # Infrastructure layer
│   ├── repositories/       # Repository implementations
│   ├── schemas/            # DB-to-domain mapping schemas
│   └── security/           # Password hashing
└── lib/                    # Shared utilities
```

---

## Architecture Overview

The project follows a layered architecture:

- **Domain Layer** — Contains business logic, entities, validation schemas, and repository interfaces.
- **Infrastructure Layer** — Implements repositories using Drizzle ORM, handles database operations.
- **Application Layer** — Next.js pages, API routes, React components.

Dependency injection is managed via `src/container.ts`.

---

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). To add a new component:

```bash
npx shadcn@latest add <component-name>
```

Components are placed in `src/components/ui/`.

---

## Database Schema Changes

1. Edit `src/db/schema.ts`
2. Generate a migration:
   ```bash
   pnpm db:generate
   ```
3. Apply the migration:
   ```bash
   pnpm db:migrate
   ```

---

## User Roles

- **User** — Can browse events, attend events, follow organizers
- **Organizer** — Can create/edit/delete events, upload flyers, view followers

Role is selected during registration and determines available features.
