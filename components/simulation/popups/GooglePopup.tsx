"use client";

import { motion } from "framer-motion";

import {
  X,
  ShieldAlert,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function GooglePopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -30,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -30,
        scale: 0.95,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed top-5 right-5 z-[9999]"
    >

      <div
        className="
          w-[380px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-blue-500/20
          bg-white
          shadow-2xl
          shadow-blue-500/10
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">

              <ShieldAlert
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-black font-semibold text-sm">
                Google Security
              </p>

              {!revealed && (
                <p className="text-blue-500 text-[11px]">
                  Suspicious login detected
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5">

          {!revealed ? (
            <>
              <h2 className="text-xl font-semibold text-black mb-3">

                {popup.title}
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed">
                {popup.message}
              </p>

              <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4">

                <p className="text-sm text-blue-700 leading-relaxed">
                  We detected unusual activity
                  from a new device. Verify your
                  identity immediately to secure
                  your account.
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">

                <button
                  onClick={onAction}
                  className="
                    flex-1
                    py-3
                    rounded-2xl
                    bg-blue-500
                    text-white
                    font-semibold
                    hover:bg-blue-600
                    transition
                  "
                >
                  Verify Account
                </button>

                <button
                  onClick={onClose}
                  className="
                    px-4
                    rounded-2xl
                    border
                    border-gray-300
                    text-gray-700
                    hover:bg-gray-100
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
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

                <h2 className="text-red-500 text-xl font-bold mb-3">

                  ⚠ Fake Security Alert
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
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
                          bg-red-100
                          border
                          border-red-200
                          text-red-600
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
                    bg-blue-500
                    text-white
                    font-semibold
                    hover:bg-blue-600
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