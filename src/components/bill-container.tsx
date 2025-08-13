import { User } from "@/app/context/session-context";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import UserSelection from "./user-selection";

export default function BillContainer({
  users,
  goBack,
}: {
  users: User[];
  goBack: () => void;
}) {
  const userRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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
        <div className="flex flex-col  justify-center items-center h-full w-full pb-20">
          <div className="flex">
            Bill for: {users.find((user) => user.id === selectedUser)?.name}
          </div>
          <div className="flex h-full w-full justify-center border-white border-2">
            bill here
          </div>
        </div>
      )}
    </div>
  );
}
