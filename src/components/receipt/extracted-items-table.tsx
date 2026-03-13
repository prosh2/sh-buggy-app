import { Item, ReceiptMisc } from "@/app/context/session-context";
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2 font-mono font-bold p-1 mb-2 h-full">
        <EditableItemsTable
          items={items}
          receiptMisc={receiptMisc}
          handleDeleteItem={handleDeleteItem}
          handleNameChange={handleNameChange}
          handlePriceChange={handlePriceChange}
          handleQuantityChange={handleQuantityChange}
        />
      </div>
    </div>
  );
}
