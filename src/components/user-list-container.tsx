// show user avatars and username in session container
import { db } from "@/firebase";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import User from "./user";
export default function UserListContainer({
  users,
  sessionID,
}: {
  users: string[];
  sessionID: string;
}) {
  const [username, setUsername] = useState("");
  const handleAddUser = () => {
    // Logic to add a user can be implemented here
    console.log("your name is ", username, sessionID);
    const usersRef = doc(db, "sessions", sessionID);
    setDoc(usersRef, { users: [...users, username] }, { merge: true });
  };

  const handleDeleteUser = (userToDelete: string) => {
    const updatedUsers = users.filter((user) => user !== userToDelete);
    const usersRef = doc(db, "sessions", sessionID);
    setDoc(usersRef, { users: updatedUsers }, { merge: true });
  };

  return (
    <div className="flex flex-col absolute w-full h-[25vh] border p-4 rounded shadow-lg">
      <div className="flex font-bold mb-2 justify-center">Users in session</div>
      <div className="flex flex-col mb-2 overflow-y-auto h-full">
        <div className="flex flex-wrap gap-1 justify-center bg-gray-100 py-2 h-full">
          {(users.length > 0 &&
            users?.map((user) => (
              <User
                key={user}
                username={user}
                handleDeleteUser={handleDeleteUser}
              />
            ))) || (
            <span className="text-black flex justify-center items-center h-full">
              No users are in session
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-3 h-full items-center">
        <span className="text-gray-500 text-sm">
          Total users: {users.length}
        </span>
        <span className="flex bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm ml-auto">
          <input
            type="text"
            placeholder="Enter your name"
            className="border rounded px-2 py-1 mr-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddUser}
            disabled={!username.trim()}
          >
            <AddIcon />
          </Button>
        </span>
      </div>
    </div>
  );
}
