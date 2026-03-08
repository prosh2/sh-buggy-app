import { Item, ReceiptMisc } from "@/app/context/session-context";
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useMemo, useState } from "react";

function SubtotalComponent({ subtotal }: { subtotal: number }) {
  return (
    <div className="flex justify-between items-center font-bold pt-2 pr-4">
      <span className="text-left text-gray-600">Subtotal:</span>
      <span className="text-red-500 text-lg">${subtotal.toFixed(2)}</span>
    </div>
  );
}

export default function EditableItemsTable(props: EditableItemsTableProps) {
  const {
    items,
    receiptMisc,
    handleQuantityChange,
    handleNameChange,
    handleDeleteItem,
    handlePriceChange,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  function renderReceiptMisc() {
    return (
      <>
        <div className="flex justify-between align-center font-normal text-sm mb-2 pb-2">
          <span className="text-gray-400">GST(9%)</span>
          <span>${receiptMisc.gst}</span>
        </div>
        <div className="flex justify-between align-center font-normal text-sm mb-2 pb-2">
          <span className="text-gray-400">Service Charge</span>
          <span>${receiptMisc.service_charge}</span>
        </div>
        <div className="flex justify-between align-center font-normal text-sm border-b border-gray-400 mb-2 pb-2">
          <span className="text-gray-400">Tips</span>
          <span>NA</span>
        </div>
      </>
    );
  }

  return (
    <Paper className="relative p-4 bg-[#fffef8] shadow-md">
      {/* Edit Toggle */}
      <IconButton
        className="!absolute top-2 right-0"
        size="small"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </IconButton>

      <div className="text-center text-lg pb-2 mb-2">
        <span>Confirm Receipt Breakdown</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400 font-normal">Merchant Name</span>
        <span>{receiptMisc.merchant_name}</span>
      </div>
      <div className="flex justify-between align-center text-sm border-b border-gray-400 mb-2 pb-2">
        <span className="text-gray-400 font-normal">Date</span>
        <span>{receiptMisc.date}</span>
      </div>

      <Itemized
        items={items}
        isEditing={isEditing}
        handleQuantityChange={handleQuantityChange}
        handleNameChange={handleNameChange}
        handleDeleteItem={handleDeleteItem}
        handlePriceChange={handlePriceChange}
      />
      {renderReceiptMisc()}
      <SubtotalComponent subtotal={subtotal} />
    </Paper>
  );
}

function Itemized(props: ItemizedProps) {
  const {
    items,
    isEditing,
    handleQuantityChange,
    handleNameChange,
    handlePriceChange,
    handleDeleteItem,
  } = props;

  return (
    <div className="border-b border-gray-400 pb-2 mb-2 overflow-y-scroll">
      {items.map((item: Item, idx) => (
        <div
          key={"item-row-" + idx}
          className="grid grid-cols-[40px_1fr_70px_24px] items-center gap-2  py-1 text-sm"
        >
          {/* Quantity */}
          {isEditing ? (
            <TextField
              variant="standard"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item, e.target.value)}
              inputProps={{ style: { textAlign: "center", width: "3ch" } }}
            />
          ) : (
            <Typography className="text-left">{item.quantity}</Typography>
          )}

          {/* Item Name */}
          {isEditing ? (
            <TextField
              variant="standard"
              fullWidth
              value={item.name}
              onChange={(e) => handleNameChange(item, e.target.value)}
            />
          ) : (
            <Typography className="text-left truncate">{item.name}</Typography>
          )}

          {/* Price */}
          {isEditing ? (
            <TextField
              variant="standard"
              value={item.price}
              onChange={(e) => handlePriceChange(item, e.target.value)}
              inputProps={{ style: { textAlign: "left" } }}
            />
          ) : (
            <Typography className="text-left">${item.price}</Typography>
          )}

          {/* Delete button only in edit mode */}
          {isEditing && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => handleDeleteItem(item)}
              sx={{ pr: 5 }}
            >
              <ClearIcon fontSize="small" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

interface ItemizedProps {
  items: Item[];
  isEditing: boolean;
  handleQuantityChange: (item: Item, quantity: string) => void;
  handleNameChange: (item: Item, name: string) => void;
  handlePriceChange: (item: Item, price: string) => void;
  handleDeleteItem: (item: Item) => void;
}

interface EditableItemsTableProps {
  items: Item[];
  receiptMisc: ReceiptMisc;
  handleQuantityChange: (item: Item, quantity: string) => void;
  handleNameChange: (item: Item, name: string) => void;
  handlePriceChange: (item: Item, price: string) => void;
  handleDeleteItem: (item: Item) => void;
}
