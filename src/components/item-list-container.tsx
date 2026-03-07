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
    <div className="flex flex-col gap-3 h-[50vh] overflow-y-scroll no-scrollbar px-2">
      {items?.map((item) => {
        const selected = selectedItems[selectedUser]?.includes(item.id);
        return (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.96 }}
            animate={{
              borderColor: selected ? "#2563EB" : "#e5e7eb",
              backgroundColor: selected ? "#eff6ff" : "#ffffff",
              color: selected ? "#2563EB" : "#000000",
            }}
            transition={{ duration: 0.15 }}
            onClick={() => toggleItem(item.id)}
            className="flex flex-col gap-3 p-4 border rounded-2xl shadow-sm cursor-pointer"
          >
            {/* Top row */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                {item.name}
              </span>

              <span className="text-lg font-bold">
                ${item.price}
              </span>
            </div>

            {/* Bottom info */}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Qty: {item.quantity}</span>

              <span>
                Shares:{" "}
                <span className="font-semibold text-gray-700">
                  {itemSelectionCounts[item.id] || 0}
                </span>
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
