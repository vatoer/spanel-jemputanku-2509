# Database Seeding

This directory contains database seeders for the JemputanKu project.

## Overview

The seeding system creates comprehensive test data for the multi-tenant transportation management system, including:

- **Subscription Plans** - Different pricing tiers (Basic, Professional, Enterprise, Startup)
- **Tenants** - Transportation companies with active subscriptions
- **Users** - Tenant owners, administrators, drivers, and platform admins
- **Vehicles** - Fleet vehicles with complete specifications and service records
- **Routes** - Transportation routes with stops and GPS coordinates

## Seeding Order

1. **Subscription Plans** - Creates pricing plans first
2. **Tenants** - Creates transportation companies and assigns subscriptions
3. **Users** - Creates users and assigns them to tenants with appropriate roles
4. **Vehicles** - Creates fleet vehicles and assigns drivers
5. **Routes** - Creates routes with stops and assigns vehicles

## Usage

### Run Complete Seeding
```bash
pnpm prisma:seed
```

### Individual Seeders
The seeders are modular and can be run individually by importing specific functions.

## Sample Data Created

### Tenants
- **JemputanKu Demo** - Basic plan demo tenant
- **TransJakarta** - Enterprise plan with multiple vehicles and routes
- **Kopaja** - Professional plan traditional bus operator
- **Metro Mini** - Basic plan small vehicle operator  
- **Busway Express** - Trial plan intercity service

### Vehicles
- Various vehicle types: buses, minibuses, vans
- Complete specifications: license plates, capacity, year, etc.
- Service records and maintenance history
- Driver assignments

### Routes
- Real Jakarta transportation routes
- GPS coordinates for all stops
- Origin and destination points
- Vehicle assignments to routes

### Users & Roles
- Tenant owners and administrators
- Drivers assigned to vehicles
- Platform administrators
- Proper role-based access control

## Database Schema Compliance

All seeders are fully compliant with the Prisma schema and include:
- Proper foreign key relationships
- Enum value validation
- Required field constraints
- Unique constraint handling

## Environment Requirements

- PostgreSQL database running
- Prisma client generated
- All migrations applied

## Error Handling

- Uses upsert operations to prevent duplicate data
- Handles missing foreign key relationships gracefully
- Logs progress and completion status