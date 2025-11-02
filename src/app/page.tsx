"use client";
import { EyeCatchingButton } from "@/components/buttons/eye-catching-btn";
import UploadReceiptDialog from "@/components/dialogs/UploadReceiptDialog";
import { TypingEffect } from "@/components/typing-effect";
import { LinearProgress } from "@mui/material";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const progressRef = useRef(() => {});
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const handleUploadReceipt = () => {
    console.log("Opening upload dialog");
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    console.log("Dialog closed");
    setOpenUploadDialog(false);
  };
  const handleCreateSession = async () => {
    try {
      setStatus("loading");
      const sessionId = uuidv4();
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create session");
      }

      const data = await res.json();
      setStatus("success");
      setTimeout(() => {
        router.push(`/session/${data.sessionId}`);
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
        }, 2000);
      }, 5000);
    }
  };

  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100 && status === "loading") {
        return;
      } else if (progress < 100 && status === "success") {
        setProgress(100);
        setBuffer(100);
      } else setProgress(progress + 1);
      if (buffer < 100 && progress % 5 === 0) {
        const newBuffer = buffer + 1 + Math.random() * 10;
        setBuffer(newBuffer > 100 ? 100 : newBuffer);
      }
    };
  });

  useEffect(() => {
    if (status !== "loading") {
      setProgress(0);
      setBuffer(10);
    }
    if (status === "loading") {
      const timer = setInterval(() => {
        progressRef.current();
      }, 100);
      return () => {
        clearInterval(timer);
      };
    }
  }, [status]);

  return (
    <div className="bg-radial from-black-400 to-gray-900 font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex items-center justify-between w-full max-w-3xl" />
      <main className="w-full h-full flex flex-col justify-center items-center rounded-lg shadow-lg p-8 sm:p-12 gap-6">
        <motion.div
          className="flex flex-col items-center justify-center w-full h-full bg-radial from-black-400 to-gray-900 backdrop-blur-md preserve-3d bg-white/3 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            perspective: 1000, // Required for 3D effect
          }}
        >
          <motion.h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left tracking-tight mb-10 ">
            <motion.div
              className="font-typewriter mb-2 text-3xl sm:text-4xl text-center"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Buggy
            </motion.div>
            <motion.div
              className="font-typewriter text-2xl sm:text-3xl"
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Split your bills easy
            </motion.div>
          </motion.h1>
          <motion.div
            className="rounded-full transition-colors flex flex-col items-center justify-center gap-2 font-medium text-sm sm:text-base h-12 sm:h-14 sm:w-auto dark:hover:bg-white dark:hover:border-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotate: 360,
              borderColor:
                status === "success"
                  ? "#29d869ff"
                  : status === "error"
                  ? "#ff0000ff"
                  : "inherit",
              transition: { duration: 0.4 },
            }}
            transition={{ type: "spring", restDelta: 0.5 }}
          >
            <EyeCatchingButton
              className="flex flex-col items-center justify-center w-full h-full px-4"
              onClick={handleUploadReceipt}
            >
              <motion.div className="flex h-12 w-full items-center justify-center gap-2">
                <Image
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                {status === "loading" && <TypingEffect text="Uploading..." />}
                {status === "idle" && <TypingEffect text="Upload Receipt" />}
                {status === "success" && <TypingEffect text="Success!" />}
                {status === "error" && <TypingEffect text="Error!" />}
              </motion.div>
              <motion.div
                className="w-full h-full"
                animate={{
                  display: status === "loading" ? "block" : "none",
                  transition: { duration: 0.4 },
                }}
              >
                <LinearProgress
                  variant="buffer"
                  value={progress}
                  valueBuffer={buffer}
                />
              </motion.div>
            </EyeCatchingButton>
            <UploadReceiptDialog
              open={openUploadDialog}
              onClose={handleCloseUploadDialog}
            />
          </motion.div>
        </motion.div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center" />
    </div>
  );
}
