"use client";

import { useSession } from "@/app/context/session-context";

export default function SplitPage() {
  const sessionContext = useSession();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Split Session</h1>
      <p className="text-lg mb-2">Session ID: {sessionContext.session.id}</p>
      <p className="text-lg mb-2">Users: {sessionContext.session.users.join(", ")}</p>
      <p className="text-lg mb-2">Items: {sessionContext.session.items.join(", ")}</p>
      <p className="text-2xl bg-white">This is the split page for session</p>
      {/* Additional content can be added here */}
    </div>
  );
}
