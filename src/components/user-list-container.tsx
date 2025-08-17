// show user avatars and username in session container
import { useSession } from "@/app/context/session-context";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "motion/react"
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
    <div className="flex flex-col absolute w-full h-[30vh] p-4 rounded shadow-md shadow-black">
      <div className="flex font-bold mb-2 justify-center">Users in session</div>
      <div className="flex overflow-y-auto h-full py-2">
        <div className="flex flex-col flex-wrap gap-1 p-2 h-full w-full">
          {(session.users?.length > 0 &&
            session.users?.map((user) => (
              <User
                key={user.id}
                id={user.id}
                username={user.name}
                handleDeleteUser={handleDeleteUser}
              />
            ))) || (
              <span className="text-gray-200 flex items-center h-full w-full justify-center">
                No users are in session
              </span>
            )}
        </div>
      </div>

      <div className="flex shrink-3 h-full items-center mt-2">
        <span className="text-gray-200 text-sm">
          Total users: {session.users.length}
        </span>
        <span className="flex bg-gray-900 rounded px-2 py-1 text-sm ml-auto">
          <input
            type="text"
            placeholder="Enter your name"
            className="rounded px-2 py-1 mr-2 w-[150px]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <motion.button
            onClick={handleAddUser}
            disabled={!username.trim()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={
              !username.trim()
                ? "cursor-not-allowed bg-[#0e1523] w-[60px] rounded"
                : "bg-blue-500 w-[60px] rounded"
            }
          >
            <AddIcon className="text-white" />
          </motion.button>
        </span>
      </div>
    </div>
  );
}
