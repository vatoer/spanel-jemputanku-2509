
import { generateMapKitJWT } from "@/lib/mapkit";
import { NextRequest, NextResponse } from "next/server";

type Point = { lat: number; lng: number };

  interface TokenResponseSuccess {
    accessToken: string;
    expiresInSeconds: string; // ISO 8601 timestamp
  }

  interface TokenResponseError {
    error: {
      message: string;
      details: string[];
    }
  }

    // Union type that can be either a success or an error response
  type TokenResponse = TokenResponseSuccess | TokenResponseError;

async function fetchDirections(start: Point, end: Point): Promise<Point[] | TokenResponse> {
  console.log("[Directions] start:", start, "end:", end);
  const jwt = generateMapKitJWT();
  console.log("[Directions] Using JWT:", jwt ? jwt : "none");
  if (!jwt) {
    console.error("[Directions] MAPKIT_JWT env not set");
    throw new Error("MAPKIT_JWT env not set");
  }

  //get access token from mapkit-token endpoint

  let mapsToken = null
  const tokenUrl = "https://maps-api.apple.com/v1/token";


  const responseMapToken = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    }
  });

if (responseMapToken.ok) {
    // Status 200 - Successful response
    const data: TokenResponseSuccess = await responseMapToken.json();
    mapsToken = data.accessToken;
    console.log("[Directions] Got Maps Token:", mapsToken ? mapsToken : "none");
  } else if (responseMapToken.status === 401) {
    // Status 401 - Unauthorized (Invalid token or missing token)
    const data: TokenResponseError = await responseMapToken.json();
    return {
      error: data.error
    };
  } else if (responseMapToken.status === 429) {
    // Status 429 - Quota exceeded (Too many requests)
    const data: TokenResponseError = await responseMapToken.json();
    return {
      error: data.error
    };
  } else if (responseMapToken.status === 500) {
    // Status 500 - Internal Server Error
    const data: TokenResponseError = await responseMapToken.json();
    return {
      error: data.error
    };
  } else {
    // Catch any other status codes
    return {
      error: {
        message: "Unknown Error",
        details: []
      }
    };
  }

  const queryParams = new URLSearchParams({
    origin: `${start.lat},${start.lng}`,
    destination: `${end.lat},${end.lng}`,
    transportType: "automobile"
  });

  const url = "https://maps-api.apple.com/v1/directions";

  const urlWithParams = `${url}?${queryParams.toString()}`;
  console.log("[Directions] Fetching directions from:", urlWithParams);

  // const body = {
  //   origin: { latitude: start.lat, longitude: start.lng },
  //   destination: { latitude: end.lat, longitude: end.lng },
  //   transportType: "automobile"
  // };
  let res;
  try {
    res = await fetch(urlWithParams, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mapsToken}`,
        "Content-Type": "application/json"
      },
      // body: JSON.stringify(body)
    });
  } catch (err) {
    console.error("[Directions] Fetch error:", err);
    throw new Error("Fetch error: " + (err as any).message);
  }
  if (!res.ok) {
    const text = await res.text();
    console.error(`[Directions] MapKit Directions API error: ${res.status} ${text}`);
    throw new Error(`MapKit Directions API error: ${res.status} ${text}`);
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("[Directions] JSON parse error:", err);
    throw new Error("JSON parse error: " + (err as any).message);
  }

  return data;
  
}

export async function POST(req: NextRequest) {
  try {
    const { start, end } = await req.json();
    if (!start || !end) {
      console.error("[Directions] Missing start or end", { start, end });
      return NextResponse.json({ error: "Missing start or end" }, { status: 400 });
    }
    const polyline = await fetchDirections(start, end);
    return NextResponse.json({ polyline });
  } catch (e: any) {
    console.error("[Directions] API error:", e);
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
