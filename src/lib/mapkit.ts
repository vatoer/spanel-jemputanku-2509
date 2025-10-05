import jwt from "jsonwebtoken";

const TEAM_ID = process.env.MAPKIT_TEAM_ID || "YOUR_TEAM_ID";
const KEY_ID = process.env.MAPKIT_KEY_ID || "YOUR_KEY_ID";
const PRIVATE_KEY = (process.env.MAPKIT_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----").replace(/\\n/g, "\n");
const ORIGIN = process.env.MAPKIT_ORIGIN || "http://localhost:3000";

export const generateMapKitJWT = (): string | null => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
    iss: TEAM_ID,
    iat: now,
    exp: now + 60 * 60, // 1 hour
    origin: ORIGIN,
  };
  const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: KEY_ID,
        typ: "JWT",
      },
    });
  return token;
}
