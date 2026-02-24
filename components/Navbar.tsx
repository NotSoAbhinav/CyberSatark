"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  return (
    <div className="w-full pt-6 px-6">
      <div className="flex justify-end">
        <nav
          className="flex items-center gap-8 px-8 py-3 rounded-full 
                     bg-[#07142a]/80 backdrop-blur-md 
                     border border-[#12345c]
                     shadow-lg shadow-black/30
                     hover:shadow-green-400/10
                     transition duration-300"
        >
          {/* SOLUTIONS */}
          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button className="hover:text-green-400 transition flex items-center gap-1">
              Solutions
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                ▾
              </motion.span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-11 left-0 bg-[#0b1f3a] 
                             border border-[#12345c] rounded-xl 
                             shadow-lg w-56 overflow-hidden"
                >
                  {[
                    { name: "URL Checker", href: "/tools/url-checker" },
                    { name: "Phishing Analysis", href: "/tools/phishing-analysis" },
                    { name: "Email Checker", href: "/tools/email-checker" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 
                                 hover:bg-[#102a4d]
                                 hover:text-green-300
                                 transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ABOUT */}
          <Link
            href="/about"
            className="hover:text-green-400 transition relative group"
          >
            Learn
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* AUTH */}
          <Link
            href="/auth"
            className="px-4 py-1.5 rounded-full 
                       bg-green-500 text-black font-semibold
                       hover:bg-green-400
                       hover:shadow-green-400/40 hover:shadow-lg
                       transition duration-300"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </div>
  );
}