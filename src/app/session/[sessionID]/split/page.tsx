"use client";
//user able to see how many ppl has selected that item in real time
import { Item, User, useSession } from "@/app/context/session-context";
import { useSessionItems } from "@/app/hooks/use-session-items";
import { useSessionUsers } from "@/app/hooks/use-session-users";
import AllocationContainer from "@/components/allocation-container";
import BillContainer from "@/components/bill-container";
import { Alert, Chip } from "@mui/material";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SplitPage() {
  const { session, setSession } = useSession();
  const { sessionID } = useParams();
  const [readyToSplit, setReadyToSplit] = useState(false);
  const [numberOfReadyUsers, setNumberOfReadyUsers] = useState(0);
  const [showBillSummary, setShowBillSummary] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  //to track the number of shares for each item
  const [itemSelectionCounts, setItemSelectionCounts] = useState<
    Record<string, number>
  >({});

  const isValidAllocation = () => {
    for (const item of session.items) {
      if ((itemSelectionCounts[item.id] || 0) < 1) {
        setShowAlert(true);
        return false;
      }
    }
    return true;
  };

  const handleReadyToSplit = async (isReady: boolean, selectedUser: string) => {
    await fetch(`/api/sessions/${sessionID}/users/${selectedUser}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isReady }),
    });
  };

  const handleShowBillSummary = () => {
    // console.log("handle svp");
    if (!isValidAllocation()) return;

    setShowBillSummary(true);
  };

  const handleUsersUpdate = useCallback(
    (users: User[]) => {
      if (users.length === 0) return;
      setSession((prev) => ({
        ...prev,
        id: sessionID ? sessionID.toString() : "",
        users,
      }));
      // console.log("Users updated:", users);
      // You can add logic here to proceed with the splitting process
    },
    [setSession]
  );
  const handleItemsUpdate = useCallback(
    (items: Item[]) => {
      setSession((prev) => ({
        ...prev,
        id: sessionID ? sessionID.toString() : "",
        items,
      }));
      // console.log("Items updated:", items);
    },
    [setSession]
  );

  useSessionUsers(sessionID ? sessionID.toString() : "", handleUsersUpdate);
  useSessionItems(sessionID ? sessionID.toString() : "", handleItemsUpdate);

  useEffect(() => {
    if (session.users.every((user) => user.isReady)) {
      // console.log("All users are ready to split");
      setReadyToSplit(true);
      // You can add logic here to proceed with the splitting process
    } else {
      setReadyToSplit(false);
      setShowBillSummary(false);
    }
    setNumberOfReadyUsers(session.users.filter((user) => user.isReady).length);
  }, [session.users]);

  return (
    <div className="bg-radial from-black-400 to-gray-900 h-screen flex flex-col justify-center">
      {showAlert && (
        <Alert
          className="absolute top-4 right-4 z-10"
          severity="warning"
          onClose={() => {
            setShowAlert(false);
            // console.log("Alert closed");
          }}
        >
          Each item must have be selected by at least 1 user!
        </Alert>
      )}
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

      <BillContainer
        isHidden={showBillSummary}
        users={session.users}
        itemSelectionCounts={itemSelectionCounts}
        goBack={() => setShowBillSummary(false)}
      />

      <AllocationContainer
        isHidden={!showBillSummary}
        users={session.users}
        items={session.items}
        readyToSplit={readyToSplit}
        itemSelectionCounts={itemSelectionCounts}
        onReady={handleReadyToSplit}
        setItemSelectionCounts={setItemSelectionCounts}
        onBillSVP={() => handleShowBillSummary()}
        sessionID={sessionID?.toString() || ""}
      />
    </div>
  );
}
