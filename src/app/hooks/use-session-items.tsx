import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { Item } from "../context/session-context";

export function useSessionItems(
  sessionID: string,
  onItemsUpdate: (items: Item[]) => void
) {
  useEffect(() => {
    if (!sessionID) return;

    const unsubscribe = onSnapshot(doc(db, "sessions", sessionID), (doc) => {
      const itemsData = doc.data()?.items as Item[];

      onItemsUpdate(itemsData);
    });

    return () => unsubscribe();
  }, [sessionID, onItemsUpdate]);
}
