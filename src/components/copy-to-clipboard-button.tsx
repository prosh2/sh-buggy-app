import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import { motion } from "framer-motion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
export default function CopyToClipboardButton({
  textToCopy,
}: {
  textToCopy: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="bg-gray-900 px-4 py-2 rounded mb-4 break-words text-gray-100 w-[300px] shadow-lg border-black border-r-1 shadow-black">
      <div className="flex flex-col items-center">
        <div className="text-sm py-2 shadow-lg border-gray-700 border-1 text-gray-200">
          {textToCopy}
        </div>
        <motion.button
          className="flex items-center space-x-2 mt-5 mb-2 shadow-lg border-black border-r-1 shadow-black rounded px-3 py-1"
          onClick={copyToClipboard}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {copied ? (
            <span className="text-green-400">Copied!</span>
          ) : (
            <ContentCopyIcon />
          )}
        </motion.button>
      </div>
    </div>
  );
}
