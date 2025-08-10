//placeholder for items api TODO: mrsng
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // your GET logic here
  return new Response(JSON.stringify({ message: "GET success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  // your POST logic here
  return new Response(null, { status: 204 });
}
