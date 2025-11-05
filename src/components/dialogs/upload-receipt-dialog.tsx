import { Item, useSession } from "@/app/context/session-context";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Snackbar,
  SnackbarOrigin,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Fragment, useMemo, useState } from "react";
import UploadReceipt from "../receipt/upload-receipt";
import ExtractedItemsTable from "../receipt/extracted-items-table";
interface DialogProps {
  open: boolean;
  onClose: () => void;
  handleCreateSession: (items: Item[]) => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface SnackBarState {
  open: boolean;
  message: string;
}

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
  const { onClose, handleCreateSession, open: openDialog } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [extractedItems, setExtractedItems] = useState<Item[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [sbState, setSBState] = useState<SnackBarState>({
    open: false,
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCloseDialog = () => {
    onClose();
    handleCreateSession(extractedItems);
  };

  const handleCloseSB = () => {
    setSBState({ ...sbState, open: false });
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

  //TODO: export to new api pipeline
  //Assuming receipts usually have this pattern: quantity, item name, price
  const processOCRResponse = (data: []) => {
    try {
      const items: Item[] = [];
      for (let i = 0; i < data.length; i++) {
        if (/^\d+$/.test(data[i]) && parseInt(data[i]) < 50) {
          // looks like a quantity
          const quantity = parseInt(data[i]);
          const nameParts: string[] = [];
          let j = i + 1;
          // collect item name until a price or keyword eg "19.00", "TOTAL" is found
          while (
            j < data.length &&
            !/^-?\d+\.\d{2}$/.test(data[j]) &&
            !["Sub-Total", "TOTAL", "FOC"].includes(data[j])
          ) {
            nameParts.push(data[j]);
            j++;
          }
          const name = nameParts.join(" ");
          const price = parseFloat(data[j]);
          if (!isNaN(price)) {
            items.push({ id: crypto.randomUUID(), quantity, name, price });
          }
          i = j;
        }
      }
      return items;
    } catch (error) {
      throw new Error("Error processing OCR response");
    }
  };

  const handleTextExtraction = async () => {
    try {
      setStatus("loading");
      // Call api here and save result to state
      const formData = new FormData();
      formData.append("image", selectedImage as File);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to extract text from image");
      }

      const { result } = await res.json();
      setStatus("success");
      setExtractedItems(processOCRResponse(result));
      setSBState({ open: true, message: "Text extracted successfully" });
      setSelectedTab(1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus("error");
        setSBState({ open: true, message: "Error: " + error.message });
      }
    }
  };

  const handleDeleteItem = (item: Item) => {
    const updatedItems = extractedItems.filter((it: Item) => it !== item);
    setExtractedItems(updatedItems);
  };

  const showItemized = (items: Item[]) => {
    try {
      return items.map((item: Item, idx) => (
        <Fragment key={"item-row-" + idx}>
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
          <Button
            key={"item-delete-button-" + idx}
            variant="contained"
            color="error"
            style={{ minWidth: "24px" }}
            onClick={() => handleDeleteItem(item)}
          >
            <ClearIcon />
          </Button>
        </Fragment>
      ));
    } catch (error) {
      return "Error parsing extracted text." + error;
    }
  };

  const subtotal = useMemo(
    () =>
      extractedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [extractedItems]
  );

  return (
    <Dialog onClose={handleCloseDialog} open={openDialog} fullWidth>
      <Snackbar
        open={sbState.open}
        autoHideDuration={3000}
        onClose={handleCloseSB}
        message={sbState.message}
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
              <ExtractedItemsTable
                items={extractedItems}
                showItemized={showItemized}
                subtotal={subtotal}
                setExtractedItems={setExtractedItems}
              />
            </div>
            <Button
              variant="contained"
              style={{ backgroundColor: "var(--color-gray-900)" }}
              onClick={handleCloseDialog}
            >
              Create Session
            </Button>
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
