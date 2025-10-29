import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import UploadReceiptSection from "../receipt/upload-receipt";

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadReceiptDialog(props: DialogProps) {
  const { onClose, open } = props;
  const [showTextPreview, setShowTextPreview] = useState<string>("");

  const handleClose = () => {
    onClose();
  };

  const renderDialogContent = () => {
    if (showTextPreview) {
      //show editable itemized list
      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4 overflow-hidden">
          <h2 className="text-lg font-medium">Extracted Text Preview</h2>
          <div className="w-full h-64 p-4 border border-gray-300 rounded overflow-auto bg-white text-left">
            <pre className="whitespace-pre-wrap break-words">
              {showTextPreview}
            </pre>
          </div>
        </div>
      );
    }
    return <UploadReceiptSection setShowTextPreview={setShowTextPreview} />;
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        className="bg-gray-900 text-gray-200"
        style={{ fontFamily: "monospace" }}
      >
        Upload Receipt
      </DialogTitle>
      {renderDialogContent()}
      <button
        onClick={handleClose}
        className="absolute right-0 top-0 w-[24px] h-[24px] bg-red-500 text-white rounded hover:bg-red-300 cursor-pointer"
      >
        <ClearIcon />
      </button>
    </Dialog>
  );
}
