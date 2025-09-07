import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect } from "react";
import { Item } from "../context/session-context";

export function useSessionItems(
  sessionID: string,
  onItemsUpdate: (items: Item[]) => void
) {
  useEffect(() => {
    if (!sessionID) return;

    const itemsRef = collection(db, "sessions", sessionID, "items");
    const q = query(itemsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];

      onItemsUpdate(itemsData);
    });

    return () => unsubscribe();
  }, [sessionID, onItemsUpdate]);
}
