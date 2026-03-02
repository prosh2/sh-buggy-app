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
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        showCopied();
        return;
      } catch {
        // fall through to iOS fallback
      }
    }

    // iOS fallback
    try {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand("copy");
      document.body.removeChild(textarea);

      showCopied();
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const showCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 rounded-xl p-2">
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
