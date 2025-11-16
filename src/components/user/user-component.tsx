import ClearIcon from "@mui/icons-material/Clear";
import { Tooltip } from "@mui/material";
export default function UserComponent({
  id,
  username,
  handleDeleteUser,
}: {
  id: string;
  username: string;
  handleDeleteUser: (userToDelete: string) => void;
}) {
  return (
    <div
      key={id}
      className="flex bg-gray-900 text-gray-200 rounded-lg h-8 my-1 mx-1 px-1 py-1  border-black border-l-1 border-r-1 shadow-md shadow-black"
    >
      <Tooltip title={username}>
        <span className="flex mx-auto overflow-hidden text-ellipsis whitespace-nowrap font-sans">
          {username}
        </span>
      </Tooltip>
      <button
        className="flex ml-auto text-red-700 hover:text-red-700"
        onClick={() => handleDeleteUser(id)}
      >
        <ClearIcon />
      </button>
    </div>
  );
}
