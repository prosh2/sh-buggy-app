"use client";
import { Item, User, useSession } from "@/app/context/session-context";
import { useSessionItems } from "@/app/hooks/use-session-items";
import { useSessionUsers } from "@/app/hooks/use-session-users";
import CopyToClipboardButton from "@/components/copy-to-clipboard-button";
import ShareButton from "@/components/share-button";
import UserListContainer from "@/components/user-list-container";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SessionPage() {
  const [url, setUrl] = useState("");
  const { session, setSession } = useSession();
  const { sessionID } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if running in browser
      setUrl(window.location.href);
    }
  }, []);

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Join my session: ${url}`
  )}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent("Join my session")}`;

  const handleUsersUpdate = useCallback(
    (users: User[]) => {
      setSession((prev) => ({
        ...prev,
        id: sessionID ? sessionID.toString() : "",
        users,
      }));
      console.log("Users updated:", users);
    },
    [setSession]
  );
  const handleItemsUpdate = useCallback(
    (items: Item[]) => {
      setSession((prev) => ({
        ...prev,
        id: sessionID ? sessionID.toString() : "",
        items,
      }));
      console.log("Items updated:", items);
    },
    [setSession]
  );
  const handleReadyClick = () => {
    console.log("Ready button clicked");
    if (session.users.length === 0) {
      console.error("No users in session"); //todo add snackbar or toast
      return;
    }
    router.push(`/session/${session?.id}/split`);
  };
  useSessionUsers(sessionID ? sessionID.toString() : "", handleUsersUpdate);
  useSessionItems(sessionID ? sessionID.toString() : "", handleItemsUpdate);

  return (
    <div className="bg-radial from-black-400 to-gray-900 flex flex-col h-screen">
      <UserListContainer />
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <div className="flex flex-col items-center justify-center text-center px-4 w-full rounded">
          <CopyToClipboardButton url={url} />
          <div className="flex justify-center space-x-4 w-[300px] mb-4">
            <ShareButton
              label="Share on WhatsApp"
              url={whatsappShareUrl}
              color="oklch(0.73 0.21 147.82)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor"
                width="50"
                height="50"
              >
                <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z" />
              </svg>
            </ShareButton>

            <ShareButton
              label="Share on Telegram"
              url={telegramShareUrl}
              color="oklch(0.62 0.21 259.24)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor"
                width="50"
                height="50"
              >
                <path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z" />
              </svg>
            </ShareButton>
          </div>
          <motion.button
            className="flex justify-center items-center w-[150px] rounded h-10 shadow-lg border-black border-r-1 shadow-black bg-gray-900"
            style={{
              color: "white",
            }}
            onClick={handleReadyClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Ready
          </motion.button>
        </div>
      </div>
    </div>
  );
}
