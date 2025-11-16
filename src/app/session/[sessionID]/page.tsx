"use client";
import { Item, User, useSession } from "@/app/context/session-context";
import { useSessionItems } from "@/app/hooks/use-session-items";
import { useSessionUsers } from "@/app/hooks/use-session-users";
import ShareSessionContainer from "@/components/share-session-container";
import UserListContainer from "@/components/user/user-list-container";
import { Alert } from "@mui/material";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function SessionPage() {
  const [url, setUrl] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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
      // console.log("Users updated:", users);
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
      // console.log("Items updated:", items);
    },
    [setSession]
  );
  const handleReadyClick = () => {
    if (session.users.length === 0) {
      setShowAlert(true);
      return;
    }
    router.push(`/session/${session?.id}/split`);
  };
  useSessionUsers(sessionID ? sessionID.toString() : "", handleUsersUpdate);
  useSessionItems(sessionID ? sessionID.toString() : "", handleItemsUpdate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1117] to-[#1f2937] text-gray-200 flex flex-col items-center p-4">
      {showAlert && (
        <Alert
          className="absolute top-4 right-4 z-10"
          severity="warning"
          onClose={() => {
            setShowAlert(false);
            // console.log("Alert closed");
          }}
        >
          Session must contain at least 1 user!
        </Alert>
      )}
      <header className="flex flex-col items-center space-y-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1 ">Users in Session</h1>
        <p className="text-sm text-gray-400 font-sans">
          Total users: {session.users.length}
        </p>
        <ShareSessionContainer
          url={url}
          whatsappShareUrl={whatsappShareUrl}
          telegramShareUrl={telegramShareUrl}
        />
      </header>

      <main className="flex h-full flex-col items-center justify-center mt-5 w-full max-w-md">
        <UserListContainer />
      </main>

      <footer className="fixed bottom-10">
        <motion.button
          className="flex justify-center items-center w-[100vw] h-10 shadow-lg border-black border-r-1 shadow-black bg-gray-900 font-sans"
          style={{
            color: "white",
          }}
          onClick={handleReadyClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Continue
        </motion.button>
      </footer>
    </div>
  );
}
