import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CircularProgress, IconButton, Skeleton } from "@mui/material";
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
            <Image
              className="w-full sm:w-[420px] max-h-[300px] object-contain border-gray-300 border py-1"
              alt="not found"
              src={URL.createObjectURL(selectedImage)}
              width={420}
              height={236}
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
