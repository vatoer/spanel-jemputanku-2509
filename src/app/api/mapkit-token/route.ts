import { generateMapKitJWT } from "@/lib/mapkit";
import { NextRequest, NextResponse } from "next/server";

// TODO: Ganti dengan data asli dari Apple Developer
const TEAM_ID = process.env.MAPKIT_TEAM_ID || "YOUR_TEAM_ID";
const KEY_ID = process.env.MAPKIT_KEY_ID || "YOUR_KEY_ID";
const PRIVATE_KEY = (process.env.MAPKIT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const ORIGIN = process.env.MAPKIT_ORIGIN || "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    // Return demo token in development if credentials not configured
    if (process.env.NODE_ENV === 'development' && 
        (!process.env.MAPKIT_TEAM_ID || process.env.MAPKIT_TEAM_ID === 'YOUR_TEAM_ID')) {
      return new NextResponse("DEMO_TOKEN_FOR_DEVELOPMENT", { status: 200 });
    }
    
    const token = generateMapKitJWT();
    return new NextResponse(token, { status: 200 });
  } catch (error) {
    console.error('MapKit token generation failed:', error);
    return new NextResponse("DEMO_TOKEN_FALLBACK", { status: 200 });
  }
}
