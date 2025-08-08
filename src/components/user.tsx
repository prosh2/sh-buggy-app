import DeleteIcon from "@mui/icons-material/Delete";
export default function User({
  username,
  handleDeleteUser,
}: {
  username: string;
  handleDeleteUser: (userToDelete: string) => void;
}) {
  return (
    <span
      key={username}
      className="flex justify-center items-center bg-gray-200 text-gray-800 rounded px-2 py-1 mr-2 mb-2 h-8"
    >
      {username}
      <button
        className="ml-2 text-red-500 hover:text-red-700"
        onClick={() => handleDeleteUser(username)}
      >
        <DeleteIcon />
      </button>
    </span>
  );
}
