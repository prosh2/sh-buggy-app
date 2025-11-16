// show user avatars and username in session container
import { User, useSession } from "@/app/context/session-context";
import { useState } from "react";
import UserComponent from "./user-component";

interface UserListContainerProps {
  users: User[];
  handleDeleteUser: (userID: string) => void;
}

const UserContainer: React.FC<UserListContainerProps> = ({
  users,
  handleDeleteUser,
}) => {
  return (
    (users?.length > 0 && (
      <div className="grid grid-cols-4 max-h-[30vh] p-2 rounded">
        {users?.map((user) => (
          <UserComponent
            key={user.id}
            id={user.id}
            username={user.name}
            handleDeleteUser={handleDeleteUser}
          />
        ))}
      </div>
    )) || (
      <p className="text-gray-400 mb-2 font-sans">No users in session yet.</p>
    )
  );
};

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
    <div className="bg-gray-800 backdrop-blur-lg rounded-2xl p-6 w-full text-center shadow-lg">
      <UserContainer
        users={session.users}
        handleDeleteUser={handleDeleteUser}
      />
      <input
        type="text"
        placeholder="Enter your name to join..."
        className="w-full mt-3 px-4 py-2 rounded-xl bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-sans"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className={
          !username.trim()
            ? "cursor-not-allowed bg-blue-600 rounded mt-4 w-25 text-grey-400 py-2 rounded-xl transition text-sm font-sans"
            : "mt-4 w-25 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition text-sm font-sans"
        }
        onClick={handleAddUser}
        disabled={!username.trim()}
      >
        Join
      </button>
    </div>
  );
}
