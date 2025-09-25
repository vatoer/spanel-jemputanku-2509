import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Mock database - Replace with actual database integration
let users: Array<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string;
  company: string;
  role: string;
  createdAt: Date;
  emailVerified: boolean;
}> = [];

interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  role: string;
  agreementAccepted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();

    // Validate required fields
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      role,
      agreementAccepted,
    } = body;

    if (!firstName || !lastName || !email || !password || !phone || !company || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!agreementAccepted) {
      return NextResponse.json(
        { message: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone.trim(),
      company: company.trim(),
      role,
      createdAt: new Date(),
      emailVerified: false,
    };

    // Save user (in real app, save to database)
    users.push(newUser);

    // TODO: Send verification email
    // await sendVerificationEmail(newUser.email, newUser.id);

    // Return success response (don't include sensitive data)
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          company: newUser.company,
          role: newUser.role,
          createdAt: newUser.createdAt,
          emailVerified: newUser.emailVerified,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle specific errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// GET endpoint to check if email is available
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required" },
      { status: 400 }
    );
  }

  const existingUser = users.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );

  return NextResponse.json({
    available: !existingUser,
    message: existingUser 
      ? "Email is already registered" 
      : "Email is available"
  });
}