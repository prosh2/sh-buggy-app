import { Item, User } from "@/app/context/session-context";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import UserSelection from "./user/user-selection";
import ItemListContainer from "./item-list-container";

// This component allows user to select items and mark themselves ready for splitting.
export default function AllocationContainer({
  users,
  items, //list of items to select from, populated by OCR backend
  sessionID,
  readyToSplit,
  itemSelectionCounts,
  isHidden,
  onBillSVP,
  onReady,
  setItemSelectionCounts,
}: {
  users: User[];
  items: Item[];
  sessionID: string;
  readyToSplit: boolean;
  isHidden: boolean;
  itemSelectionCounts: Record<string, number>;
  setItemSelectionCounts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  onBillSVP: () => void;
  onReady: (isReady: boolean, selectedUser: string) => void;
}) {
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
    const allocatedItems = items?.filter((item) =>
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
    onReady(isReady, selectedUser);
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
          ?.allocatedItems?.map((item) => item.id) || [],
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
    <>
      {isHidden && (
        <div className="rounded shadow-lg flex flex-col items-center p-4 h-full">
          {/* User Selection */}
          <div className="flex flex-col w-full h-50 justify-center">
            <UserSelection
              userRefs={userRefs}
              users={users}
              selectedUser={selectedUser || ""}
              setSelectedUser={setSelectedUser}
            />
          </div>
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
              <ItemListContainer
                items={items}
                selectedItems={selectedItems}
                selectedUser={selectedUser}
                toggleItem={toggleItem}
                itemSelectionCounts={itemSelectionCounts}
              />
            </motion.div>
          )}
          {/* Ready Button */}
          {selectedUser && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePlayerIsReady(true)}
              className={
                selectedItems[selectedUser]?.length <= 0
                  ? "bg-gray-900 mt-8 px-6 py-3 text-gray-800 font-bold rounded-xl shadow-lg mouse-not-allowed cursor-not-allowed"
                  : "bg-green-500 mt-8 px-6 py-3 text-white font-bold rounded-xl shadow-lg"
              }
              hidden={isReadyMap[selectedUser]}
              disabled={selectedItems[selectedUser]?.length <= 0}
            >
              Ready
            </motion.button>
          )}

          {selectedUser && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePlayerIsReady(false)}
              className="mt-8 px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg"
              hidden={!isReadyMap[selectedUser]}
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
              className="mt-8 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg"
            >
              Proceed to Split Bill
            </motion.button>
          )}
        </div>
      )}
    </>
  );
}
