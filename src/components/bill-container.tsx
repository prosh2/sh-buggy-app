import { User } from "@/app/context/session-context";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import UserSelection from "./user-selection";
import Receipt from "./receipt";
import CopyToClipboardButton from "./copy-to-clipboard-button";

export default function BillContainer({
  users,
  itemCounts,
  goBack,
}: {
  users: User[];
  itemCounts: Record<string, number>;
  goBack: () => void;
}) {
  const userRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const getAmountPayable = () => {
    const user = users.find((user) => user.id === selectedUser);
    const amount = user?.allocatedItems.reduce(
      (acc, item) =>
        acc + ((item.price * item.quantity) / itemCounts[item.id] || 1),
      0
    );

    return amount?.toFixed(2);
  };

  return (
    <div className="rounded shadow-lg flex flex-col items-center p-4 space-y-6 h-full">
      <motion.button
        className="absolute right-0 top-0 m-4 bg-gray-800 shadow-black shadow-lg border-black border-r-2 border-l-2 px-4 py-2 rounded-xl text-xs font-mono shadow"
        onClick={goBack}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        Back
      </motion.button>
      <UserSelection
        userRefs={userRefs}
        users={users}
        selectedUser={selectedUser || ""}
        setSelectedUser={setSelectedUser}
      />
      {selectedUser && (
        <div className="flex flex-col justify-center items-center h-full w-full pb-20">
          <div className="flex flex-col h-full w-full items-center">
            <Receipt
              users={users}
              selectedUser={selectedUser}
              itemCounts={itemCounts}
            />
            <div
              key={selectedUser}
              className="px-2 p-8 flex h-full justify-center items-center"
            >
              <div>
                <div className="flex justify-center items-center bg-gray-900 px-4 py-2 rounded mb-4 break-words text-gray-100 w-[300px] shadow-lg border-black border-r-1 shadow-black">
                  {users.find((user) => user.id === selectedUser)?.name} owes
                </div>
                <CopyToClipboardButton textToCopy={getAmountPayable() || ""} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
