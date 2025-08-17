import { RefObject } from "react";
import UnderlineContainer from "./underline-container";
import { motion } from "motion/react"
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
    <div className="flex flex-col w-full">
      <h2 className="flex justify-center text-lg font-bold mb-5">
        Select Your Name
      </h2>
      <UnderlineContainer
        itemRefs={userRefs}
        selectedItem={selectedUser ? selectedUser : ""}
      >
        {users.map((user) => (
          <motion.button
            key={user.id}
            ref={(el) => {
              userRefs.current[user.id] = el;
            }}
            onClick={() => setSelectedUser(user.id)}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor:
                selectedUser === user.id ? "#0b58ccff" : "#E5E7EB",
              color: selectedUser === user.id ? "#fff" : "#000",
              borderBottom:
                selectedUser === user.id ? "none" : "1px solid #ddd",
            }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 rounded-xl font-medium shadow"
          >
            {user.name}
          </motion.button>
        ))}
      </UnderlineContainer>
    </div>
  );
}
