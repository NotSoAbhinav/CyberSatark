"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const [showPassword, setShowPassword] = useState(false);

  const result = analyzePassword(password);

  const getStrengthColor = () => {
    if (result.score >= 70) return "bg-green-400";
    if (result.score >= 40) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getStrengthTextColor = () => {
    if (result.score >= 70) return "text-green-400";
    if (result.score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-gray-200 p-8">
        {/* CYBER BACKGROUND */}
<div className="absolute inset-0 overflow-hidden">

  {/* GREEN GLOW */}
  <div
  className="
    absolute top-1/2 left-[-180px]
    -translate-y-1/2
    h-[420px] w-[420px]
    rounded-full
    bg-green-500/20
    blur-3xl
  "
/>

  {/* BLUE GLOW */}
  <div
    className="
      absolute bottom-[-150px] right-[-120px]
      h-[450px] w-[450px]
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />

  {/* GRID OVERLAY */}
  <div
    className="
      absolute inset-0
      opacity-[0.06]
      [background-image:linear-gradient(to_right,#00ff99_1px,transparent_1px),linear-gradient(to_bottom,#00ff99_1px,transparent_1px)]
      [background-size:40px_40px]
    "
  />

  {/* RADIAL FADE */}
  <div
    className="
      absolute inset-0
      bg-[radial-gradient(circle_at_center,transparent,rgba(2,6,23,0.95))]
    "
  />
</div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">

        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center space-y-10 text-center">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3">
            <ShieldAlert className="text-green-400" size={34} />
            <h1 className="text-4xl font-bold text-white">
              Password Strength Analyzer
            </h1>
          </div>

          <p className="text-gray-400 max-w-2xl text-center">
            Analyze password complexity, identify weak patterns,
            and improve credential security against brute-force
            and breach-based attacks.
          </p>
        </motion.div>
        </div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#07142a] border border-[#12345c] rounded-2xl p-8"
        >

          {/* INPUT */}
          <div className="space-y-4">
            <label className="text-sm text-green-300 font-medium">
              Enter Password
            </label>

            <div className="flex items-center bg-[#020617] border border-[#12345c] rounded-xl overflow-hidden">
              <div className="px-4 text-gray-400">
                <Lock size={18} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Type password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  flex-1 bg-transparent px-2 py-4
                  outline-none text-white
                  placeholder:text-gray-500
                "
              />

              <button
                onClick={() => setShowPassword(!showPassword)}
                className="
                  px-4 text-gray-400 hover:text-green-300
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

          {/* STRENGTH SECTION */}
          <div className="mt-8 space-y-4">

            <div className="flex justify-between items-center">
              <p className="text-gray-300 text-sm">
                Security Strength
              </p>

              <p className={`font-semibold ${getStrengthTextColor()}`}>
                {result.strength}
              </p>
            </div>

            <div className="h-4 bg-[#020617] rounded-full overflow-hidden border border-[#12345c]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.score}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${getStrengthColor()}`}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-400">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Score: {result.score}/100</span>

                <span>
                 {result.score >= 70
                   ? "Secure"
                   : result.score >= 40
                   ? "Moderate Risk"
                   : "High Risk"}
                </span>
              </div>

            {/* ENTROPY CARDS */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">

              <div
                className="
                bg-[#020617]
                border border-[#12345c]
                rounded-xl p-4
                "
               >
                <p className="text-gray-400 text-sm">
                 Estimated Entropy
                </p>

                <p className="text-2xl font-bold text-cyan-300 mt-2">
                {result.entropy} bits
                </p>
              </div>

              <div
                className="
                bg-[#020617]
                border border-[#12345c]
                rounded-xl p-4
                "
              >

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
            
              <span>Score: {result.score}/100</span>
              <span>
                {result.score >= 70
                  ? "Secure"
                  : result.score >= 40
                  ? "Moderate Risk"
                  : "High Risk"}
              </span>
            </div>
          </div>

          {/* FINDINGS */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-green-300 mb-5">
              Security Findings
            </h2>

            {password.length === 0 ? (
              <div className="text-gray-500 text-sm">
                Enter a password to begin analysis.
              </div>
            ) : result.findings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="
                  bg-green-400/10 border border-green-400/20
                  rounded-xl p-4 text-green-300
                "
              >
                ✔ No major weaknesses detected.
              </motion.div>
            ) : (
              <div className="space-y-4">
                {result.findings.map((finding, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="
                      flex items-start gap-3
                      bg-red-400/10
                      border border-red-400/20
                      rounded-xl p-4
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
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}