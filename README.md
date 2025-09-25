# Jemputanku - Shuttle Management System

A modern shuttle management system built with Next.js, Firebase Authentication, and Prisma.

## 🚀 Features

- **Firebase Authentication**: OAuth-only authentication (Google Sign-in) with no password storage
- **Hybrid Architecture**: Firebase for authentication, Prisma for business data
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Form Validation**: Zod schemas with React Hook Form
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with responsive layouts

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Firebase Auth (OAuth only - Google)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- pnpm package manager
- PostgreSQL database running
- Firebase project setup

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd spanel-jemputanku-2509
pnpm install
```

### 2. Database Setup

Start your PostgreSQL database and create a database named `jemputanku`.

### 3. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your actual values:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jemputanku?schema=public"
```

### 4. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and configure Google as a sign-in provider
3. Get your Firebase config from Project Settings
4. Generate a service account key for Firebase Admin SDK
5. Update your `.env` file with the Firebase credentials

### 5. Database Migration

Run the Prisma migration to set up your database schema:

```bash
pnpm prisma:dbpush
```

Generate Prisma client:

```bash
pnpm prisma:generate
```

### 6. Start Development Server

```bash
pnpm dev
```

Your application will be available at `http://localhost:3000`.

## 📱 Application Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── api/              # API routes
├── components/           # React components
│   ├── auth/            # Authentication forms
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utility libraries
│   ├── firebase.ts      # Firebase client config
│   ├── firebase-admin.ts # Firebase admin config
│   └── utils.ts         # General utilities
└── schemas/             # Zod validation schemas
    ├── auth.ts          # Auth form schemas
    └── login.ts         # Login form schema
```

## 🔐 Authentication Flow

1. **User Registration/Login**: Users can sign up or log in using Google OAuth or email/password
2. **Firebase Authentication**: Handles all authentication logic
3. **User Sync**: Firebase users are automatically synced to your Prisma database
4. **Session Management**: Firebase handles session persistence and management
5. **Protected Routes**: Dashboard and other protected routes check authentication status

## 🚀 Key Features

### Firebase + Prisma Hybrid Architecture

- **Firebase Auth**: Handles authentication, OAuth providers, session management
- **Prisma Database**: Stores business data, user profiles, and application-specific information
- **Automatic Sync**: Firebase users are automatically synced to your database
- **No Password Storage**: Using OAuth-only approach eliminates password security concerns

### Form Validation with Zod + React Hook Form

- Type-safe form validation using Zod schemas
- React Hook Form for optimal performance and user experience
- Comprehensive error handling and validation messages
- Support for complex form structures

### Modern UI Components

- Built with shadcn/ui component library
- Fully responsive design
- Accessible components following WAI-ARIA guidelines

## 🛡️ Security

- **OAuth-only Authentication**: No passwords stored in your database
- **Firebase Security Rules**: Configure Firebase security rules for your project
- **Environment Variables**: Sensitive data stored in environment variables
- **HTTPS Only**: Firebase requires HTTPS for production

## 📊 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:dbpush` - Push schema changes to database
- `pnpm prisma:generate` - Generate Prisma client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using Next.js, Firebase, and Prisma
