# User Sync Development Guide

## Overview
This guide covers testing and debugging the Firebase user sync functionality during development.

## The Problem
When new users log in with Google, the app was throwing a 500 error due to race conditions in user creation.

## The Solution
- ✅ **Transaction-based sync**: Replaced `upsert` with explicit `find-then-create/update`
- ✅ **Race condition protection**: Added syncing flag in AuthContext
- ✅ **Better error handling**: Detailed logging and error messages

## Testing the Fix

### 1. Test Database Logic (Without Firebase)
```bash
# Test new user creation
curl -X POST http://localhost:3000/api/auth/test-sync \
  -H "Content-Type: application/json" \
  -d '{"uid":"test_123","email":"newuser@test.com","name":"Test User","emailVerified":true}'

# Test existing user update  
curl -X POST http://localhost:3000/api/auth/test-sync \
  -H "Content-Type: application/json" \
  -d '{"uid":"test_456","email":"newuser@test.com","name":"Updated User","emailVerified":true}'
```

### 2. Test Real Firebase Sync
```bash
# Should reject invalid UIDs
curl -X POST http://localhost:3000/api/auth/sync-user \
  -H "Content-Type: application/json" \
  -d '{"uid":"invalid","email":"test@test.com","name":"Test","emailVerified":true}'
```

### 3. Clean Up Test Users

#### Option A: Complete Cleanup (Recommended)
```bash
curl -X DELETE http://localhost:3000/api/auth/cleanup-user \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

#### Option B: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Authentication → Users
3. Delete the test user manually

### 4. Check Database
```bash
# View all users
docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
  -c "SELECT email, name, \"firebaseUid\" FROM users;"

# Check specific user by email
docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
  -c "SELECT id, email, name, \"firebaseUid\", created_at FROM users WHERE email = 'your-email@gmail.com';"

# Count total users
docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
  -c "SELECT COUNT(*) as total_users FROM users;"

# Check user roles
docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
  -c "SELECT u.email, r.name as role FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id;"

# Check if user exists (returns 1 if exists, 0 if not)
docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
  -c "SELECT EXISTS(SELECT 1 FROM users WHERE email = 'your-email@gmail.com') as user_exists;"

# View recent users (last 10)
docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
  -c "SELECT email, name, created_at FROM users ORDER BY created_at DESC LIMIT 10;"
```

## Testing New User Login

1. **Clean up existing user**:
   ```bash
   curl -X DELETE http://localhost:3000/api/auth/cleanup-user \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@gmail.com"}'
   ```

2. **Verify user is deleted**:
   ```bash
   docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
     -c "SELECT EXISTS(SELECT 1 FROM users WHERE email = 'your-email@gmail.com') as user_exists;"
   ```
   Should return: `user_exists | f` (false)

3. **Login with Google** in the browser

4. **Verify user is created**:
   ```bash
   docker exec jemputanku-postgres psql -U jemputanku_user -d jemputanku_db \
     -c "SELECT id, email, name, \"firebaseUid\", created_at FROM users WHERE email = 'your-email@gmail.com';"
   ```
   Should return the new user record

5. **Expected Result**: ✅ No 500 error, user created successfully

## Debugging

### Server Logs
Look for these logs during sync:
```
Sync user request: { uid: '...', email: '...', name: '...', emailVerified: true }
Creating new user: email@example.com
User sync successful: { id: '...', email: '...' }
```

### Common Issues
- **"Invalid Firebase user"**: Expected for test UIDs
- **Race condition errors**: Should be fixed with transactions
- **Port conflicts**: Make sure only one dev server is running

## Development Endpoints

⚠️ **Remove before production!**

- `POST /api/auth/test-sync` - Test sync without Firebase validation
- `DELETE /api/auth/cleanup-user` - Clean up test users completely
- `DELETE /api/auth/delete-firebase-user` - Delete only from Firebase

## Files Modified

- `src/app/api/auth/sync-user/route.ts` - Main sync logic with transactions
- `src/contexts/AuthContext.tsx` - Added race condition protection
- `src/app/api/auth/test-sync/route.ts` - Testing endpoint
- `src/app/api/auth/cleanup-user/route.ts` - Cleanup utility