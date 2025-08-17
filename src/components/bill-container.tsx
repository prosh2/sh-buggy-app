import { User } from "@/app/context/session-context";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import CopyToClipboardButton from "./copy-to-clipboard-button";
import Receipt from "./receipt";
import UserSelection from "./user-selection";

export default function BillContainer({
  users,
  itemSelectionCounts,
  isHidden,
  goBack,
}: {
  users: User[];
  itemSelectionCounts: Record<string, number>;
  isHidden: boolean;
  goBack: () => void;
}) {
  const userRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const getAmountPayable = () => {
    const user = users.find((user) => user.id === selectedUser);
    const amount = user?.allocatedItems.reduce(
      (acc, item) =>
        acc +
        ((item.price * item.quantity) / itemSelectionCounts[item.id] || 1),
      0
    );

    return amount?.toFixed(2);
  };

  return (
    <>
      {isHidden && (
        <div className="rounded shadow-lg flex flex-col items-center p-4 h-full">
          <motion.button
            className="absolute right-0 top-0 m-4 bg-gray-800 shadow-black shadow-lg border-black border-r-2 border-l-2 px-4 py-2 rounded-xl text-xs font-mono shadow"
            onClick={goBack}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            Back
          </motion.button>
          <div className="flex flex-col w-full h-50 justify-center">
            <UserSelection
              userRefs={userRefs}
              users={users}
              selectedUser={selectedUser || ""}
              setSelectedUser={setSelectedUser}
            />
          </div>
          {selectedUser && (
            <div className="flex flex-col justify-center items-center h-80 w-full">
              <div className="flex flex-col h-full w-full items-center">
                <Receipt
                  users={users}
                  selectedUser={selectedUser}
                  itemCounts={itemSelectionCounts}
                />
                <div
                  key={selectedUser}
                  className="px-2 p-8 flex h-full justify-center items-center"
                >
                  <div>
                    <div className="flex justify-center items-center bg-gray-900 px-4 py-2 rounded mb-4 break-words text-gray-100 w-[300px] shadow-lg border-black border-r-1 shadow-black">
                      {users.find((user) => user.id === selectedUser)?.name}{" "}
                      owes
                    </div>
                    <CopyToClipboardButton
                      textToCopy={getAmountPayable() || ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
