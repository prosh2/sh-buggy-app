"use client";

import { useSession } from "@/app/context/session-context";
import AllocationContainer from "@/components/allocation-container";
import { doc } from "firebase/firestore";
import { useEffect } from "react";

export default function SplitPage() {
  const sessionContext = useSession();

  const handleReadyToSplit = (
    selectedUser: string,
    selectedItems: string[]
  ) => {
    // Logic to handle when the user is ready to split
    console.log(
      "User ready to split:",
      selectedUser,
      "with items:",
      selectedItems
    );
    // const usersRef = doc(db, "sessions", sessionContext.session.id);
    // setDoc(
    //   usersRef,
    //   { users: [...sessionContext.session.users, newUser] },
    //   { merge: true }
    // );
  };
  useEffect(() => {
    if (sessionContext.session.users.every((user) => user.isReady)) {
      console.log("All users are ready to split");
      // You can add logic here to proceed with the splitting process
    }
  }, [sessionContext.session.users]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Split Session</h1>
      <p className="text-lg mb-2">Session ID: {sessionContext.session.id}</p>
      <p className="text-lg mb-2">
        Users: {sessionContext.session.users.map((user) => user.name)}
      </p>
      <p className="text-lg mb-2">
        Items: {sessionContext.session.items.join(", ")}
      </p>
      <p className="text-2xl">This is the split page for session</p>
      {/* Additional content can be added here */}
      <AllocationContainer
        users={sessionContext.session.users}
        items={sessionContext.session.items}
        onReady={handleReadyToSplit}
      />
    </div>
  );
}
