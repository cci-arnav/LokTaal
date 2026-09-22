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
import { AudioProvider, useAudio } from "@/components/audio/AudioProvider";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { AppLoader } from "@/components/AppLoader";
import { I18nProvider, useI18n } from "@/contexts/I18nContext";
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
  const { close } = useAudio();
  useEffect(() => () => close(), [close]);
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

function NotFoundPage() {
  const { t } = useI18n();
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#32145a] px-6 pb-20 pt-32 text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(192,132,252,.28),transparent_32%),linear-gradient(135deg,#32145a,#4c1d95_55%,#24112f)]" />
      <div className="relative mx-auto w-full max-w-3xl rounded-[2rem] border border-white/15 bg-white/[0.07] p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-[#F0B23D]">404 · LokTaal</p>
        <h1 className="mt-5 font-devanagari text-4xl font-bold sm:text-6xl">{t('notFound.title')}</h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-white/70">{t('notFound.body')}</p>
        <AppLink to="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#F0B23D] px-7 font-bold text-[#25113f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">{t('notFound.home')}</AppLink>
      </div>
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
  return <NotFoundPage />;
}

function AppFrame() {
  const [loading, setLoading] = useState(true);
  const startedAt = useRef(Date.now());
  useEffect(() => {
    let ready = false;
    let stopped = false;
    let timer = 0;
    let failsafe = 0;
    const closeLoader = () => {
      if (stopped) return;
      stopped = true;
      window.clearInterval(timer);
      window.clearTimeout(failsafe);
      setLoading(false);
    };
    const check = () => {
      if (!stopped && loaderMayClose(startedAt.current, Date.now(), ready))
        closeLoader();
    };
    document.fonts.ready.then(() => {
      ready = true;
      check();
    });
    timer = window.setInterval(check, 50);
    failsafe = window.setTimeout(closeLoader, LOADER_FAILSAFE_MS);
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
