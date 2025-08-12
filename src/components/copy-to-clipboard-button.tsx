import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import { motion } from "framer-motion";
export default function CopyToClipboardButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="bg-gray-900 px-4 py-2 rounded mb-4 break-words text-gray-100 w-[300px] shadow-lg border-black border-r-1 shadow-black">
      <div className="flex flex-col items-center">
        <div className="text-sm">{url}</div>
        <motion.button
          className="flex items-center space-x-2 mt-5 mb-2 shadow-lg border-black border-r-1 shadow-black rounded px-3 py-1"
          onClick={copyToClipboard}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {copied ? (
            <span className="text-green-400">Copied!</span>
          ) : (
            <span className="text-gray-200">Copy URL</span>
          )}
          <ShareIcon />
        </motion.button>
      </div>
    </div>
  );
}
