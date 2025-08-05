"use client";
import { useParams } from "next/navigation";

export default function SplitPage() {
  const { slug } = useParams();

  if (!slug) {
    return <div>Error: Session ID is missing</div>;
  }

  return (
    <div>
      <h1>Session: {slug}</h1>
      <p>This is the split page for session {slug}.</p>
      {/* Additional content can be added here */}
    </div>
  );
}
