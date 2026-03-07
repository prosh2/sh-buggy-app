import { User } from "@/app/context/session-context";
import { motion } from "motion/react";
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
            key={user.id || "nouser"}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: selected ? 1.1 : 1,
              borderColor: selected ? "#2563EB" : "#e5e7eb",
              backgroundColor: selected ? "var(--color-blue-600)" : "var(--color-gray-100)",
              color: selected ? "#fff" : "var(--color-gray-700)",
            }}
            onClick={() => setSelectedUser(user.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap`}
          >
            {user.name}
          </motion.button>
        );
      })}
    </div>
  );
}
