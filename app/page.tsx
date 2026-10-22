"use client";

import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(
  () => import("./components/ExcalidrawWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        Loading Whiteboard...
      </div>
    ),
  },
);

export default function WhiteboardPage() {
  return (
    <main className="whiteboard-app">
      <header className="app-navbar">
        <a aria-label="White Board home" className="app-brand" href="/">
          <span aria-hidden="true" className="app-brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span className="app-brand-name">White Board</span>
        </a>
        <nav aria-label="Main navigation" className="app-nav-links">
          <a aria-current="page" href="#canvas">
            Canvas
          </a>
        </nav>
        <a
          className="navbar-install-button"
          href="https://sarthakpanigrahi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          About Developer
        </a>
      </header>
      <section
        aria-label="Whiteboard canvas"
        className="canvas-region"
        id="canvas"
      >
        <ExcalidrawWrapper />
      </section>
    </main>
  );
}
