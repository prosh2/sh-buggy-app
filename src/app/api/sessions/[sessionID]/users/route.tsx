import { db } from "@/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionID: string }> }
) {
  try {
    const { name } = await req.json();
    const { sessionID } = await params;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const userID = uuidv4();
    const newUser = {
      id: userID,
      name,
      allocatedItems: [],
      isReady: false,
      createdAt: new Date().toISOString(),
    };
    const usersRef = collection(db, "sessions", sessionID, "users");
    const docRef = doc(usersRef, userID);
    await setDoc(docRef, newUser);

    return NextResponse.json({ id: docRef.id, name });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET({
  params,
}: {
  params: Promise<{ sessionID: string }>;
}) {
  try {
    const { sessionID } = await params; // ← sessionId from the URL
    const usersRef = collection(db, "sessions", sessionID, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
