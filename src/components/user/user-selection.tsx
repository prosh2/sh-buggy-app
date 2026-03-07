import { RefObject } from "react";
import UnderlineContainer from "../underline-container";
import { motion } from "motion/react";
import { User } from "@/app/context/session-context";
export default function UserSelection({
  userRefs,
  users,
  selectedUser,
  setSelectedUser,
}: {
  userRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  users: User[];
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
      {users.map((user) => {
        const selected = selectedUser === user?.id;
        return (
          <motion.button
            key={user.id || "nouser"}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedUser(user.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap
${selected
                ? "bg-gray-100 text-gray-700 border-blue-500"
                : "bg-gray-500 text-gray-700 border-gray-700"
              }`}
          >
            {user.name}
          </motion.button>
        );
      })}
    </div>
  );
}
