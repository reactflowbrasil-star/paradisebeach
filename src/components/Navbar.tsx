import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/venda", label: "À Venda" },
  { to: "/aluguel", label: "Aluguel" },
  { to: "/sobre", label: "Sobre Nós" },
  { to: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? "bg-foreground/20 backdrop-blur-md" : "bg-card/95 backdrop-blur-md shadow-card"}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-serif text-2xl font-bold tracking-tight ${isHome ? "text-primary-foreground" : "text-primary"}`}>
            Paradise<span className="text-gradient-gold">Beach</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === l.to
                  ? isHome ? "text-primary-foreground border-b-2 border-gold pb-0.5" : "text-primary border-b-2 border-primary pb-0.5"
                  : isHome ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contato"
            className="bg-gradient-gold text-gold-foreground px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-gold hover:scale-105"
          >
            Fale Conosco
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 ${isHome ? "text-primary-foreground" : "text-foreground"}`}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card/98 backdrop-blur-lg border-t border-border"
          >
            <div className="container mx-auto py-6 px-4 flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-base font-medium py-2 transition-colors ${
                    location.pathname === l.to ? "text-primary" : "text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contato"
                onClick={() => setOpen(false)}
                className="bg-gradient-gold text-gold-foreground px-6 py-3 rounded-full text-center font-semibold mt-2"
              >
                Fale Conosco
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
