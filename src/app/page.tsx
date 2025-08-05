"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateSession = async () => {
    const sessionId = uuidv4();

    const res = await fetch("/api/create-session", {
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
    router.push(`/session/${data.sessionId}`);
  };

  return (
    <div className="bg-[url('/images/buggy-bg.jpg')] bg-no-repeat bg-center bg-cover lg:bg-[#22296f] lg:bg-contain font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex justify-center items-center justify-between w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[red] to-[purple]">
            by Prosh2
          </span>
        </h1>
      </header>
      <main className="h-full flex flex-col justify-end mb-20 ">
        <div>
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={handleCreateSession}
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            {loading ? "Uploading..." : "Upload Receipt"}
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center" />
    </div>
  );
}
