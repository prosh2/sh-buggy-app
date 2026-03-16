import React from "react";
import CopyToClipboardButton from "./buttons/copy-to-clipboard-button";
import ShareButtonContainer from "./share-button-container";

interface ShareSessionContainerProps {
  url: string;
  whatsappShareUrl: string;
  telegramShareUrl: string;
}
export default function ShareSessionContainer({
  url,
  whatsappShareUrl,
  telegramShareUrl,
}: ShareSessionContainerProps) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 w-full shadow-xl">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-lg font-semibold text-gray-100">Share Session</h2>
        <p className="text-sm text-gray-400">
          Send this link so others can join
        </p>
      </div>

      {/* Link box */}
      <CopyToClipboardButton textToCopy={url} />

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-gray-700 flex-1" />
        <span className="text-xs text-gray-500">or share via</span>
        <div className="h-px bg-gray-700 flex-1" />
      </div>

      {/* Share buttons */}
      <ShareButtonContainer
        whatsappShareUrl={whatsappShareUrl}
        telegramShareUrl={telegramShareUrl}
      />
    </div>
  );
}
