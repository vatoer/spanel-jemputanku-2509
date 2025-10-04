# 🚀 Jemputanku Development Services

## Quick Start

```bash
# Start all services (recommended for development)
pnpm services:start

# Or start individual services
pnpm db:start          # PostgreSQL only
pnpm mailpit:start     # Mailpit only
```

## Available Services

| Service | Port | Access | Purpose |
|---------|------|--------|---------|
| **PostgreSQL** | 5432 | `localhost:5432` | Main database |
| **pgAdmin** | 8080 | http://localhost:8080 | Database admin UI |
| **Mailpit** | 8026 | http://localhost:8026 | Email testing UI |
| **Mailpit SMTP** | 1026 | `localhost:1026` | Email server |

## NPM Scripts

### 🚀 Services Management
- `pnpm services:start` - Start all services
- `pnpm services:stop` - Stop all services
- `pnpm dev:services` - Start services + Next.js dev server

### 🗄️ Database Only
- `pnpm db:start` - Start PostgreSQL
- `pnpm db:stop` - Stop PostgreSQL  
- `pnpm db:restart` - Restart PostgreSQL
- `pnpm db:logs` - View database logs
- `pnpm db:backup` - Create backup
- `pnpm db:reset` - Reset database ⚠️
- `pnpm db:setup` - Complete database setup

### 📧 Email Testing
- `pnpm mailpit:start` - Start Mailpit only

### 🔧 Development
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:migrate` - Run migrations
- `pnpm prisma:generate` - Generate client

## Configuration

All services are configured via `.env.local`:

```env
# Database
DATABASE_URL="postgresql://jemputanku_user:password@localhost:5432/jemputanku_db"

# Email (for your application)
SMTP_HOST=localhost
SMTP_PORT=1026
SMTP_FROM_EMAIL=noreply@jemputanku.com
SMTP_FROM_NAME="Jemputanku"
```

## Direct Script Usage

```bash
# Using services script directly
./docker/scripts/services.sh start-all
./docker/scripts/services.sh start-db
./docker/scripts/services.sh start-mailpit
./docker/scripts/services.sh stop-all
./docker/scripts/services.sh help
```

## 🎯 Development Workflow

1. **Start all services**: `pnpm services:start`
2. **Run Next.js dev**: `pnpm dev`
3. **Open tools**:
   - App: http://localhost:3000
   - pgAdmin: http://localhost:8080
   - Mailpit: http://localhost:8026
   - Prisma Studio: `pnpm prisma:studio`

## 🛟 Troubleshooting

- **Port conflicts**: Check `.env.local` ports
- **Reset everything**: `pnpm services:stop && pnpm db:reset`
- **View logs**: `pnpm db:logs`
- **Check containers**: `docker ps`