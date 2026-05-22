import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("#audit-planner");

  const navLinks = [
    { label: "Sourcing Audit", id: "#audit-planner" },
    { label: "Why Sourcing Fails", id: "#problem" },
    { label: "Services", id: "#services" },
    { label: "Our Model", id: "#compare" },
    { label: "Pricing", id: "#pricing" },
    { label: "About", id: "#about" },
    { label: "FAQ", id: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleScrollActive = () => {
      const scrollPos = window.scrollY + 220; // offset for nav height & alignment
      for (const link of navLinks) {
        const el = document.querySelector(link.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const bottom = top + el.getBoundingClientRect().height;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveHash(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScrollActive);
    
    // Run initial checks
    handleScroll();
    handleScrollActive();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollActive);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md py-3 shadow-lg shadow-ink/5 border-ink/10"
          : "bg-cream/40 backdrop-blur-sm py-4 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center text-cream font-serif text-lg font-bold group-hover:bg-gold transition-colors duration-300">
            XA
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-ink">
            XinAo<span className="text-gold">.</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <a
                  href={link.id}
                  className={`relative font-mono text-xs uppercase tracking-wider transition-colors duration-200 pb-1 ${
                    activeHash === link.id
                      ? "text-ink font-semibold"
                      : "text-ink-faint hover:text-ink"
                  }`}
                >
                  {link.label}
                  {activeHash === link.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
          
          <a
            href="#contact"
            className="inline-flex items-center gap-1 bg-ink text-cream hover:bg-gold hover:text-ink font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Book Sourcing Audit
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Mobile Hamburger block */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="p-1 rounded-sm text-ink hover:text-gold hover:bg-cream-dark transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel with Framer Motion expandable transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 right-0 bg-cream border-b border-ink/10 shadow-xl overflow-hidden z-50"
          >
            <div className="p-6 space-y-6">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.id}
                      onClick={() => setIsOpen(false)}
                      className={`font-mono text-xs uppercase tracking-wider block py-1.5 transition-colors ${
                        activeHash === link.id
                          ? "text-gold font-bold pl-2 border-l-2 border-gold"
                          : "text-ink hover:text-gold"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="h-[1px] bg-ink/10 my-2"></div>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-ink text-cream hover:bg-gold hover:text-ink font-mono text-xs uppercase tracking-widest py-3 rounded-sm transition-all duration-300 inline-block font-semibold"
              >
                Get Free Sourcing Audit
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
