"use client";
//user able to see how many ppl has selected that item in real time
import { User, useSession } from "@/app/context/session-context";
import { useSessionUsers } from "@/app/hooks/use-session-users";
import AllocationContainer from "@/components/allocation-container";
import BillContainer from "@/components/bill-container";
import { Chip } from "@mui/material";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SplitPage() {
  const { session, setSession } = useSession();
  const { sessionID } = useParams();
  const [readyToSplit, setReadyToSplit] = useState(false);
  const [numberOfReadyUsers, setNumberOfReadyUsers] = useState(0);
  const [showBillSummary, setShowBillSummary] = useState(false);

  //to track the number of shares for each item
  const [itemSelectionCounts, setItemSelectionCounts] = useState<
    Record<string, number>
  >({});

  const handleReadyToSplit = async (
    isReady: boolean,
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
      body: JSON.stringify({ isReady }),
    });
  };

  const handleUsersUpdate = useCallback(
    (users: User[]) => {
      if (users.length === 0) return;
      setSession((prev) => ({
        ...prev,
        id: sessionID ? sessionID.toString() : "",
        users,
      }));
      console.log("Users updated:", users);
      // You can add logic here to proceed with the splitting process
    },
    [setSession]
  );

  useSessionUsers(sessionID ? sessionID.toString() : "", handleUsersUpdate);

  useEffect(() => {
    if (session.users.every((user) => user.isReady)) {
      console.log("All users are ready to split");
      setReadyToSplit(true);
      // You can add logic here to proceed with the splitting process
    } else {
      setReadyToSplit(false);
      setShowBillSummary(false);
    }
    setNumberOfReadyUsers(session.users.filter((user) => user.isReady).length);
  }, [session.users]);

  return (
    <div className="bg-radial from-black-400 to-gray-900 h-screen">
      <Chip
        color="success"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          color: "white",
          m: 2,
          borderLeft: 1,
          borderRight: 1,
          borderColor: "black",
          fontFamily: "monospace",
        }}
        label={`Ready: ${numberOfReadyUsers}/${session.users.length}`}
      />
      {/* Additional content can be added here */}
      {showBillSummary ? (
        <BillContainer
          users={session.users}
          itemSelectionCounts={itemSelectionCounts}
          goBack={() => setShowBillSummary(false)}
        />
      ) : (
        <AllocationContainer
          users={session.users}
          items={session.items}
          readyToSplit={readyToSplit}
          itemSelectionCounts={itemSelectionCounts}
          onReady={handleReadyToSplit}
          setItemSelectionCounts={setItemSelectionCounts}
          onBillSVP={() => setShowBillSummary(true)}
          sessionID={sessionID?.toString() || ""}
        />
      )}
    </div>
  );
}
