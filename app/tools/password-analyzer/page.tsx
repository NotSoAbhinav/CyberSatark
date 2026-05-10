"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";

import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  TriangleAlert,
} from "lucide-react";

import { analyzePassword } from "@/data/analyzer/passwordAnalyzer";

export default function PasswordAnalyzerPage() {
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const result = analyzePassword(password);

  const getStrengthColor = () => {
    if (result.score >= 70)
      return "bg-green-400";

    if (result.score >= 40)
      return "bg-yellow-400";

    return "bg-red-400";
  };

  const getStrengthTextColor = () => {
    if (result.score >= 70)
      return "text-green-400";

    if (result.score >= 40)
      return "text-yellow-400";

    return "text-red-400";
  };

  return (
  <>
    <Navbar />
    <CyberBackground />

    <main className="min-h-screen px-6 py-32 text-white">
      <div className="max-w-4xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >

          <h1 className="text-4xl md:text-5xl font-bold text-green-400">

            <motion.span
              animate={{
                textShadow: [
                  "0 0 6px rgba(34,197,94,0.4)",
                  "0 0 18px rgba(34,197,94,1)",
                  "0 0 6px rgba(34,197,94,0.4)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            >
              Password Strength Analyzer
            </motion.span>
          </h1>

          <p className="mt-5 text-gray-400 max-w-xl mx-auto text-base">
            Analyze password complexity,
            detect weak patterns, and improve
            credential security against
            brute-force and breach-based
            attacks.
          </p>
        </motion.div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-green-500/10"
        >

          {/* TOP BAR */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-green-500/10 bg-black/40">

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>

              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>

              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>

            <p className="text-[11px] uppercase tracking-[0.3em] text-green-400 font-semibold">
              Password Security Terminal
            </p>

          </div>

          {/* CONTENT */}
          <div className="p-5">

            {/* INPUT */}
            <div className="space-y-4">

              <label className="text-sm text-green-300 font-medium">
                Enter Password
              </label>

              <div className="flex items-center bg-[#050b12] border border-green-500/10 rounded-2xl overflow-hidden">

                <div className="px-4 text-gray-400">
                  <Lock size={18} />
                </div>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Type password..."
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="
                    flex-1 bg-transparent px-2 py-5
                    outline-none text-white
                    placeholder:text-gray-600
                  "
                />

                <button
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    px-4 text-gray-400
                    hover:text-green-300
                    transition
                  "
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* STRENGTH */}
            <div className="mt-8">

              <div className="flex justify-between items-center mb-3">

                <p className="text-sm text-gray-300">
                  Security Strength
                </p>

                <p
                  className={`font-semibold ${getStrengthTextColor()}`}
                >
                  {result.strength}
                </p>
              </div>

              <div className="h-4 bg-[#050b12] rounded-full overflow-hidden border border-green-500/10">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.score}%`,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className={`h-full ${getStrengthColor()}`}
                />
              </div>

              <div className="mt-3 flex justify-between text-sm text-gray-400">

                <span>
                  Score: {result.score}/100
                </span>

                <span>
                  {result.score >= 70
                    ? "Secure"
                    : result.score >= 40
                    ? "Moderate Risk"
                    : "High Risk"}
                </span>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-6 grid md:grid-cols-2 gap-3">

              <div className="bg-[#050b12] border border-green-500/10 rounded-2xl p-5">

                <p className="text-gray-400 text-sm">
                  Estimated Entropy
                </p>

                <p className="text-2xl font-bold text-cyan-300 mt-2">
                  {result.entropy} bits
                </p>
              </div>

              <div className="bg-[#050b12] border border-green-500/10 rounded-2xl p-5">

                <p className="text-gray-400 text-sm">
                  Crack Resistance
                </p>

                <p className="text-2xl font-bold text-green-400 mt-2">

                  {result.entropy >= 80
                    ? "Excellent"
                    : result.entropy >= 60
                    ? "Strong"
                    : result.entropy >= 40
                    ? "Moderate"
                    : "Weak"}
                </p>
              </div>
            </div>

            {/* FINDINGS */}
            <div className="mt-10">

              <h2 className="text-xl font-semibold text-green-300 mb-5">
                Security Findings
              </h2>

              {password.length === 0 ? (
                <div className="text-gray-500 text-sm">
                  Enter a password to begin
                  analysis.
                </div>
              ) : result.findings.length ===
                0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    bg-green-400/10
                    border border-green-400/20
                    rounded-2xl
                    p-4 text-green-300
                  "
                >
                  ✔ No major weaknesses
                  detected.
                </motion.div>
              ) : (
                <div className="space-y-4">

                  {result.findings.map(
                    (finding, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.05,
                        }}
                        className="
                          flex items-start gap-3
                          bg-red-400/10
                          border border-red-400/20
                          rounded-2xl p-4
                        "
                      >

                        <TriangleAlert
                          size={18}
                          className="text-red-400 mt-0.5"
                        />

                        <p className="text-sm text-red-300">
                          {finding}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  </>
);
}