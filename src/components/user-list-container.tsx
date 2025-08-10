// show user avatars and username in session container
import { useSession } from "@/app/context/session-context";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState } from "react";
import User from "./user";
export default function UserListContainer() {
  const [username, setUsername] = useState("");
  const sessionContext = useSession();
  const handleAddUser = async () => {
    // Logic to add a user can be implemented here
    const res = await fetch(
      `/api/sessions/${sessionContext.session.id}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
      }
    );
    if (!res.ok) {
      console.error("Failed to create user");
      return;
    }
  };

  const handleDeleteUser = async (userID: string) => {
    const res = await fetch(
      `/api/sessions/${sessionContext.session.id}/users/${userID}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      console.error("Failed to create user");
      return;
    }
  };

  return (
    <div className="flex flex-col absolute w-full h-[30vh] border p-4 rounded shadow-lg">
      <div className="flex font-bold mb-2 justify-center">Users in session</div>
      <div className="flex overflow-y-auto h-full bg-gray-100 py-2">
        <div className="flex flex-col flex-wrap gap-1 px-2 bg-gray-100 h-full w-full">
          {(sessionContext.session.users?.length > 0 &&
            sessionContext.session.users?.map((user) => (
              <User
                key={user.id}
                id={user.id}
                username={user.name}
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
