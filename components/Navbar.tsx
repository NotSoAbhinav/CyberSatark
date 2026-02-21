"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full pt-6 px-6">
      <div className="flex justify-end">
        <nav className="flex items-center gap-8 px-8 py-3 rounded-full 
                        bg-[#07142a]/80 backdrop-blur-md 
                        border border-[#12345c] 
                        shadow-lg shadow-black/30">

          {/* Solutions */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="hover:text-green-400 transition">
              Solutions ▾
            </button>

            {open && (
              <div className="absolute top-10 left-0 bg-[#0b1f3a] 
                              border border-[#12345c] rounded-xl 
                              shadow-lg w-56 overflow-hidden">
                <Link href="/tools/url" className="block px-4 py-3 hover:bg-[#102a4d]">
                  URL Checker
                </Link>
                <Link href="/tools/phishing" className="block px-4 py-3 hover:bg-[#102a4d]">
                  Phishing Analysis
                </Link>
                <Link href="/tools/email" className="block px-4 py-3 hover:bg-[#102a4d]">
                  Email Checker
                </Link>
              </div>
            )}
          </div>

          <Link href="/learn" className="hover:text-green-400 transition">
            Learn
          </Link>

          <Link href="/about" className="hover:text-green-400 transition">
            About
          </Link>
        </nav>
      </div>
    </div>
  );
}