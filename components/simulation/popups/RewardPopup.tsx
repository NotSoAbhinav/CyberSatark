"use client";

import { motion } from "framer-motion";

import {
  X,
  Trophy,
  Sparkles,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function RewardPopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 25,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: 25,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >

      <div
        className="
          w-[420px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-green-500/20
          bg-[#07111d]
          shadow-2xl
          shadow-green-500/10
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-500/10 bg-black/30">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">

              <Trophy
                size={20}
                className="text-green-400"
              />
            </div>

            <div>
              <p className="text-white font-semibold text-sm">
                CyberSatark Rewards
              </p>

              {!revealed && (
                <p className="text-green-400 text-[11px]">
                  Limited reward available
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {!revealed ? (
            <>
              {/* REWARD CARD */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-cyan-500/10 border border-green-500/20 rounded-3xl p-6">

                <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 blur-3xl rounded-full"></div>

                <div className="relative">

                  <div className="flex items-center gap-2 text-green-400 mb-4">

                    <Sparkles size={18} />

                    <span className="text-sm font-medium">
                      Exclusive Access
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-white leading-tight mb-4">

                    {popup.title}
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm">
                    {popup.message}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">

                    Offer expires soon
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">

                <button
                  onClick={onAction}
                  className="
                    flex-1
                    py-3
                    rounded-2xl
                    bg-green-500
                    text-black
                    font-semibold
                    hover:bg-green-400
                    transition
                  "
                >
                  {popup.actionText}
                </button>

                <button
                  onClick={onClose}
                  className="
                    px-4
                    rounded-2xl
                    border
                    border-green-500/20
                    text-gray-300
                    hover:bg-green-500/10
                    transition
                  "
                >
                  Later
                </button>
              </div>
            </>
          ) : (
            <>
              {/* REVEAL */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5">

                <h2 className="text-red-400 text-2xl font-bold mb-3">

                  ⚠ Reward Scam Detected
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {popup.revealMessage}
                </p>

                <div className="mt-5 space-y-2">

                  {popup.tactics.map(
                    (
                      tactic: string,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="
                          text-sm
                          px-3
                          py-2
                          rounded-xl
                          bg-red-500/10
                          border
                          border-red-500/10
                          text-red-300
                        "
                      >
                        • {tactic}
                      </div>
                    )
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="
                    w-full
                    mt-5
                    py-3
                    rounded-2xl
                    bg-green-500
                    text-black
                    font-semibold
                    hover:bg-green-400
                    transition
                  "
                >
                  Stay Secure
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}