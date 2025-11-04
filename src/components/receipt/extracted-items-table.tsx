import { Item } from "@/app/context/session-context";
import { Button } from "@mui/material";
import { Fragment } from "react";
import AddIcon from "@mui/icons-material/Add";

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
      <div className="flex justify-end items-center gap-2 font-bold pt-2 border-t col-span-4">
        <span>Subtotal:</span>
        <span>{subtotal.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="grid grid-cols-[50px_minmax(80px,1fr)_50px_30px] gap-2 font-mono font-bold p-1">
        {showItemized(items)}
      </div>

      <div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            const newItem: Item = {
              id: crypto.randomUUID(),
              name: "New Item",
              quantity: 1,
              price: 0,
            };
            setExtractedItems([...items, newItem]);
          }}
        >
          <AddIcon />
        </Button>
      </div>
      <SubtotalComponent subtotal={subtotal} />
    </Fragment>
  );
}
