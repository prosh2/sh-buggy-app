// show user avatars and username in session container
import { useSession } from "@/app/context/session-context";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "motion/react";
import { useState } from "react";
import User from "./user";
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
    <div className="bg-gray-800  backdrop-blur-lg rounded-2xl p-6 w-full text-center shadow-lg">
      <div className="flex flex-col overflow-y-auto max-h-[30vh] p-2 rounded">
        {(session.users?.length > 0 &&
          session.users?.map((user) => (
            <User
              key={user.id}
              id={user.id}
              username={user.name}
              handleDeleteUser={handleDeleteUser}
            />
          ))) || <p className="text-gray-400 mb-2">No users are in session</p>}
      </div>
      <input
        type="text"
        placeholder="Enter your name to join..."
        className="w-full mt-3 px-4 py-2 rounded-xl bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className={
          !username.trim()
            ? "cursor-not-allowed bg-blue-600 rounded mt-4 w-25 text-grey-400 py-2 rounded-xl transition text-sm"
            : "mt-4 w-25 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition text-sm"
        }
        onClick={handleAddUser}
        disabled={!username.trim()}
      >
        Join
      </button>
    </div>
  );
}
