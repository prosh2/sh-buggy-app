import { Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Item } from "@/app/context/session-context";

interface Props {
  selectedImage: File | null;
  setExtractedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  setOpenSB: React.Dispatch<React.SetStateAction<boolean>>;
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

export default function UploadReceipt(props: Props) {
  const { selectedImage, setSelectedImage, setExtractedItems, setOpenSB } =
    props;
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleTextExtraction = () => {
    console.log("Extracting text from image:", selectedImage);
    // Call api here and save result to state
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setExtractedItems(DUMMY_EXTRACTED_RESULT.items);
      setOpenSB(true);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    console.log(event.target.files[0]);
    setSelectedImage(event.target.files[0]);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 overflow-hidden">
        {selectedImage ? (
          <div className="w-full h-full sm:w-[420px] flex items-center justify-center relative">
            {status === "loading" && (
              <CircularProgress
                style={{
                  position: "absolute",
                  color: "rgba(0, 0, 0, 0.7)",
                }}
              />
            )}
            <img
              className="w-full sm:w-[420px] max-h-[236px] object-contain border-gray-300 border py-1"
              alt="not found"
              src={URL.createObjectURL(selectedImage)}
            />

            {selectedImage && (
              <IconButton
                onClick={() => setSelectedImage(null)}
                style={{ position: "absolute", right: 0, top: 10 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ) : (
          <>
            <Skeleton variant="rectangular" width={420} height={236} />
            <IconButton
              aria-label="upload"
              component="label"
              style={{ zIndex: 10, position: "absolute" }}
            >
              <FileUploadIcon />
              <input
                id="upload-receipt"
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileUpload}
              />
            </IconButton>
          </>
        )}
      </div>
      {selectedImage && (
        <div className="flex items-center justify-center">
          <button
            className=" bg-green-500 hover:bg-green-300 text-white py-2 px-2 rounded text-sm font-mono cursor-pointer"
            onClick={handleTextExtraction}
          >
            Extract Text
          </button>
        </div>
      )}
    </>
  );
}
