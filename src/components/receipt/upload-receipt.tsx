import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button, CircularProgress, IconButton } from "@mui/material";
import Image from "next/image";

interface Props {
  selectedImage: File | null;
  status: "idle" | "loading" | "success" | "error";
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  handleTextExtraction: () => void;
}

export default function UploadReceipt(props: Props) {
  const { status, selectedImage, setSelectedImage, handleTextExtraction } =
    props;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setSelectedImage(event.target.files[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Scan Receipt</h2>
        <p className="text-sm text-gray-500">
          Upload a receipt and we will extract the items automatically
        </p>
      </div>

      <div className="w-full max-w-[512px]">
        {selectedImage ? (
          <div className="relative rounded-2xl shadow-md p-4">
            {status === "loading" && (
              <div
                className="absolute inset-0 flex items-center justify-center 
              bg-white/70 backdrop-blur-sm rounded-2xl z-10"
              >
                <CircularProgress />
              </div>
            )}

            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="receipt preview"
              width={420}
              height={300}
              className="w-full max-h-[320px] object-contain bg-gray-50 rounded-xl"
            />

            <IconButton
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white shadow hover:bg-red-50"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <label
            htmlFor="upload-receipt"
            className="flex flex-col items-center justify-center 
            w-full h-[260px]
            border-2 border-dashed border-gray-300
            rounded-2xl
            bg-gray-50
            hover:bg-gray-100
            cursor-pointer
            transition"
          >
            <FileUploadIcon
              className="text-gray-500"
              style={{ fontSize: 40 }}
            />

            <p className="mt-3 text-sm font-medium text-gray-700">
              Upload Receipt
            </p>

            <p className="text-xs text-gray-400">
              Click to browse or drag image here
            </p>

            <input
              id="upload-receipt"
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileUpload}
            />
          </label>
        )}
      </div>

      {selectedImage && (
        <Button
          variant="contained"
          onClick={handleTextExtraction}
          sx={{
            borderRadius: 3,
            px: 3,
            textTransform: "none",
            mt: 5,
            fontWeight: 600,
            ":disabled": {
              opacity: 0.5,
            },
          }}
        >
          {status === "loading" ? "Scanning receipt..." : "Extract Items"}
        </Button>
      )}
    </div>
  );
}
