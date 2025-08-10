import { Item, User } from "@/app/context/session-context";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// This component allows user to select items and mark themselves ready for splitting.
export default function AllocationContainer({
  users,
  items, //list of items to select from, populated by OCR backend
  sessionID,
  onReady,
}: {
  users: User[];
  items: Item[];
  sessionID: string;
  onReady: (selectedUser: string, selectedItems: string[]) => void;
}) {
  const DUMMY_ITEMS = [
    // Example items, replace with actual items from backend
    { id: "id1", name: "Item 1", price: 10, quantity: 1 },
    { id: "id2", name: "Item 2", price: 20, quantity: 2 },
    { id: "id3", name: "Item 3", price: 30, quantity: 3 },
    { id: "id4", name: "Item 4", price: 40, quantity: 4 },
  ];
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };
  const patchSelectedItems = async () => {
    if (!selectedUser || selectedItems.length === 0) return;
    const allocatedItems = DUMMY_ITEMS.filter((item) =>
      selectedItems.includes(item.id)
    );
    await fetch(`/api/sessions/${sessionID}/users/${selectedUser}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allocatedItems }),
    });
  };

  useEffect(() => {
    patchSelectedItems();
  }, [selectedItems]);

  useEffect(() => {
    setSelectedItems(
      users
        .find((u) => u.id === selectedUser)
        ?.allocatedItems.map((item) => item.id) || []
    );
  }, [selectedUser]);

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto space-y-6">
      <div>
        <p>
          Allocated Items for user:{" "}
          {users.find((u) => u.id === selectedUser)?.name}
        </p>
        <p>
          Selected Items:{" "}
          {users
            .find((u) => u.id === selectedUser)
            ?.allocatedItems.map((item) => item.name)
            .join(", ")}{" "}
        </p>
      </div>
      {/* User Selection */}
      <div className="w-full">
        <h2 className="text-lg font-bold mb-3">Select Your Name</h2>
        <div className="flex flex-wrap gap-3">
          {users.map((user) => (
            <motion.button
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor:
                  selectedUser === user.id ? "#3B82F6" : "#E5E7EB",
                color: selectedUser === user.id ? "#fff" : "#000",
              }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 rounded-xl font-medium shadow"
            >
              {user.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Item Selection */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <h2 className="text-lg font-bold mb-3">Select Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {DUMMY_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.95 }}
                animate={{
                  borderColor: selectedItems.includes(item.id)
                    ? "#3B82F6"
                    : "#D1D5DB",
                  backgroundColor: selectedItems.includes(item.id)
                    ? "#DBEAFE"
                    : "#fff",
                }}
                transition={{ duration: 0.2 }}
                onClick={() => toggleItem(item.id)}
                className="p-4 border-2 rounded-xl shadow-sm cursor-pointer select-none"
              >
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Price: ${item.price}
                  <br />
                  Qty: {item.quantity}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Ready Button */}
      {selectedUser && selectedItems.length > 0 && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onReady(selectedUser, selectedItems)}
          className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg"
        >
          Ready
        </motion.button>
      )}
    </div>
  );
}
