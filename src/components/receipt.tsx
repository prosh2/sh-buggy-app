import { User } from "@/app/context/session-context";
import { motion } from "framer-motion";
export default function Receipt({
  users,
  selectedUser,
  itemCounts,
}: {
  users: User[];
  selectedUser: string;
  itemCounts: Record<string, number>;
}) {
  return (
    <div className="flex flex-col w-full shadow-md shadow-black border-black border-l-2 border-r-2 border-t-1 py-5">
      <div className="flex justify-around h-8 py-1 font-bold mb-2">
        <span className="flex items-center justify-center w-full">Name</span>
        <span className="flex items-center justify-center w-full">Qty</span>
        <span className="flex items-center justify-center w-full">Price</span>
        <span className="flex items-center justify-center w-full">Total</span>
        <span className="flex items-center justify-center w-full">Shares</span>
      </div>
      {users
        .find((user) => user.id === selectedUser)
        ?.allocatedItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex justify-around h-8 py-1"
            whileHover={{ backgroundColor: "#033d94ff" }}
          >
            <span className="flex items-center justify-center w-full">
              {item.name}
            </span>
            <span className="flex items-center justify-center w-full">
              x{item.quantity}
            </span>
            <span className="flex items-center justify-center w-full">
              ${item.price}
            </span>
            <span className="flex items-center justify-center w-full">
              ${item.price * item.quantity}
            </span>
            <span className="flex items-center justify-center w-full">
              {itemCounts[item.id]}
            </span>
          </motion.div>
        ))}
    </div>
  );
}
