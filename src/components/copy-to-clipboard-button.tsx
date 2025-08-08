import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";

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
    <div className="bg-gray-800 px-4 py-2 rounded mb-4 break-words text-gray-100 w-[300px]">
      <div className="flex flex-col items-center">
        <div>{url}</div>
        <button
          className="flex items-center space-x-2 mt-2 bg-gray-700 rounded px-3 py-1"
          onClick={copyToClipboard}
        >
          {copied ? (
            <span className="text-green-400">Copied!</span>
          ) : (
            <span className="text-gray-300">Copy URL</span>
          )}
          <ShareIcon />
        </button>
      </div>
    </div>
  );
}
