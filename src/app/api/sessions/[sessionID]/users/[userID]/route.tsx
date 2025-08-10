import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { sessionID: string; userID: string } }
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
