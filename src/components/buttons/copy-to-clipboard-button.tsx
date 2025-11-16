import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "motion/react";
import { useState } from "react";

interface CopyToClipboardButtonProps {
  textToCopy: string;
}
export default function CopyToClipboardButton({
  textToCopy,
}: CopyToClipboardButtonProps) {
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
    <div className="flex items-center justify-between bg-gray-900 rounded-xl p-2">
      <span className="truncate text-sm font-sans">{textToCopy}</span>
      <motion.button
        onClick={copyToClipboard}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        {copied ? (
          <span className="text-sm text-green-400 font-sans">Copied!</span>
        ) : (
          <span>📋</span>
        )}
      </motion.button>
    </div>
  );
}
