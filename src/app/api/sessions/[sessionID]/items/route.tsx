import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionID: string }> }
) {
  try {
    const { items } = await req.json();
    const { sessionID } = await params;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items array required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "sessions", sessionID);
    await setDoc(
      docRef,
      { items }, // single field in one doc
      { merge: true } // merge to preserve other fields in session doc
    );

    return NextResponse.json({ updated: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save items" },
      { status: 500 }
    );
  }
}

// export async function GET(
//   req: NextRequest,
//   {
//     params,
//   }: {
//     params: Promise<{ sessionID: string }>;
//   }
// ) {
//   try {
//     const { sessionID } = await params; // ← sessionId from the URL
//     const usersRef = collection(db, "sessions", sessionID, "users");
//     const snapshot = await getDocs(usersRef);
//     const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }
