import { Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  selectedImage: File | null;
  setExtractedText: React.Dispatch<React.SetStateAction<string>>;
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
    { name: "GRANCHIO", price: 19.0 },
    { name: "VONGOLE", price: 18.0 },
    { name: "ARUGULA PESTO", price: 19.0 },
    { name: "FOC Discount", price: -16.0 },
    { name: "PIZZA ORTOLANA", price: 18.0 },
    { name: "FOC Discount", price: -18.0 },
    { name: "LATTE", price: 5.0 },
    { name: "THE ENTERTAINER", price: 0.0 },
  ],
  summary: {
    sub_total: 45.0,
    gst_7_percent: 3.15,
    total: 48.15,
    payment_method: "VISA",
    service_charge: null,
    time: "13:33",
  },
} as const;

export default function UploadReceipt(props: Props) {
  const { selectedImage, setSelectedImage, setExtractedText, setOpenSB } =
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
      setExtractedText(JSON.stringify(DUMMY_EXTRACTED_RESULT));
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
      <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4 overflow-hidden">
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
              className="w-full max-w-full max-h-[236px] object-contain border-gray-300 border py-1"
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
