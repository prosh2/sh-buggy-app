import ClearIcon from "@mui/icons-material/Clear";
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
      className="bg-gray-900 text-gray-200 rounded h-8 mt-1 px-2 py-1 flex items-center justify-between border-black border-l-1 border-r-1 shadow-md shadow-black"
    >
      {username}
      <button
        className="ml-2 text-red-700 hover:text-red-700"
        onClick={() => handleDeleteUser(id)}
      >
        <ClearIcon />
      </button>
    </div>
  );
}
