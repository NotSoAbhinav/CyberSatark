"use client";

import { motion } from "framer-motion";

import {
  X,
  CheckCheck,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function WhatsAppPopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: 40,
        scale: 0.95,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed bottom-5 right-5 z-[9999]"
    >

      <div
        className="
          w-[340px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-[#2A3942]
          bg-[#111B21]/95
          backdrop-blur-2xl
          shadow-2xl
          shadow-black/40
        "
      >

        {/* HEADER */}
        <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between border-b border-[#2A3942]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-sm">

              WA
            </div>

            <div>
              <p className="text-white text-sm font-semibold">
                WhatsApp
              </p>

              {!revealed && (
                <p className="text-[#25D366] text-[11px]">
                  1 new message
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4">

          {!revealed ? (
            <>
              {/* MESSAGE */}
              <div className="bg-[#202C33] rounded-2xl rounded-tl-md p-4 text-sm text-gray-200 leading-relaxed relative">

                {popup.message}

                <div className="flex items-center justify-end gap-1 mt-2 text-[#25D366] text-[11px]">

                  <span>12:42 PM</span>

                  <CheckCheck size={14} />
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
                    bg-[#25D366]
                    text-black
                    font-semibold
                    hover:bg-[#1ebe5d]
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
                    border-[#2A3942]
                    text-gray-300
                    hover:bg-[#202C33]
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
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">

                <h2 className="text-red-400 font-bold text-lg mb-2">

                  ⚠ You Got Phished!
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {popup.revealMessage}
                </p>

                <div className="mt-4 space-y-2">

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
                    bg-[#25D366]
                    text-black
                    font-semibold
                    hover:bg-[#1ebe5d]
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