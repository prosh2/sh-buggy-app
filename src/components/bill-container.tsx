import { User } from "@/app/context/session-context";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Receipt from "./receipt/receipt";
import UserSelection from "./user/user-selection";

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

  return (
    <>
      {!isHidden && (
        <div className="rounded shadow-lg flex flex-col items-center p-4 h-full">
          <motion.button
            className="absolute right-0 top-0 m-4 bg-red-600 shadow-black shadow-lg border-black border-r-2 border-l-2 px-4 py-2 rounded-xl text-xs font-mono shadow"
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
            <div className="flex flex-col justify-center items-center h-100 w-full">
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
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
