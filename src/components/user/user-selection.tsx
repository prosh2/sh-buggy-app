import { User } from "@/app/context/session-context";
import { motion } from "motion/react";
import { RefObject } from "react";
export default function UserSelection({
  users,
  selectedUser,
  setSelectedUser,
}: {
  users: User[];
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 py-4">
      {users.map((user) => {
        const selected = selectedUser === user?.id;
        return (
          <motion.button
            key={user.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedUser(user.id)}
            className="flex flex-col items-center min-w-[70px]"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition
          ${
            selected
              ? "bg-blue-500 text-white ring-2 ring-blue-400"
              : "bg-gray-700 text-gray-200"
          }`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            <span
              className={`text-xs mt-1 ${
                selected ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {user.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
