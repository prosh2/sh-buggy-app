import { Item, User } from "@/app/context/session-context";
import { Chip } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import UserSelection from "./user-selection";

// This component allows user to select items and mark themselves ready for splitting.
export default function AllocationContainer({
  users,
  items, //list of items to select from, populated by OCR backend
  sessionID,
  readyToSplit,
  itemSelectionCounts,
  onBillSVP,
  onReady,
  setItemSelectionCounts,
}: {
  users: User[];
  items: Item[];
  sessionID: string;
  readyToSplit: boolean;
  itemSelectionCounts: Record<string, number>;
  setItemSelectionCounts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  onBillSVP: () => void;
  onReady: (
    isReady: boolean,
    selectedUser: string,
    selectedItems: string[]
  ) => void;
}) {
  const DUMMY_ITEMS = [
    // Example items, replace with actual items from backend
    { id: "id1", name: "Item 1", price: 10, quantity: 1 },
    { id: "id2", name: "Item 2", price: 20, quantity: 2 },
    { id: "id3", name: "Item 3", price: 30, quantity: 3 },
    { id: "id4", name: "Item 4", price: 40, quantity: 4 },
  ];
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>(
    {}
  );
  const [isReadyMap, setIsReadyMap] = useState<Record<string, boolean>>({});
  const userRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggleItem = (itemId: string) => {
    if (selectedUser === null) return;

    setSelectedItems((prev) => {
      const prevItems = prev[selectedUser] || [];
      return {
        ...prev,
        [selectedUser]: prevItems.includes(itemId)
          ? prevItems.filter((id) => id !== itemId)
          : [...prevItems, itemId],
      };
    });
  };

  const patchSelectedItems = async () => {
    if (!selectedUser) return;
    const allocatedItems = DUMMY_ITEMS.filter((item) =>
      selectedItems[selectedUser].includes(item.id)
    );
    await fetch(`/api/sessions/${sessionID}/users/${selectedUser}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allocatedItems }),
    });
  };

  const updateItemSelectionCount = () => {
    const counts: Record<string, number> = {};
    for (const user of users) {
      for (const item of user.allocatedItems) {
        counts[item.id] = (counts[item.id] || 0) + 1;
      }
    }
    setItemSelectionCounts(counts);
  };

  const handlePlayerIsReady = (isReady: boolean) => {
    if (!selectedUser) return;
    setIsReadyMap((prev) => ({
      ...prev,
      [selectedUser]: isReady,
    }));
    onReady(isReady, selectedUser, selectedItems[selectedUser]);
  };

  useEffect(() => {
    patchSelectedItems();
  }, [selectedItems]);

  useEffect(() => {
    if (!selectedUser) return;

    setSelectedItems((prev) => ({
      ...prev,
      [selectedUser]:
        users
          .find((u) => u.id === selectedUser)
          ?.allocatedItems.map((item) => item.id) || [],
    }));
  }, [users, selectedUser]);

  useEffect(() => {
    updateItemSelectionCount();
    for (const user of users) {
      if (!user) return;
      setIsReadyMap((prev) => ({
        ...prev,
        [user.id]: user?.isReady || false,
      }));
    }
  }, [users]);

  return (
    <div className="rounded shadow-lg flex flex-col justify-center items-center p-4 space-y-6">
      {/* User Selection */}
      <UserSelection
        userRefs={userRefs}
        users={users}
        selectedUser={selectedUser || ""}
        setSelectedUser={setSelectedUser}
      />

      {/* Item Selection */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <h2 className="flex justify-center text-lg font-bold mb-3">
            Select Items
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {DUMMY_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.95 }}
                animate={{
                  borderColor: selectedItems[selectedUser]?.includes(item.id)
                    ? "#2563EB"
                    : "#000000",
                  backgroundColor: selectedItems[selectedUser]?.includes(
                    item.id
                  )
                    ? "#DBEAFE"
                    : "#fff",
                }}
                transition={{ duration: 0.2 }}
                onClick={() => toggleItem(item.id)}
                className="flex  flex-col space-y-2 p-4 border-2 rounded-xl shadow-sm cursor-pointer select-none"
              >
                <p className="text-gray-700 font-medium">{item.name}</p>
                <div className="text-sm text-gray-500">
                  Price: ${item.price}
                  <br />
                  <span className="flex w-full items-center">
                    Qty: {item.quantity}
                    <Chip
                      label={itemSelectionCounts[item.id] || 0}
                      color="info"
                      className="flex w-fit ml-auto"
                    />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Ready Button */}
      {selectedUser &&
        !isReadyMap[selectedUser] &&
        selectedItems[selectedUser]?.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handlePlayerIsReady(true)}
            className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg"
          >
            Ready
          </motion.button>
        )}

      {selectedUser &&
        isReadyMap[selectedUser] &&
        selectedItems[selectedUser]?.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handlePlayerIsReady(false)}
            className="mt-4 px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg"
          >
            Not Ready
          </motion.button>
        )}

      {/* Proceed to split bill button */}
      {readyToSplit && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onBillSVP}
          className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg"
        >
          Proceed to Split Bill
        </motion.button>
      )}
    </div>
  );
}
