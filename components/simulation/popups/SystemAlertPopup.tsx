"use client";

import { motion } from "framer-motion";

import {
  X,
  ShieldAlert,
  Cpu,
} from "lucide-react";

interface Props {
  popup: any;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function SystemAlertPopup({
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
        y: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        x: 40,
        y: 40,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed bottom-5 right-5 z-[9999]"
    >

      <div
        className="
          w-[360px]
          max-w-[92vw]
          rounded-3xl
          overflow-hidden
          border
          border-cyan-500/20
          bg-[#0B1120]/95
          backdrop-blur-2xl
          shadow-2xl
          shadow-cyan-500/10
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10 bg-[#111827]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

              <Cpu
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-white text-sm font-semibold">
                System Security
              </p>

              {!revealed && (
                <p className="text-cyan-400 text-[11px]">
                  Threat detected
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
              {/* ALERT CARD */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">

                <div className="flex items-start gap-3">

                  <ShieldAlert
                    size={20}
                    className="text-cyan-400 mt-0.5"
                  />

                  <div>
                    <h2 className="text-white text-lg font-semibold">
                      {popup.title}
                    </h2>

                    <p className="text-sm text-gray-300 leading-relaxed mt-2">
                      {popup.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* SCAN INFO */}
              <div className="mt-4 bg-[#111827] border border-cyan-500/10 rounded-2xl p-4">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-gray-400">
                    Threat Level
                  </span>

                  <span className="text-red-400 font-semibold">
                    HIGH
                  </span>
                </div>

                <div className="mt-3 w-full h-2 rounded-full bg-black overflow-hidden">

                  <div className="h-full w-[82%] bg-red-500 animate-pulse"></div>
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
                    bg-cyan-500
                    text-black
                    font-semibold
                    hover:bg-cyan-400
                    transition
                  "
                >
                  Run Scan
                </button>

                <button
                  onClick={onClose}
                  className="
                    px-4
                    rounded-2xl
                    border
                    border-cyan-500/20
                    text-gray-300
                    hover:bg-cyan-500/10
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

                  ⚠ Fake System Alert
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
                    bg-cyan-500
                    text-black
                    font-semibold
                    hover:bg-cyan-400
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