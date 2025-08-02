import Image from "next/image";

export default function Home() {
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
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Upload Receipt
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center" />
    </div>
  );
}
