import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Hand, Sparkles, MapPinned } from "lucide-react";
import logoImg from "@/assets/logo-paradise.png";

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
          className="fixed inset-0 z-[70] bg-foreground text-primary-foreground overflow-hidden"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 mesh-overlay opacity-40" />
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gold/10"
                style={{
                  width: 100 + i * 60,
                  height: 100 + i * 60,
                  left: `${15 + i * 18}%`,
                  top: `${10 + i * 15}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.15, 0.3, 0.15],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-10 text-center">
            {/* Logo with entrance animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 relative"
            >
              <motion.div
                animate={{ boxShadow: ["0 0 30px hsla(38,70%,55%,0.0)", "0 0 60px hsla(38,70%,55%,0.3)", "0 0 30px hsla(38,70%,55%,0.0)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full"
              >
                <img
                  src={logoImg}
                  alt="Logomarca Paradise Beach"
                  className="h-32 w-32 rounded-full border-2 border-gold/30 object-cover shadow-luxury sm:h-40 sm:w-40 bg-white/95 p-2"
                />
              </motion.div>

              {/* Rotating ring around logo */}
              <motion.div
                className="absolute inset-[-8px] rounded-full border border-gold/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[-16px] rounded-full border border-dashed border-gold/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-8 text-xs font-semibold uppercase tracking-[0.35em] text-gold"
            >
              Imóveis de Alto Padrão
            </motion.p>

            {/* Progress bar */}
            <div className="mb-8 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-gold"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 0.97 }}
                transition={{ duration: 0.45 }}
                className="glass-card w-full max-w-2xl rounded-3xl p-8 sm:p-10"
              >
                {(() => {
                  const SlideIcon = slides[index].icon;
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <SlideIcon size={30} className="mx-auto mb-4 text-gold" />
                    </motion.div>
                  );
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

            <motion.button
              onClick={closeIntro}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-pop mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3 font-semibold text-gold-foreground"
            >
              Entrar no site <ChevronDown size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
