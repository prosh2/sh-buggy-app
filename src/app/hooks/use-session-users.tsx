import { useEffect } from "react";
import { User } from "../context/session-context";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useSessionUsers(
  sessionID: string,
  onUsersUpdate: (users: User[]) => void
) {
  useEffect(() => {
    if (!sessionID) return;

    const usersRef = collection(db, "sessions", sessionID, "users");
    const q = query(usersRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as User[];

      onUsersUpdate(usersData);
    });

    return () => unsubscribe();
  }, [sessionID, onUsersUpdate]);
}
