import { User } from "@/app/context/session-context";
import { IconButton } from "@mui/material";
import { motion } from "motion/react";
import Image from "next/image";
export default function Receipt({
  users,
  selectedUser,
  itemCounts,
}: {
  users: User[];
  selectedUser: string;
  itemCounts: Record<string, number>;
}) {
  const subTotal = () =>
    users.find((user) => user.id === selectedUser)?.allocatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  return (
    <div className="w-full max-w-md mx-auto bg-[#fffdf7] text-black 
  font-mono shadow-xl border border-gray-300 rounded-md p-5">

      {/* Header */}
      <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
        <div className="text-lg font-bold">{users.find((user) => user.id === selectedUser)?.name}&apos;s RECEIPT</div>
        <div className="text-xs text-gray-600">Chop Chop</div>
      </div>

      {/* Column titles */}
      <div className="flex text-xs font-bold border-b border-dashed border-gray-400 pb-1 mb-2">
        <span className="w-5/12">Name</span>
        <span className="w-2/12 text-center">Qty</span>
        <span className="w-2/12 text-right">Price</span>
        <span className="w-3/12 text-right">Total</span>
      </div>

      {/* Items */}
      {users
        .find((user) => user.id === selectedUser)
        ?.allocatedItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex text-sm py-1"
            whileHover={{ backgroundColor: "#f3f3f3" }}
          >
            <span className="w-5/12 truncate">{item.name}</span>

            <span className="w-2/12 text-center">
              x{item.quantity}
            </span>

            <span className="w-2/12 text-right">
              ${item.price}
            </span>

            <span className="w-3/12 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </motion.div>
        ))}
      <div className="flex text-xs font-bold border-t border-dashed border-gray-400 pt-1 mt-2">
        <span className="w-10/12">Subtotal</span>
        <span className="w-2/12 text-right">${subTotal()}</span>
      </div>
      {/* Footer */}
      <div className="border-t border-dashed border-gray-400 mt-3 pt-3 text-xs text-center">
        {/* <Chip
                        label={copied ? "Copied!" : getAmountPayable}
                        icon={<ContentCopyIcon />}
                        clickable
                        onClick={copyToClipboard}
                        color={copied ? "success" : "default"}
                        sx={{ color: "white", fontSize: "1.0rem" }}
                        variant="outlined"
                      /> */}
        <IconButton
          onClick={() => (window.location.href = "dbspaylah://")}
        >
          <Image
            src="/dbspaylah.png"
            alt="dbspaylah"
            width={50}
            height={50}
          />
        </IconButton>
      </div>
      <div className="border-t border-dashed border-gray-400 mt-3 pt-3 text-xs text-center">
        --- END OF RECEIPT ---
      </div>

    </div>
  );
}
