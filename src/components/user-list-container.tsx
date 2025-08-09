// show user avatars and username in session container
import { db } from "@/firebase";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import User from "./user";
import { useSession } from "@/app/context/session-context";
export default function UserListContainer() {
  const [username, setUsername] = useState("");
  const sessionContext = useSession();
  const handleAddUser = () => {
    // Logic to add a user can be implemented here
    console.log("your name is ", username, sessionContext.session.id);
    const usersRef = doc(db, "sessions", sessionContext.session.id);
    setDoc(usersRef, { users: [...sessionContext.session.users, username] }, { merge: true });
  };

  const handleDeleteUser = (userToDelete: string) => {
    const updatedUsers = sessionContext.session.users?.filter((user) => user !== userToDelete);
    const usersRef = doc(db, "sessions", sessionContext.session.id);
    setDoc(usersRef, { users: updatedUsers }, { merge: true });
  };

  return (
    <div className="flex flex-col absolute w-full h-[30vh] border p-4 rounded shadow-lg">
      <div className="flex font-bold mb-2 justify-center">Users in session</div>
      <div className="flex overflow-y-auto h-full bg-gray-100 py-2">
        <div className="flex flex-col flex-wrap gap-1 px-2 bg-gray-100 h-full w-full">
          {(sessionContext.session.users?.length > 0 &&
            sessionContext.session.users?.map((user) => (
              <User
                key={user}
                username={user}
                handleDeleteUser={handleDeleteUser}
              />
            ))) || (
              <span className="text-black flex items-center h-full w-full justify-center">
                No users are in session
              </span>
            )}
        </div>
      </div>

      <div className="flex shrink-3 h-full items-center mt-2">
        <span className="text-gray-500 text-sm">
          Total users: {sessionContext.session.users.length}
        </span>
        <span className="flex bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm ml-auto">
          <input
            type="text"
            placeholder="Enter your name"
            className="border rounded px-2 py-1 mr-2 w-[150px]"
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
