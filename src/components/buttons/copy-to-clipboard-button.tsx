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
    <div className="flex items-center justify-between gap-3 bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3">
      <span className="truncate text-sm text-gray-300 font-mono">
        {textToCopy}
      </span>

      <motion.button
        onClick={copyToClipboard}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg transition"
      >
        {copied ? "✓ Copied" : "Copy"}
      </motion.button>
    </div>
  );
}
