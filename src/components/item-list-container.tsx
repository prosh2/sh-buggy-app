import { Item } from "@/app/context/session-context";
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
    <div className="flex flex-col gap-3 overflow-y-auto pb-24">
      {items.map((item) => {
        const selected = selectedItems[selectedUser]?.includes(item.id);

        return (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggleItem(item.id)}
            className={`p-4 rounded-xl border transition cursor-pointer
        ${
          selected
            ? "bg-blue-600/10 border-blue-500"
            : "bg-gray-800 border-gray-700 hover:border-gray-600"
        }`}
          >
            {/* top */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base">{item.name}</span>

              <span className="font-bold text-green-400">${item.price}</span>
            </div>

            {/* bottom */}
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Qty {item.quantity}</span>

              <span>
                Shared by{" "}
                <span className="text-gray-200 font-semibold">
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
