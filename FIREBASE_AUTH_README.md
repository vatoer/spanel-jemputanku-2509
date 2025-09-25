# Firebase Server-Side Authentication with Next.js

This implementation provides secure server-side authentication using Firebase Admin SDK with Next.js middleware, similar to NextAuth.js but using Firebase as the authentication provider.

## 🚀 Features

- ✅ **Server-side token verification** using Firebase Admin SDK
- ✅ **Next.js middleware protection** for authenticated routes
- ✅ **Automatic token management** with cookie storage and refresh
- ✅ **Role-based access control** with custom claims
- ✅ **Server Components support** with `getServerUser()`
- ✅ **Protected API routes** with HOF utilities
- ✅ **Automatic redirects** for authenticated/unauthenticated users

## 📁 File Structure

```
src/
├── lib/
│   ├── firebase.ts              # Client-side Firebase config
│   ├── firebase-admin.ts        # Server-side Firebase Admin SDK
│   └── server-auth.ts           # Server-side auth utilities
├── contexts/
│   └── AuthContext.tsx          # Enhanced auth context with token management
├── middleware.ts                # Route protection middleware
└── app/
    ├── api/
    │   ├── auth/
    │   │   └── verify/route.ts   # Token verification endpoint
    │   └── protected/route.ts    # Example protected API route
    └── server-protected/
        └── page.tsx              # Example server-protected page
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with your Firebase configuration:

```bash
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"

# Or use base64 encoded service account (Production recommended)
FIREBASE_SERVICE_ACCOUNT_KEY=base64_encoded_service_account_json
```

### 2. Firebase Admin SDK Setup

The Firebase Admin SDK is configured in `src/lib/firebase-admin.ts` with:
- Automatic initialization with fallback methods
- Token verification utilities
- User management functions
- Custom claims support

### 3. Middleware Configuration

The middleware in `src/middleware.ts` automatically:
- Protects authenticated routes (`/admin-dashboard`, `/profile`, etc.)
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages
- Verifies tokens server-side for security

## 🛡️ Usage Examples

### Protected API Route

```typescript
import { withAuth } from '@/lib/server-auth'

export const GET = withAuth(async (user, request) => {
  // User is guaranteed to be authenticated
  return NextResponse.json({ 
    message: 'Hello authenticated user!',
    email: user.email 
  })
})
```

### Server Component with Authentication

```typescript
import { getServerUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const user = await getServerUser()
  
  if (!user) {
    redirect('/login')
  }

  return <div>Welcome {user.email}!</div>
}
```

### Role-Based Protection

```typescript
import { withRole } from '@/lib/server-auth'

export const GET = withRole('admin', async (user, request) => {
  // Only users with 'admin' role can access this
  return NextResponse.json({ adminData: 'secret' })
})
```

### Client-Side Token Access

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { getToken } = useAuth()
  
  const makeAuthenticatedRequest = async () => {
    const token = await getToken()
    const response = await fetch('/api/protected', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}
```

## 🔐 Security Features

### Token Management
- **Automatic token refresh** every 50 minutes
- **Secure cookie storage** with proper flags
- **Server-side verification** on every protected request
- **Automatic cleanup** on sign out

### Route Protection
- **Middleware-level protection** before page rendering
- **Server-side verification** in API routes
- **Automatic redirects** based on authentication state
- **Support for query params** in redirects

### Role-Based Access Control
- **Custom claims** support through Firebase Admin
- **Role checking utilities** for fine-grained permissions
- **HOF wrappers** for protected routes with roles

## 🚦 Route Types

### Public Routes
- `/` - Landing page
- `/login` - Authentication page
- `/signup` - Registration page

### Protected Routes (Require Authentication)
- `/admin-dashboard` - Main dashboard
- `/profile` - User profile
- `/settings` - User settings
- `/notifications` - Notifications center

### API Routes
- `/api/auth/verify` - Token verification
- `/api/protected/*` - Protected API endpoints

## 🔄 Authentication Flow

1. **User logs in** via Firebase client SDK
2. **ID token generated** and stored in secure cookie
3. **Middleware verifies token** on protected route access
4. **Server components** can access user data server-side
5. **API routes** verify tokens automatically
6. **Token refreshes** automatically before expiration

## 🛠️ Utilities Reference

### Server-Side Functions

- `getServerUser(request?)` - Get authenticated user server-side
- `requireServerAuth(request?)` - Require auth or throw error
- `hasRole(role, request?)` - Check if user has specific role
- `withAuth(handler)` - HOF for protected API routes
- `withRole(role, handler)` - HOF for role-protected routes

### Client-Side Hooks

- `useAuth()` - Access auth context
- `useRequireAuth()` - Require auth in components
- `getToken()` - Get current Firebase ID token

## 🚀 Benefits Over Client-Only Auth

1. **Better Security** - Token verification on server prevents tampering
2. **SEO Friendly** - Protected pages can render server-side
3. **Performance** - Faster initial page loads with server data
4. **Reliability** - Works without JavaScript enabled
5. **Middleware Protection** - Route-level security before rendering

## 🔧 Troubleshooting

### Common Issues

1. **"Token verification failed"**
   - Check Firebase Admin SDK configuration
   - Verify service account permissions
   - Ensure token is not expired

2. **"Authentication required" on protected routes**
   - Check if token cookie is being set
   - Verify middleware configuration
   - Check network tab for verification requests

3. **Infinite redirects**
   - Check middleware route matching
   - Verify public/protected route definitions
   - Check token verification endpoint

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```bash
NODE_ENV=development
```

This will log authentication attempts and token verification in the console.

## 📚 Further Reading

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Firebase Authentication Best Practices](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

---

This implementation provides enterprise-grade authentication security while maintaining the developer experience of Firebase Auth with the benefits of server-side rendering and protection.