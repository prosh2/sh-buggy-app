import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "motion/react";
import { useState } from "react";
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
    <>
      <span className="truncate text-sm">{textToCopy}</span>
      <motion.button
        onClick={copyToClipboard}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        {copied ? (
          <span className="text-sm text-green-400">Copied!</span>
        ) : (
          <span>📋</span>
        )}
      </motion.button>
    </>
  );
}
