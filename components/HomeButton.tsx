"use client";
import Link from "next/link";
import { Home } from "lucide-react";

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="fixed top-6 left-1/2 -translate-x-1/2
                 flex items-center justify-center
                 w-11 h-11 rounded-full
                 bg-[#07142a]/80 backdrop-blur-md
                 border border-[#12345c]
                 shadow-lg shadow-black/30
                 text-green-400 hover:text-green-300
                 z-50"
    >
      <Home size={22} />
    </Link>
  );
}