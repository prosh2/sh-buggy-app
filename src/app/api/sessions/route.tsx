import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ message: "Missing sessionId" }, { status: 400 });
  }

  try {
    // throw new Error("Simulated server error");

    const sessionRef = doc(db, "sessions", sessionId);

    await setDoc(sessionRef, { createdAt: new Date().toISOString() });

    return NextResponse.json(
      {
        message: "Session created",
        sessionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export { handler as POST };
