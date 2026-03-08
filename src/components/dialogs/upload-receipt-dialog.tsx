import { Item, ReceiptMisc } from "@/app/context/session-context";
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
import { useState } from "react";
import ExtractedItemsTable from "../receipt/extracted-items-table";
import UploadReceipt from "../receipt/upload-receipt";
import { v4 as uuidv4 } from "uuid";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  handleCreateSession: (
    items: Item[],
    receiptMisc: ReceiptMisc,
  ) => Promise<void>;
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
      }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            p: 1,
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
  const [receiptMisc, setReceiptMisc] = useState<ReceiptMisc>({
    merchant_name: "",
    service_charge: 0,
    currency_symbol: "",
    subtotal: 0,
    gst: 0,
    date: new Date().toDateString(),
  });
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
    handleCreateSession(extractedItems, receiptMisc);
  };

  const handleCloseSB = () => {
    setSBState({ ...sbState, open: false });
  };

  const processOCRResponse = async (data: object) => {
    try {
      const items: Item[] = [];
      for (const _ of data as Item[]) {
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

      const data = await res.json();
      const {
        result: ocr_items,
        gst,
        service_fee,
        merchant_name,
        currency_symbol,
        total_price,
        date,
      }: {
        result: Item[];
        gst: number;
        service_fee: number;
        merchant_name: string;
        currency_symbol: string;
        total_price: number;
        date: string;
      } = data;

      setReceiptMisc({
        merchant_name,
        service_charge: service_fee,
        currency_symbol,
        subtotal: total_price,
        gst,
        date,
      });
      const extractedItems = await processOCRResponse(ocr_items);
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

  return (
    <AnimatePresence>
      {openDialog && (
        <motion.div
          className="absolute flex flex-col justify-center bg-white text-gray-200 w-[90vw] h-[90vh] rounded-lg"
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
            Receipt
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
                centered
                textColor="primary"
                indicatorColor="secondary"
              >
                <Tab label="Image" {...a11yProps(0)} />
                <Tab
                  label="Breakdown"
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
              <div className="flex flex-col h-full justify-between items-center gap-2 overflow-hidden">
                <div className="flex flex-col w-full h-full rounded overflow-hidden text-center">
                  <ExtractedItemsTable
                    receiptMisc={receiptMisc}
                    items={extractedItems}
                    setExtractedItems={setExtractedItems}
                  />
                </div>
                <Button
                  className="font-sans"
                  variant="contained"
                  onClick={createSession}
                  size="large"
                  // sx={{
                  //   color: "var(--color-white)",
                  //   backgroundColor: "var(--color-green-400)",
                  // }}
                >
                  New Session
                </Button>
              </div>
              <button
                onClick={() => onClose()}
                className="absolute left-2 top-6 h-[24px] text-blue-500 font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </CustomTabPanel>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
