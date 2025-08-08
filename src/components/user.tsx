import DeleteIcon from "@mui/icons-material/Delete";
export default function User({
  username,
  handleDeleteUser,
}: {
  username: string;
  handleDeleteUser: (userToDelete: string) => void;
}) {
  return (
    <div
      key={username}
      className="bg-gray-200 text-gray-800 rounded h-8 px-2 py-1 flex items-center justify-between"
    >
      {username}
      <button
        className="ml-2 text-red-500 hover:text-red-700"
        onClick={() => handleDeleteUser(username)}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
