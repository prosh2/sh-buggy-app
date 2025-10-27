import { Button, IconButton, Skeleton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
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

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Upload Receipt</DialogTitle>
      <div className="flex flex-col items-center justify-center w-full p-4 gap-4">
        {selectedImage ? (
          <div>
            <img
              className="max-w-full max-h-full object-contain"
              alt="not found"
              src={URL.createObjectURL(selectedImage)}
            />
          </div>
        ) : (
          <>
            <Skeleton variant="rectangular" width={210} height={118} />
            <IconButton
              aria-label="upload"
              component="label"
              style={{ zIndex: 10, position: "fixed" }}
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

        {selectedImage && (
          <IconButton onClick={() => setSelectedImage(null)}>
            <ClearIcon />
          </IconButton>
        )}
      </div>
      <Button onClick={handleClose}>Close</Button>
    </Dialog>
  );
}
