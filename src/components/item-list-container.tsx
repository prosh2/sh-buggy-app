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
    <div className="flex flex-wrap gap-4 h-[50vh] justify-center overflow-y-scroll no-scrollbar">
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
          className="grid grid-rows-3 h-[150px] gap-4 p-4 border-2 rounded-xl shadow-sm cursor-pointer select-none"
        >
          <div className="flex text-gray-700 font-medium justify-center">
            <Chip
              color="primary"
              variant="filled"
              label={item.name}
              className="font-bold"
            />
          </div>
          <div className="grid grid-cols-3 text-sm text-gray-500 space-x-2 justify-between">
            <Chip variant="filled" label={"Price"} className="font-bold" />
            <Chip variant="filled" label={"Quantity"} className="font-bold" />
            <Chip variant="filled" label={"Shares"} className="font-bold" />
          </div>
          <div className="grid grid-cols-3 text-sm text-gray-500 space-x-2 justify-between">
            <Chip
              variant="outlined"
              label={"$" + item.price}
              className="font-bold"
            />
            <Chip
              variant="outlined"
              label={item.quantity}
              className="font-bold"
            />
            <Chip
              variant="outlined"
              label={itemSelectionCounts[item.id] || 0}
              className="font-bold"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
