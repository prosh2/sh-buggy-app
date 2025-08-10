"use client";

import { User, useSession } from "@/app/context/session-context";
import { useSessionUsers } from "@/app/hooks/use-session-users";
import AllocationContainer from "@/components/allocation-container";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function SplitPage() {
  const { session, setSession } = useSession();
  const { sessionID } = useParams();

  const handleReadyToSplit = async (
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
    await fetch(`/api/sessions/${sessionID}/users/${selectedUser}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isReady: true }),
    });
  };

  const handleUsersUpdate = useCallback(
    (users: User[]) => {
      if (users.length === 0) return;
      setSession((prev) => ({
        ...prev,
        users,
      }));
      console.log("Users updated:", users);
    },
    [setSession]
  );

  useSessionUsers(sessionID ? sessionID.toString() : "", handleUsersUpdate);

  useEffect(() => {
    if (session.users.every((user) => user.isReady)) {
      console.log("All users are ready to split");
      // You can add logic here to proceed with the splitting process
    }
  }, [session.users]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Split Session</h1>
      <p className="text-lg mb-2">Session ID: {session.id}</p>
      <p className="text-lg mb-2">
        Users: {session.users.map((user) => user.name)}
      </p>
      <p className="text-lg mb-2">Items: {session.items.join(", ")}</p>
      <p className="text-2xl">This is the split page for session</p>
      {/* Additional content can be added here */}
      <AllocationContainer
        users={session.users}
        items={session.items}
        onReady={handleReadyToSplit}
        sessionID={sessionID?.toString() || ""}
      />
    </div>
  );
}
