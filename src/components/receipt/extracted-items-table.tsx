import { Item, ReceiptMisc } from "@/app/context/session-context";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import EditableItemsTable from "./editable-receipt";

export default function ExtractedItemsTable({
  items,
  receiptMisc,
  setExtractedItems,
}: {
  items: Item[];
  receiptMisc: ReceiptMisc;
  setExtractedItems: React.Dispatch<React.SetStateAction<Item[]>>;
}) {
  const handleQuantityChange = (item: Item, newQuantity: string) => {
    if (isNaN(Number(newQuantity))) return;
    const updatedItems = items.map((it: Item) =>
      it === item ? { ...it, quantity: Number(newQuantity) } : it,
    );
    setExtractedItems(updatedItems);
  };

  const handleNameChange = (item: Item, newName: string) => {
    const updatedItems = items.map((it: Item) =>
      it === item ? { ...it, name: newName } : it,
    );
    setExtractedItems(updatedItems);
  };

  const handlePriceChange = (item: Item, newPrice: string) => {
    if (isNaN(Number(newPrice))) return;
    const updatedItems = items.map((it: Item) =>
      it === item ? { ...it, price: Number(newPrice) } : it,
    );
    setExtractedItems(updatedItems);
  };

  const handleDeleteItem = (item: Item) => {
    const updatedItems = items.filter((it: Item) => it !== item);
    setExtractedItems(updatedItems);
  };

  const addItem = () => {
    const newItem: Item = {
      id: uuidv4(),
      name: "New Item",
      quantity: 1,
      price: 0,
    };
    setExtractedItems([...items, newItem]);
  };
  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex flex-col gap-2 font-mono font-bold p-1 max-h-[65vh]">
        <EditableItemsTable
          items={items}
          receiptMisc={receiptMisc}
          handleDeleteItem={handleDeleteItem}
          handleNameChange={handleNameChange}
          handlePriceChange={handlePriceChange}
          handleQuantityChange={handleQuantityChange}
        />
      </div>
      <Button
        style={{
          marginTop: "auto",
          color: "white",
          backgroundColor: "var(--color-black)",
        }}
        variant="contained"
        fullWidth
        onClick={addItem}
      >
        Add Item
      </Button>
    </div>
  );
}
