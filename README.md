# User Management System

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (if not using Docker)
- Redis (if not using Docker)

## 🚀 Running with Docker (Recommended)

### 1. Clone the repository
```bash
git clone <repository-url>
cd user-system
```

### 2. Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Local Development

### 1. Configure the Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit the .env file with your configurations

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start development server
npm run start:dev
```

### 2. Configure the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Database Configuration

### Using Docker (Automatic)
Docker Compose automatically configures PostgreSQL and Redis.

### Manual Configuration
```sql
-- Execute the database-setup.sql script
psql -U postgres -f database-setup.sql
```

### Environment Variables
```env
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/userdb?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### User Roles
- **USER** - Default user
- **ADMIN** - Administrator with special privileges

## API Endpoints

### Authentication (Public)
- `POST /auth/login` - Login
- `POST /auth/register` - Registration

### Public Users (No Authentication)
- `GET /public/users` - List users (view only)
- `GET /public/users/:id` - Get specific user

### Protected Users (Requires Authentication)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Remove user

### Payload Examples

**Registration/Login:**
```json
{
  "name": "John Silva",
  "email": "john@example.com",
  "password": "123456",
  "role": "USER"
}
```

**Authentication Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Silva",
    "email": "john@example.com",
    "role": "USER",
    "isActive": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Running Tests

### Backend
```bash
cd backend

# Unit tests
npm run test

# Tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```