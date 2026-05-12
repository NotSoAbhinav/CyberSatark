"use client";

import { motion } from "framer-motion";

import {
  X,
  Crown,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function NetflixPopup({
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
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: 20,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >

      <div
        className="
          w-[420px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-red-500/20
          bg-[#141414]
          shadow-2xl
          shadow-red-500/10
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-500/10 bg-black">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">

              <Crown
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-red-500 font-bold text-lg tracking-wide">
                NETFLIX
              </p>

              {!revealed && (
                <p className="text-[11px] text-gray-500">
                  Premium Membership
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
              <div className="bg-gradient-to-br from-red-600/20 to-black rounded-2xl p-5 border border-red-500/10">

                <h2 className="text-2xl font-bold text-white mb-3">

                  {popup.title}
                </h2>

                <p className="text-gray-300 leading-relaxed text-sm">
                  {popup.message}
                </p>

                <div className="mt-5 flex items-center gap-2 text-red-400 text-sm">

                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>

                  Offer expires in 4 minutes
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
                    bg-red-600
                    text-white
                    font-semibold
                    hover:bg-red-500
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
                    border-red-500/20
                    text-gray-300
                    hover:bg-red-500/10
                    transition
                  "
                >
                  Later
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">

                <h2 className="text-red-400 text-xl font-bold mb-3">

                  ⚠ Phishing Simulation
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
                    bg-red-600
                    text-white
                    font-semibold
                    hover:bg-red-500
                    transition
                  "
                >
                  I Understand
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}