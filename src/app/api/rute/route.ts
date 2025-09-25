import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response("Rute API is working");
}