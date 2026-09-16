"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Editor } from "@tldraw/tldraw";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const TldrawCanvas = dynamic(
  async () => {
    const { Tldraw } = await import("@tldraw/tldraw");
    return function CanvasWrapper({
      onMount,
    }: {
      onMount: (editor: Editor) => void;
    }) {
      return (
        <div className="w-full h-full relative">
          <Tldraw
            licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
            onMount={onMount}
          />
        </div>
      );
    };
  },
  { ssr: false },
);

export default function WorkspacePage() {
  const [, setEditorInstance] = useState<Editor | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsMounted(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => setInstallPrompt(null);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setInstallPrompt(null);
    }
  };

  if (!isMounted) {
    return (
      <main className="workspace-shell workspace-loading">
        <div className="workspace-loading__dot" />
        <span>Loading canvas</span>
      </main>
    );
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div className="workspace-brand">
          <span className="workspace-brand__mark" aria-hidden="true" />
          <div>
            <span className="workspace-brand__title">White Board</span>
            <span className="workspace-brand__subtitle">Canvas workspace</span>
          </div>
        </div>
        <span className="workspace-status">
          <span className="workspace-status__dot" aria-hidden="true" />
          Ready
        </span>
      </header>

      <div className="workspace-canvas">
        <TldrawCanvas onMount={(inst) => setEditorInstance(inst)} />
      </div>

      {installPrompt && (
        <aside className="install-prompt" aria-live="polite">
          <div className="install-prompt__icon" aria-hidden="true">
            <span />
          </div>
          <div className="install-prompt__content">
            <strong>Take White Board with you</strong>
            <p>Install this canvas on your device for quicker access.</p>
          </div>
          <div className="install-prompt__actions">
            <button
              className="install-prompt__dismiss"
              type="button"
              onClick={() => setInstallPrompt(null)}
            >
              Later
            </button>
            <button
              className="install-prompt__install"
              type="button"
              onClick={installApp}
            >
              Install now
            </button>
          </div>
        </aside>
      )}
    </main>
  );
}