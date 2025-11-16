import { Item } from "@/app/context/session-context";
import { Chip } from "@mui/material";
import { motion } from "motion/react";

interface ItemListContainerProps {
  items: Item[];
  selectedItems: Record<string, string[]>;
  selectedUser: string;
  itemSelectionCounts: Record<string, number>;
  toggleItem: (id: string) => void;
}

export default function ItemListContainer({
  items,
  selectedItems,
  selectedUser,
  itemSelectionCounts,
  toggleItem,
}: ItemListContainerProps) {
  if (!items)
    return (
      <p className="text-gray-400 mb-2 font-sans text-center">
        Items not found...
      </p>
    );
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items?.map((item) => (
        <motion.div
          key={item.id}
          whileTap={{ scale: 0.95 }}
          animate={{
            borderColor: selectedItems[selectedUser]?.includes(item.id)
              ? "#2563EB"
              : "#000000",
            backgroundColor: selectedItems[selectedUser]?.includes(item.id)
              ? "#DBEAFE"
              : "#fff",
          }}
          transition={{ duration: 0.2 }}
          onClick={() => toggleItem(item.id)}
          className="flex  flex-col space-y-2 p-4 border-2 rounded-xl shadow-sm cursor-pointer select-none"
        >
          <p className="text-gray-700 font-medium">{item.name}</p>
          <div className="text-sm text-gray-500">
            Price: ${item.price}
            <br />
            <span className="flex w-full items-center">
              Qty: {item.quantity}
              <Chip
                label={itemSelectionCounts[item.id] || 0}
                color="info"
                className="flex w-fit ml-auto"
              />
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
