"use client";

import { motion } from "framer-motion";

import {
  X,
  Heart,
  MessageCircle,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function InstagramPopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
        y: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        x: 40,
        y: -20,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed top-5 right-5 z-[9999]"
    >

      <div
        className="
          w-[340px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-pink-500/20
          bg-[#121212]/95
          backdrop-blur-2xl
          shadow-2xl
          shadow-pink-500/10
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-pink-500/10 bg-black/40">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]">

              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">

                IG
              </div>
            </div>

            <div>
              <p className="text-white text-sm font-semibold">
                Instagram
              </p>

              {!revealed && (
                <p className="text-pink-400 text-[11px]">
                  New direct message
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
        <div className="p-4">

          {!revealed ? (
            <>
              {/* MESSAGE CARD */}
              <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-pink-500/10">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]">

                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">

                      U
                    </div>
                  </div>

                  <div>
                    <p className="text-white text-sm font-semibold">
                      unknown_user247
                    </p>

                    <p className="text-gray-500 text-[11px]">
                      sent you a message
                    </p>
                  </div>
                </div>

                <h2 className="text-white font-semibold text-lg mb-2">
                  {popup.title}
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {popup.message}
                </p>

                <div className="flex items-center gap-5 mt-5 text-gray-400">

                  <Heart size={18} />

                  <MessageCircle size={18} />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-5">

                <button
                  onClick={onAction}
                  className="
                    flex-1
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-pink-500
                    via-red-500
                    to-yellow-500
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                  "
                >
                  Open Message
                </button>

                <button
                  onClick={onClose}
                  className="
                    px-4
                    rounded-2xl
                    border
                    border-pink-500/20
                    text-gray-300
                    hover:bg-pink-500/10
                    transition
                  "
                >
                  Ignore
                </button>
              </div>
            </>
          ) : (
            <>
              {/* REVEAL */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">

                <h2 className="text-red-400 text-xl font-bold mb-3">

                  ⚠ Fake DM Detected
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
                    bg-gradient-to-r
                    from-pink-500
                    via-red-500
                    to-yellow-500
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                  "
                >
                  Stay Alert
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}