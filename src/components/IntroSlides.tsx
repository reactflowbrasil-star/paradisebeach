import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Hand, Sparkles, MapPinned } from "lucide-react";

const storageKey = "paradise_intro_seen_v1";

const slides = [
  {
    icon: Sparkles,
    title: "Bem-vindo à Paradise Beach",
    text: "Explore imóveis de alto padrão com uma experiência visual guiada.",
    hint: "Role para avançar",
  },
  {
    icon: Hand,
    title: "Deslize ou role",
    text: "No celular, deslize para cima/baixo. No desktop, use a roda do mouse para navegar pelos slides.",
    hint: "Continue navegando",
  },
  {
    icon: MapPinned,
    title: "Encontre seu paraíso",
    text: "Descubra oportunidades exclusivas por região, perfil e estilo de vida.",
    hint: "Toque em Entrar",
  },
];

export default function IntroSlides() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const lastWheel = useRef(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const seen = window.localStorage.getItem(storageKey);
    setIsOpen(!seen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel.current < 700) return;
      if (Math.abs(event.deltaY) < 10) return;

      event.preventDefault();
      lastWheel.current = now;
      setIndex((current) => {
        if (event.deltaY > 0) return Math.min(current + 1, slides.length - 1);
        return Math.max(current - 1, 0);
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.changedTouches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
      const diff = touchStartY.current - endY;
      if (Math.abs(diff) < 40) return;

      setIndex((current) => {
        if (diff > 0) return Math.min(current + 1, slides.length - 1);
        return Math.max(current - 1, 0);
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen]);

  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);

  const closeIntro = () => {
    window.localStorage.setItem(storageKey, "1");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-foreground text-primary-foreground"
        >
          <div className="absolute inset-0 mesh-overlay opacity-60" />

          <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-10 text-center">
            <img
              src="https://growmoneydigital.com.br/paradise/01.png"
              alt="Logomarca Paradise Beach"
              className="mb-8 h-24 w-24 rounded-full border border-white/30 object-cover shadow-luxury sm:h-28 sm:w-28"
            />

            <div className="mb-8 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.45 }}
                className="glass-card w-full max-w-2xl rounded-3xl p-8 sm:p-10"
              >
                {(() => {
                  const SlideIcon = slides[index].icon;
                  return <SlideIcon size={30} className="mx-auto mb-4 text-gold" />;
                })()}
                <h2 className="mb-4 text-3xl font-semibold sm:text-4xl">{slides[index].title}</h2>
                <p className="mx-auto mb-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg">{slides[index].text}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">{slides[index].hint}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-3">
              {slides.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setIndex(dotIndex)}
                  className={`h-2.5 rounded-full transition-all ${index === dotIndex ? "w-8 bg-gold" : "w-2.5 bg-white/35"}`}
                  aria-label={`Ir para slide ${dotIndex + 1}`}
                />
              ))}
            </div>

            <button
              onClick={closeIntro}
              className="button-pop mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3 font-semibold text-gold-foreground"
            >
              Entrar no site <ChevronDown size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
