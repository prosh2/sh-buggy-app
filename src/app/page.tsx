"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCreateSession = async () => {
    setSuccess(false);
    setLoading(true);
    const sessionId = uuidv4();
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!res.ok) {
      console.error("Failed to create session");
      return;
    }

    const data = await res.json();
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      router.push(`/session/${data.sessionId}`);
    }, 1000);
  };

  return (
    <div className="bg-radial from-black-400 to-gray-900 font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex justify-center items-center justify-between w-full max-w-3xl" />
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
          <motion.button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={handleCreateSession}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotate: 360,
              backgroundColor: success ? "#29d869ff" : "#fff", // green-500
              transition: { duration: 0.4 },
            }}
            transition={{ type: "spring", restDelta: 0.5 }}
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            {success ? "Success!" : loading ? "Uploading..." : "Upload Receipt"}
          </motion.button>
        </motion.div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center" />
    </div>
  );
}
