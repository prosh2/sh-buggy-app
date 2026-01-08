import { Item } from "@/app/context/session-context";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { Fragment } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ExtractedItemsTable({
  items,
  showItemized,
  setExtractedItems,
  subtotal,
}: {
  items: Item[];
  showItemized: (items: Item[]) => React.ReactNode;
  setExtractedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  subtotal: number;
}) {
  function SubtotalComponent({ subtotal }: { subtotal: number }) {
    return (
      <div className="flex justify-end items-center gap-2 font-bold pt-2 col-span-4 text-black">
        <span>Subtotal:</span>
        <span>{subtotal.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-col gap-2 font-mono font-bold p-1">
        {showItemized(items)}
      </div>

      <Button
        style={{ backgroundColor: "var(--color-gray-700)" }}
        variant="contained"
        fullWidth
        onClick={() => {
          const newItem: Item = {
            id: uuidv4(),
            name: "New Item",
            quantity: 1,
            price: 0,
          };
          setExtractedItems([...items, newItem]);
        }}
      >
        <AddIcon />
      </Button>
      <SubtotalComponent subtotal={subtotal} />
    </Fragment>
  );
}
