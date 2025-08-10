import DeleteIcon from "@mui/icons-material/Delete";
export default function User({
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
      className="bg-gray-200 text-gray-800 rounded h-8 px-2 py-1 flex items-center justify-between"
    >
      {username}
      <button
        className="ml-2 text-red-500 hover:text-red-700"
        onClick={() => handleDeleteUser(id)}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
