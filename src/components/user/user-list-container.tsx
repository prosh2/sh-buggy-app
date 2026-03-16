// show user avatars and username in session container
import { User, useSession } from "@/app/context/session-context";
import { useState } from "react";
import UserComponent from "./user-component";
import { motion, AnimatePresence } from "framer-motion";

const avatarColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function UserListContainer() {
  const [username, setUsername] = useState("");
  const { session } = useSession();
  const handleAddUser = async () => {
    // Logic to add a user can be implemented here
    const res = await fetch(`/api/sessions/${session.id}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username }),
    });
    if (!res.ok) {
      console.error("Failed to create user");
      return;
    }
    setUsername("");
  };

  const handleDeleteUser = async (userID: string) => {
    const res = await fetch(`/api/sessions/${session.id}/users/${userID}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      console.error("Failed to create user");
      return;
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 w-full shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-100 text-lg font-semibold">
          People in this bill
        </h2>
        <span className="text-sm text-gray-400">
          {session.users.length} members
        </span>
      </div>

      {/* User List */}
      <div className="flex flex-wrap gap-2 mb-4">
        <AnimatePresence>
          {session.users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ scale: 0.6, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              layout
              className="flex items-center gap-2 bg-gray-700/60 px-3 py-1.5 rounded-full text-sm text-gray-200"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(
                  user.name,
                )}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <span>{user.name}</span>

              <button
                onClick={() => handleDeleteUser(user.id)}
                className="text-gray-400 hover:text-red-400 transition"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add user */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add someone to split the bill..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddUser();
          }}
        />

        <button
          className={
            !username.trim()
              ? "cursor-not-allowed bg-gray-700 text-gray-500 px-4 py-2 rounded-xl text-sm"
              : "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition"
          }
          onClick={handleAddUser}
          disabled={!username.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}
