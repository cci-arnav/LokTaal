import { useCallback, useEffect, useRef, useState } from "react";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ManifestoTransition } from "@/components/sections/ManifestoTransition";
import { SoundJourney } from "@/components/sections/SoundJourney";
import { RegionalDiscovery } from "@/components/sections/RegionalDiscovery";
import { StateDirectory } from "@/components/sections/StateDirectory";
import { PreservationStory } from "@/components/sections/PreservationStory";
import { FeaturedVoices } from "@/components/sections/FeaturedVoices";
import { ArchiveCollection } from "@/components/sections/ArchiveCollection";
import { PreserveSongCTA } from "@/components/sections/PreserveSongCTA";
import { WaveformDivider } from "@/components/sections/WaveformDivider";
import { SoundToggle } from "@/components/audio/SoundToggle";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { AppLoader } from "@/components/AppLoader";
import { I18nProvider } from "@/contexts/I18nContext";
import { RouterProvider, useRouter, AppLink } from "@/contexts/RouterContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginPage, SignupPage } from "@/pages/AuthPages";
import { UploadPage } from "@/pages/UploadPage";
import { StatePage } from "@/pages/StatePage";
import { useOptionalSound } from "@/hooks/useOptionalSound";
import { LOADER_FAILSAFE_MS, loaderMayClose } from "@/lib/loader";
import "@/styles/themes.css";

function ThemeObserver() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-theme]"),
    );
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.32;
        const active =
          sections.find((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= marker && rect.bottom > marker;
          }) ?? sections[0];
        if (active?.dataset.theme)
          document.documentElement.setAttribute(
            "data-theme",
            active.dataset.theme,
          );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return null;
}

function Homepage() {
  const { soundEnabled, toggleSound, playTone } = useOptionalSound();
  const handleTone = useCallback(
    (index: number) => playTone(index),
    [playTone],
  );
  return (
    <main className="min-h-screen overflow-x-clip pb-[var(--player-space,0px)]">
      <ThemeObserver />
      <Hero />
      <ManifestoTransition />
      <SoundJourney />
      <WaveformDivider accent="#D88924" />
      <RegionalDiscovery soundEnabled={soundEnabled} onPlayTone={handleTone} />
      <StateDirectory />
      <WaveformDivider accent="#E59B32" />
      <PreservationStory />
      <FeaturedVoices />
      <ArchiveCollection />
      <PreserveSongCTA />
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    </main>
  );
}

function RouteView() {
  const { route } = useRouter();
  useEffect(() => {
    if (route.name !== "home")
      document.documentElement.setAttribute(
        "data-theme",
        route.name === "upload" ? "archive-paper" : "midnight-raga",
      );
  }, [route.name]);
  if (route.name === "home") return <Homepage />;
  if (route.name === "login") return <LoginPage />;
  if (route.name === "signup") return <SignupPage />;
  if (route.name === "upload") return <UploadPage />;
  if (route.name === "state") return <StatePage slug={route.slug} />;
  return (
    <main className="min-h-screen bg-[#25113f] px-6 pt-36 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-bold">Page not found</h1>
        <AppLink to="/" className="mt-6 inline-flex text-[#F0B23D]">
          Back to LokTaal
        </AppLink>
      </div>
    </main>
  );
}

function AppFrame() {
  const [loading, setLoading] = useState(true);
  const startedAt = useRef(Date.now());
  useEffect(() => {
    let ready = false;
    let stopped = false;
    const check = () => {
      if (!stopped && loaderMayClose(startedAt.current, Date.now(), ready))
        setLoading(false);
      
    };
    document.fonts.ready.then(() => {
      ready = true;
      check();
    });
    const timer = window.setInterval(check, 50);
    const failsafe = window.setTimeout(
      () => setLoading(false),
      LOADER_FAILSAFE_MS,
    );
    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.clearTimeout(failsafe);
    };
  }, []);
  return (
    <>
      <Navbar />
      <RouteView />
      <MiniPlayer />
      {loading && <AppLoader />}
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider>
        <AuthProvider>
          <AudioProvider>
            <AppFrame />
          </AudioProvider>
        </AuthProvider>
      </RouterProvider>
    </I18nProvider>
  );
}
