import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Mechanism } from "./components/Mechanism";
import { Contract } from "./components/Contract";
import { Trust } from "./components/Trust";
import { Close } from "./components/Close";
import { LoginModal } from "./components/LoginModal";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <a
        href="#how"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-signal focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header onOpenLogin={openLogin} />
      <main>
        <Hero onOpenLogin={openLogin} />
        <Mechanism />
        <Contract />
        <Trust />
        <Close onOpenLogin={openLogin} />
      </main>
      <LoginModal open={loginOpen} onClose={closeLogin} />
    </div>
  );
}
