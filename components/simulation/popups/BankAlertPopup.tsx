"use client";

import { motion } from "framer-motion";

import {
  X,
  Landmark,
  TriangleAlert,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function BankAlertPopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.92,
        y: 20,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >

      <div
        className="
          w-[400px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-yellow-500/20
          bg-[#111827]
          shadow-2xl
          shadow-yellow-500/10
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yellow-500/10 bg-[#0B1220]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">

              <Landmark
                size={20}
                className="text-yellow-400"
              />
            </div>

            <div>
              <p className="text-white font-semibold text-sm">
                Secure Banking
              </p>

              {!revealed && (
                <p className="text-yellow-400 text-[11px]">
                  Security verification required
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
        <div className="p-5">

          {!revealed ? (
            <>
              {/* ALERT BOX */}
              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-5">

                <TriangleAlert
                  size={20}
                  className="text-yellow-400 mt-0.5"
                />

                <div>
                  <h2 className="text-white font-semibold text-lg">
                    {popup.title}
                  </h2>

                  <p className="text-sm text-gray-300 leading-relaxed mt-2">
                    {popup.message}
                  </p>
                </div>
              </div>

              {/* TRANSACTION */}
              <div className="bg-[#0B1220] rounded-2xl border border-yellow-500/10 p-4">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-gray-400">
                    Attempted Transaction
                  </span>

                  <span className="text-red-400 font-semibold">
                    ₹49,999
                  </span>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Location: Unknown Device
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
                    bg-yellow-500
                    text-black
                    font-semibold
                    hover:bg-yellow-400
                    transition
                  "
                >
                  Verify Now
                </button>

                <button
                  onClick={onClose}
                  className="
                    px-4
                    rounded-2xl
                    border
                    border-yellow-500/20
                    text-gray-300
                    hover:bg-yellow-500/10
                    transition
                  "
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {/* REVEAL */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">

                <h2 className="text-red-400 text-xl font-bold mb-3">

                  ⚠ Banking Phishing Detected
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
                    bg-yellow-500
                    text-black
                    font-semibold
                    hover:bg-yellow-400
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