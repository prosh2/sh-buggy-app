import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Snackbar,
  SnackbarOrigin,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import UploadReceipt from "../receipt/upload-receipt";
import { Item } from "@/app/context/session-context";

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const DUMMY_EXTRACTED_RESULT = {
  store: {
    name: "STRONG FLOUR",
    address: "30 EAST COAST ROAD, KATONG V., SINGAPORE #01-01",
    telephone: "6440 0457",
    receipt_no: "00011677",
    table: "13",
    date_time: "05-05-18 13:31",
    cashier: "Admin",
  },
  items: [
    { id: "1", name: "GRANCHIO", price: 19.0, quantity: 1 },
    { id: "2", name: "VONGOLE", price: 18.0, quantity: 1 },
    { id: "3", name: "ARUGULA PESTO", price: 19.0, quantity: 1 },
    { id: "4", name: "FOC Discount", price: -16.0, quantity: 1 },
    { id: "5", name: "PIZZA ORTOLANA", price: 18.0, quantity: 1 },
    { id: "6", name: "FOC Discount", price: -18.0, quantity: 1 },
    { id: "7", name: "LATTE", price: 5.0, quantity: 1 },
    { id: "8", name: "THE ENTERTAINER", price: 0.0, quantity: 2 },
  ],
  summary: {
    sub_total: 45.0,
    gst_7_percent: 3.15,
    total: 48.15,
    payment_method: "VISA",
    service_charge: null,
    time: "13:33",
  },
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 1, py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UploadReceiptDialog(props: DialogProps) {
  const { onClose, open: openDialog } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [extractedItems, setExtractedItems] = useState<Item[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openSB, setOpenSB] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCloseDialog = () => {
    onClose();
  };

  const handleCloseSB = () => {
    setOpenSB(false);
  };

  const handleQuantityChange = (item: Item, newQuantity: string) => {
    if (isNaN(Number(newQuantity))) return;
    const updatedItems = extractedItems.map((it: Item) =>
      it === item ? { ...it, quantity: Number(newQuantity) } : it
    );
    setExtractedItems(updatedItems);
  };

  const handleNameChange = (item: Item, newName: string) => {
    const updatedItems = extractedItems.map((it: Item) =>
      it === item ? { ...it, name: newName } : it
    );
    setExtractedItems(updatedItems);
  };

  const handlePriceChange = (item: Item, newPrice: string) => {
    if (isNaN(Number(newPrice))) return;
    const updatedItems = extractedItems.map((it: Item) =>
      it === item ? { ...it, price: Number(newPrice) } : it
    );
    setExtractedItems(updatedItems);
  };

  const handleTextExtraction = () => {
    console.log("Extracting text from image:", selectedImage);
    // Call api here and save result to state
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setExtractedItems(DUMMY_EXTRACTED_RESULT.items);
      setOpenSB(true);
      setSelectedTab(1);
    }, 1000);
  };

  const showItemized = (items: Item[]) => {
    try {
      return items.map((item: Item, idx) => (
        <>
          <TextField
            id="item-quantity-input"
            key={"item-quantity-input-" + idx}
            label="Qty"
            variant="filled"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item, e.target.value)}
            style={{ width: "5ch" }}
          />
          <TextField
            id="item-name-input"
            key={"item-name-input-" + idx}
            label="Name"
            variant="filled"
            value={item.name}
            onChange={(e) => handleNameChange(item, e.target.value)}
          />
          <TextField
            id="item-price-input"
            key={"item-price-input-" + idx}
            label="$"
            variant="filled"
            value={item.price}
            onChange={(e) => handlePriceChange(item, e.target.value)}
          />
        </>
      ));
    } catch (error) {
      return "Error parsing extracted text.";
    }
  };
  return (
    <Dialog onClose={handleCloseDialog} open={openDialog} fullWidth>
      <Snackbar
        open={openSB}
        autoHideDuration={3000}
        onClose={handleCloseSB}
        message="Text extracted successfully"
        anchorOrigin={
          { vertical: "bottom", horizontal: "center" } as SnackbarOrigin
        }
      />
      <DialogTitle
        className="bg-gray-900 text-gray-200"
        style={{ fontFamily: "monospace" }}
      >
        Upload Receipt
      </DialogTitle>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Receipt" {...a11yProps(0)} />
            <Tab
              label="Text"
              {...a11yProps(1)}
              disabled={extractedItems.length === 0}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={selectedTab} index={0}>
          <UploadReceipt
            status={status}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleTextExtraction={handleTextExtraction}
          />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={1}>
          <div className="flex flex-col items-center justify-center w-full h-full p-0 gap-4 overflow-hidden">
            <h2 className="text-lg font-medium">Extracted Items Preview</h2>
            <div className="w-full h-64 p-2 border border-gray-300 rounded overflow-auto bg-white text-center">
              <div className="grid grid-cols-[50px_minmax(80px,1fr)_50px] gap-2 font-mono font-bold p-1">
                {showItemized(extractedItems)}
              </div>
            </div>
          </div>
        </CustomTabPanel>
      </Box>
      <button
        onClick={handleCloseDialog}
        className="absolute right-0 top-0 w-[24px] h-[24px] bg-red-500 text-white rounded hover:bg-red-300 cursor-pointer"
      >
        <ClearIcon />
      </button>
    </Dialog>
  );
}
