#!/bin/bash

# Jemputanku Database Setup Script
# This script sets up the PostgreSQL database using Docker

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Setting up Jemputanku PostgreSQL Database${NC}"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running.${NC}"
    echo "Please start Docker Desktop or run: sudo systemctl start docker"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed. Please install docker-compose first.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from template...${NC}"
    cp .env.example .env.local
    
    echo -e "${YELLOW}📝 Please update the password in .env.local before continuing!${NC}"
    echo "Edit the following line:"
    echo "DATABASE_URL=\"postgresql://jemputanku_user:YOUR_SECURE_PASSWORD@localhost:5432/jemputanku_db\""
    echo ""
    read -p "Press Enter after updating the password..."
fi

# Create .env symlink for Prisma compatibility
echo -e "${GREEN}🔗 Creating .env symlink for Prisma...${NC}"
ln -sf .env.local .env

echo -e "${GREEN}🐳 Starting PostgreSQL container...${NC}"
./docker/scripts/services.sh start-db

echo -e "${GREEN}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Check if database is ready
timeout=30
while [ $timeout -gt 0 ]; do
    if docker exec jemputanku-postgres pg_isready -U jemputanku_user &> /dev/null; then
        echo -e "${GREEN}✅ Database is ready!${NC}"
        break
    fi
    echo "Waiting for database..."
    sleep 2
    timeout=$((timeout - 2))
done

if [ $timeout -le 0 ]; then
    echo -e "${RED}❌ Database failed to start within 30 seconds${NC}"
    exit 1
fi

echo -e "${GREEN}🔧 Running Prisma migrations...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm prisma:migrate
    pnpm prisma:generate
elif command -v npm &> /dev/null; then
    npm run prisma:migrate
    npm run prisma:generate
else
    echo -e "${YELLOW}⚠️  Please install pnpm or npm and run:${NC}"
    echo "pnpm prisma:migrate && pnpm prisma:generate"
fi

echo ""
echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo ""
echo "📊 Database Information:"
echo "  - Host: localhost"
echo "  - Port: 5432"
echo "  - Database: jemputanku_db" 
echo "  - User: jemputanku_user"
echo ""
echo "🔧 Useful commands:"
echo "  - Start all services: pnpm services:start"
echo "  - Start database only: pnpm db:start"
echo "  - Start Mailpit only: pnpm mailpit:start"
echo "  - Stop all services: pnpm services:stop"
echo "  - View logs: pnpm db:logs"
echo "  - Backup database: pnpm db:backup"
echo "  - Open Prisma Studio: pnpm prisma:studio"
echo ""
echo "🌐 Service Access:"
echo "  - pgAdmin: http://localhost:8080"
echo "  - Mailpit: http://localhost:8026"
echo "  - Login: admin@jemputanku.com / admin123"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"