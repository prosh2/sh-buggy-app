import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionID: string; userID: string }> }
) {
  try {
    const { sessionID, userID } = await params;

    if (!sessionID || !userID) {
      return NextResponse.json(
        { error: "Missing sessionId or userId" },
        { status: 400 }
      );
    }

    const userDocRef = doc(db, "sessions", sessionID, "users", userID);
    await deleteDoc(userDocRef);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionID: string; userID: string }> }
) {
  try {
    const { sessionID, userID } = await params;
    if (!sessionID || !userID) {
      return NextResponse.json(
        { error: "Missing sessionId or userId" },
        { status: 400 }
      );
    }

    const updates = await req.json();
    if (typeof updates !== "object" || updates === null) {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    const userDocRef = doc(db, "sessions", sessionID, "users", userID);

    // Update only the fields sent in the request body
    await updateDoc(userDocRef, updates);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
