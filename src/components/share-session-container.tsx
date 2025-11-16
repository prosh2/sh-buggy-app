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
    <div className="bg-gray-800 rounded-2xl p-6 w-full text-center shadow-lg">
      <p className="text-gray-400 mb-2 font-sans">Session Link</p>
      <CopyToClipboardButton textToCopy={url} />
      <ShareButtonContainer
        whatsappShareUrl={whatsappShareUrl}
        telegramShareUrl={telegramShareUrl}
      />
    </div>
  );
}
