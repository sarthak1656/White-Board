"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    if (!isStandalone) {
      setIsOpen(true);
    }

    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent));

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error: unknown) => {
          console.error("Service worker registration failed:", error);
        });
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsOpen(false);
      setInstallPrompt(null);
    };

    const handleOpenInstall = () => {
      setShowInstructions(false);
      setIsOpen(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("whiteboard:open-install", handleOpenInstall);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("whiteboard:open-install", handleOpenInstall);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);

    if (choice.outcome === "accepted") {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="install-overlay">
      <section
        aria-labelledby="install-title"
        aria-modal="true"
        className="install-dialog"
        role="dialog"
      >
        <button
          aria-label="Close install prompt"
          className="install-close"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          ×
        </button>
        <div aria-hidden="true" className="install-mark">
          <span />
          <span />
          <span />
        </div>
        <p className="install-eyebrow">Your ideas, anywhere</p>
        <h2 id="install-title">Take your whiteboard with you</h2>
        <p className="install-description">
          Install White Board for quick access to your canvas, right from your
          home screen.
        </p>
        <button className="install-button" onClick={install} type="button">
          Install White Board
        </button>
        {showInstructions && (
          <p className="install-instructions" role="status">
            {isIos
              ? "To install, tap Share in your browser, then choose Add to Home Screen."
              : "To install, open your browser menu and choose Install app or Add to Home screen."}
          </p>
        )}
        <button
          className="install-dismiss"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          Not now
        </button>
      </section>
    </div>
  );
}
