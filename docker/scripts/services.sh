#!/bin/bash

# Jemputanku Docker Services Management Script
# Usage: ./docker/scripts/services.sh [start|start-all|start-mailpit|stop|stop-all|restart|logs|backup|restore|reset]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
}

check_compose() {
    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose is not installed or not in PATH"
        exit 1
    fi
}

start_database() {
    log_info "Starting PostgreSQL database..."
    check_docker
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local up -d postgres
    
    log_info "Waiting for database to be ready..."
    sleep 5
    
    # Wait for database to be healthy
    timeout=30
    while [ $timeout -gt 0 ]; do
        if docker exec jemputanku-postgres pg_isready -U jemputanku_user &> /dev/null; then
            log_info "Database is ready!"
            break
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    
    if [ $timeout -eq 0 ]; then
        log_error "Database failed to start within 30 seconds"
        exit 1
    fi
    
    log_info "PostgreSQL is running on port 5432"
    log_info "Connection string: postgresql://jemputanku_user:PASSWORD@localhost:5432/jemputanku_db"
}

stop_database() {
    log_info "Stopping PostgreSQL database..."
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local stop postgres pgadmin
    
    log_info "Database stopped"
}

restart_database() {
    log_info "Restarting PostgreSQL database..."
    stop_database
    start_database
}

show_logs() {
    log_info "Showing PostgreSQL logs..."
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local logs -f postgres
}

backup_db() {
    local backup_file="${1:-backup_$(date +%Y%m%d_%H%M%S).sql}"
    
    log_info "Creating database backup: $backup_file"
    
    if ! docker exec jemputanku-postgres pg_isready -U jemputanku_user &> /dev/null; then
        log_error "Database is not running"
        exit 1
    fi
    
    docker exec jemputanku-postgres pg_dump -U jemputanku_user -d jemputanku_db > "$backup_file"
    
    log_info "Backup created: $backup_file"
}

restore_db() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        log_error "Please provide backup file path"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_warn "This will restore database from $backup_file"
    log_warn "All current data will be lost!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Restore cancelled"
        exit 0
    fi
    
    if ! docker exec jemputanku-postgres pg_isready -U jemputanku_user &> /dev/null; then
        log_error "Database is not running"
        exit 1
    fi
    
    log_info "Restoring database from $backup_file..."
    docker exec -i jemputanku-postgres psql -U jemputanku_user -d jemputanku_db < "$backup_file"
    
    log_info "Database restored successfully"
}

reset_db() {
    log_warn "This will completely reset the database!"
    log_warn "All data and volumes will be deleted!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Reset cancelled"
        exit 0
    fi
    
    log_info "Resetting database..."
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local down -v
    docker volume prune -f
    
    log_info "Starting fresh database..."
    start_db
    
    log_info "Database reset completed"
    log_warn "Don't forget to run: pnpm prisma:migrate"
}

start_all() {
    log_info "Starting all services (PostgreSQL, pgAdmin, Mailpit)..."
    check_docker
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local up -d
    
    log_info "Services started:"
    log_info "  - PostgreSQL: localhost:5432"
    log_info "  - pgAdmin: http://localhost:8080"
    log_info "  - Mailpit: http://localhost:8026 (SMTP: 1026)"
}

start_mailpit() {
    log_info "Starting Mailpit email server..."
    check_docker
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local up -d mailpit
    
    log_info "Mailpit started:"
    log_info "  - Web interface: http://localhost:${MAILPIT_WEB_PORT:-8025}"
    log_info "  - SMTP server: localhost:${MAILPIT_SMTP_PORT:-1025}"
}

stop_all() {
    log_info "Stopping all services..."
    check_compose
    
    cd "$PROJECT_ROOT"
    docker-compose --env-file .env.local stop
    
    log_info "All services stopped"
}

show_help() {
    echo "Jemputanku Docker Services Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "🗄️  Database Commands:"
    echo "  start, start-db      Start PostgreSQL database only"
    echo "  stop, stop-db        Stop PostgreSQL database only" 
    echo "  restart, restart-db  Restart PostgreSQL database"
    echo "  logs                 Show PostgreSQL logs"
    echo "  backup [file]        Create database backup"
    echo "  restore <file>       Restore database from backup"
    echo "  reset                Reset database (WARNING: deletes all data)"
    echo ""
    echo "🚀 Services Commands:"
    echo "  start-all            Start all services (PostgreSQL, pgAdmin, Mailpit)"
    echo "  start-mailpit        Start Mailpit email server only"
    echo "  stop-all             Stop all services"
    echo ""
    echo "❓ Other:"
    echo "  help                 Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 start-all                    # Start all services"
    echo "  $0 start                        # Start PostgreSQL only"
    echo "  $0 start-mailpit                # Start Mailpit only"
    echo "  $0 backup my_backup.sql         # Create database backup"
    echo "  $0 restore my_backup.sql        # Restore from backup"
}

# Main script
case "${1:-}" in
    "start"|"start-db")
        start_database
        ;;
    "start-all")
        start_all
        ;;
    "start-mailpit")
        start_mailpit
        ;;
    "stop"|"stop-db")
        stop_database
        ;;
    "stop-all")
        stop_all
        ;;
    "restart"|"restart-db")
        restart_database
        ;;
    "logs")
        show_logs
        ;;
    "backup")
        backup_db "$2"
        ;;
    "restore")
        restore_db "$2"
        ;;
    "reset")
        reset_db
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        log_error "Unknown command: ${1:-}"
        echo ""
        show_help
        exit 1
        ;;
esac