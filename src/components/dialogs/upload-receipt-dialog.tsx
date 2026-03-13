import { Item, ReceiptMisc } from "@/app/context/session-context";
import AddIcon from "@mui/icons-material/Add";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Button } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ExtractedItemsTable from "../receipt/extracted-items-table";
import UploadReceipt from "../receipt/upload-receipt";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  handleCreateSession: (
    items: Item[],
    receiptMisc: ReceiptMisc,
  ) => Promise<void>;
}

interface SnackBarState {
  open: boolean;
  message: string;
}

const DUMMY_ITEMS: Item[] = [
  { id: uuidv4(), name: "Item 1", quantity: 2, price: 5.99 },
  { id: uuidv4(), name: "Item 2", quantity: 1, price: 3.49 },
  { id: uuidv4(), name: "Item 3", quantity: 4, price: 2.0 },
];

export default function UploadReceiptDialog(props: DialogProps) {
  const { onClose, handleCreateSession, open: openDialog } = props;
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
  const addItem = () => {
    const newItem: Item = {
      id: uuidv4(),
      name: "New Item",
      quantity: 1,
      price: 0,
    };
    setExtractedItems([...extractedItems, newItem]);
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
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(e, info) => {
              if (info.offset.y > 150 || info.velocity.y > 800) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="
              fixed z-50
              w-[100vw] md:max-w-[900px]
              bottom-0 md:bottom-auto
              top-[-50]
              md:top-1/2
              md:left-1/2
              md:-translate-x-1/2 md:-translate-y-1/2
              h-[92dvh] md:h-[88vh]
              bg-white
              rounded-t-2xl md:rounded-2xl
              shadow-2xl
              flex flex-col
              overflow-y-scroll md:overflow-hidden
              no-scrollbar
              touch-pan-y
              "
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
          >
            {/* Drag Handle (mobile UX) */}
            <div className="flex justify-center py-2 md:hidden">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Receipt Scanner
              </h2>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row flex-1">
              {/* Left Side */}
              <div className="flex flex-col items-center justify-center w-full md:w-[45%] md:border-r bg-gray-50 p-4">
                <UploadReceipt
                  status={status}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  handleTextExtraction={handleTextExtraction}
                />
              </div>

              {/* DRAG HANDLE (mobile only) */}
              <div className="flex justify-center py-1 md:hidden cursor-grab">
                <DragHandleIcon className="text-gray-400" fontSize="small" />
              </div>

              {/* Right Side */}
              <div className="flex flex-col flex-1 p-4 overflow-y-auto min-h-0 mb-4 md:mb-0">
                {extractedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                    Upload a receipt to extract items
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-hidden">
                      <ExtractedItemsTable
                        receiptMisc={receiptMisc}
                        items={extractedItems}
                        setExtractedItems={setExtractedItems}
                      />
                    </div>

                    <div className="flex justify-between mt-3">
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addItem}
                        sx={{
                          borderRadius: 3,
                          px: 3,
                          textTransform: "none",
                        }}
                      >
                        Add Item
                      </Button>
                      <Button
                        variant="contained"
                        onClick={createSession}
                        sx={{
                          borderRadius: 3,
                          px: 3,
                          textTransform: "none",
                        }}
                      >
                        New Session
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
