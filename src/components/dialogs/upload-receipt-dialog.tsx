import { Item } from "@/app/context/session-context";
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
import DialogTitle from "@mui/material/DialogTitle";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import ExtractedItemsTable from "../receipt/extracted-items-table";
import UploadReceipt from "../receipt/upload-receipt";
import { v4 as uuidv4 } from "uuid";

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
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 2,
      }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            p: 3,
            height: "100%",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DUMMY_ITEMS: Item[] = [
  { id: uuidv4(), name: "Item 1", quantity: 2, price: 5.99 },
  { id: uuidv4(), name: "Item 2", quantity: 1, price: 3.49 },
  { id: uuidv4(), name: "Item 3", quantity: 4, price: 2.0 },
];

export default function UploadReceiptDialog(props: DialogProps) {
  const { onClose, handleCreateSession, open: openDialog } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [extractedItems, setExtractedItems] = useState<Item[]>(DUMMY_ITEMS);
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

  const createSession = () => {
    onClose();
    handleCreateSession(extractedItems);
  };

  const handleCloseSB = () => {
    setSBState({ ...sbState, open: false });
  };

  const handleQuantityChange = (item: Item, newQuantity: string) => {
    if (isNaN(Number(newQuantity))) return;
    const updatedItems = extractedItems.map((it: Item) =>
      it === item ? { ...it, quantity: Number(newQuantity) } : it,
    );
    setExtractedItems(updatedItems);
  };

  const handleNameChange = (item: Item, newName: string) => {
    const updatedItems = extractedItems.map((it: Item) =>
      it === item ? { ...it, name: newName } : it,
    );
    setExtractedItems(updatedItems);
  };

  const handlePriceChange = (item: Item, newPrice: string) => {
    if (isNaN(Number(newPrice))) return;
    const updatedItems = extractedItems.map((it: Item) =>
      it === item ? { ...it, price: Number(newPrice) } : it,
    );
    setExtractedItems(updatedItems);
  };

  function extractJSONArray(input: string) {
    // Remove code fences like ``` or ```json
    const noFences = input.replace(/```[\s\S]*?\n|```/g, "");

    // Extract content between the first [ and the last ]
    const match = noFences.match(/\[[\s\S]*\]/);

    return match ? match[0] : null;
  }
  //TODO: export to new api pipeline
  const processOCRResponse = async (data: { result: Item[] }) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to extract text from image");
      }
      const result = await res.json();
      const extractedText = extractJSONArray(result);
      if (!extractedText) {
        throw new Error("No valid JSON array found in OCR response");
      }
      const items: Item[] = [];
      for (const _ of JSON.parse(extractedText) as Item[]) {
        const quantity = isNaN(Number(_.quantity)) ? 1 : Number(_.quantity);
        const price = isNaN(Number(_.price)) ? 0 : Number(_.price);
        items.push({
          id: uuidv4(),
          quantity,
          name: _.name,
          price,
        });
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

      const result = await res.json();
      const extractedItems = await processOCRResponse(result);
      setStatus("success");
      setExtractedItems(extractedItems);
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
        <div
          key={"item-row-" + idx}
          className="grid grid-cols-[50px_minmax(80px,1fr)_60px_8px] gap-2 font-mono font-bold p-1"
        >
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
            variant="text"
            color="error"
            style={{ minWidth: "8px" }}
            onClick={() => handleDeleteItem(item)}
          >
            <ClearIcon />
          </Button>
        </div>
      ));
    } catch (error) {
      return "Error parsing extracted text." + error;
    }
  };

  const subtotal = useMemo(
    () =>
      extractedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [extractedItems],
  );

  return (
    <AnimatePresence>
      {openDialog && (
        <motion.div
          className="absolute flex flex-col justify-center bg-white text-gray-200 w-[90vw] md:w-[50vw] md:min-h-[50vh] rounded-lg"
          initial={{ transform: "translateY(100vh)" }}
          animate={{ transform: "translateY(0px)" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          exit={{ transform: "translateY(100vh)", opacity: 0.75 }}
        >
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
            className="bg-black bg-radial from-black-400 to-gray-800 text-center"
            style={{
              fontFamily: "sans-serif",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Upload Receipt
          </DialogTitle>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ flex: 1, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab label="Receipt" {...a11yProps(0)} />
                <Tab
                  label="Items"
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
              <div className="flex flex-col flex-1 justify-between items-center p-0 gap-4 overflow-hidden">
                <div className="flex flex-col flex-1 w-full h-full  max-h-[30vh] p-2 rounded overflow-auto text-center bg-gray-50 shadow-inner border border-gray-200">
                  <ExtractedItemsTable
                    items={extractedItems}
                    showItemized={showItemized}
                    subtotal={subtotal}
                    setExtractedItems={setExtractedItems}
                  />
                </div>
                <Button
                  className="font-sans"
                  variant="contained"
                  onClick={createSession}
                  size="large"
                  sx={{
                    color: "var(--color-white)",
                    backgroundColor: "var(--color-green-400)",
                  }}
                >
                  New Session
                </Button>
              </div>
            </CustomTabPanel>
          </Box>
          <button
            onClick={() => onClose()}
            className="absolute right-0 top-0 w-[24px] h-[24px] bg-red-500 text-white rounded hover:bg-red-300 cursor-pointer"
          >
            <ClearIcon />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
