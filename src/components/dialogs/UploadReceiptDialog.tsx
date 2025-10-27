import { Button, IconButton, Skeleton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
export interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadReceiptDialog(props: DialogProps) {
  const { onClose, open } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleClose = () => {
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    console.log(event.target.files[0]);
    setSelectedImage(event.target.files[0]);
  };

  const handleTextExtraction = () => {
    console.log("Extracting text from image:", selectedImage);
    // Implement text extraction logic here
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        className="bg-gray-900 text-gray-200"
        style={{ fontFamily: "monospace" }}
      >
        Upload Receipt
      </DialogTitle>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4 overflow-hidden">
        {selectedImage ? (
          <div className="w-full h-full sm:w-[420px] flex items-center justify-center relative">
            <img
              className="w-full max-w-full max-h-[236px] object-contain border-solid border-1 py-1"
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
      <div className="flex items-center justify-center bg-gray-900 p-2">
        {selectedImage && (
          <button
            className=" bg-green-500 hover:bg-green-300 text-white py-2 px-2 rounded text-sm font-mono"
            onClick={handleTextExtraction}
          >
            Extract Text
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        className="absolute right-0 top-0 w-[24px] h-[24px] bg-red-500 text-white rounded hover:bg-red-300"
      >
        <ClearIcon />
      </button>
    </Dialog>
  );
}
