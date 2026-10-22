"use client";

import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(
  () => import("./components/ExcalidrawWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading Whiteboard...
      </div>
    ),
  },
);

export default function WhiteboardPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <ExcalidrawWrapper />
    </main>
  );
}
