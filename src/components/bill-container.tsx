import { User } from "@/app/context/session-context";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Chip, IconButton } from "@mui/material";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import Receipt from "./receipt/receipt";
import UserSelection from "./user/user-selection";

export default function BillContainer({
  users,
  itemSelectionCounts,
  isHidden,
  goBack,
}: {
  users: User[];
  itemSelectionCounts: Record<string, number>;
  isHidden: boolean;
  goBack: () => void;
}) {
  const userRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getAmountPayable = useMemo(() => {
    const user = users.find((user) => user.id === selectedUser);
    const amount = user?.allocatedItems.reduce(
      (acc, item) =>
        acc +
        ((item.price * item.quantity) / itemSelectionCounts[item.id] || 1),
      0,
    );
    return amount?.toFixed(2);
  }, [selectedUser]);

  const copyToClipboard = async () => {
    if (!getAmountPayable) return;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(getAmountPayable);
        showCopied();
        return;
      } catch {
        // fall through to iOS fallback
      }
    }

    // iOS fallback
    try {
      const textarea = document.createElement("textarea");
      textarea.value = getAmountPayable;
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
    <>
      {!isHidden && (
        <div className="rounded shadow-lg flex flex-col items-center p-4 h-full">
          <motion.button
            className="absolute right-0 top-0 m-4 bg-red-600 shadow-black shadow-lg border-black border-r-2 border-l-2 px-4 py-2 rounded-xl text-xs font-mono shadow"
            onClick={goBack}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            Back
          </motion.button>
          <div className="flex flex-col w-full h-50 justify-center">
            <UserSelection
              userRefs={userRefs}
              users={users}
              selectedUser={selectedUser || ""}
              setSelectedUser={setSelectedUser}
            />
          </div>
          {selectedUser && (
            <div className="flex flex-col justify-center items-center h-100 w-full">
              <div className="flex flex-col h-full w-full items-center">
                <Receipt
                  users={users}
                  selectedUser={selectedUser}
                  itemCounts={itemSelectionCounts}
                />
                <div
                  key={selectedUser}
                  className="px-2 p-8 flex h-full justify-center items-center"
                >
                  <div className="flex flex-col justify-center gap-2 items-center bg-gray-900 px-4 py-2 rounded mb-4 break-words text-gray-100 w-[300px] shadow-lg border-black border-r-1 shadow-black">
                    <div className="text-gray-100">
                      {users.find((user) => user.id === selectedUser)?.name}{" "}
                      owes
                    </div>
                    <div>
                      <Chip
                        label={copied ? "Copied!" : getAmountPayable}
                        icon={<ContentCopyIcon />}
                        clickable
                        onClick={copyToClipboard}
                        color={copied ? "success" : "default"}
                        sx={{ color: "white", fontSize: "1.0rem" }}
                        variant="outlined"
                      />
                    </div>
                    <div>Pay with the following:</div>
                    <IconButton
                      onClick={() => (window.location.href = "dbspaylah://")}
                    >
                      <Image
                        src="/dbspaylah.png"
                        alt="dbspaylah"
                        width={50}
                        height={50}
                      />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
