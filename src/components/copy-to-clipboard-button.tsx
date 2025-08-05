import { useState } from "react";

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
    <button
      className="bg-gray-800 px-4 py-2 rounded mb-4 break-words text-gray-100"
      onClick={copyToClipboard}
    >
      {copied ? "Copied!" : url}
    </button>
  );
}
