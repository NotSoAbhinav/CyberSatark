"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  ShieldAlert,
  Bell,
  MessageCircle,
  Gift,
  TriangleAlert,
} from "lucide-react";

import { PhishingPopup } from "./popupData";

interface Props {
  popup: PhishingPopup | null;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function SimulationPopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  if (!popup) return null;

  const renderIcon = () => {
    switch (popup.type) {
      case "notification":
        return (
          <Bell
            size={20}
            className="text-green-400"
          />
        );

      case "floating-chat":
        return (
          <MessageCircle
            size={20}
            className="text-green-400"
          />
        );

      case "modal":
        return (
          <Gift
            size={20}
            className="text-green-400"
          />
        );

      default:
        return (
          <ShieldAlert
            size={20}
            className="text-green-400"
          />
        );
    }
  };

  const getPositionClasses = () => {
    switch (popup.type) {
      case "toast":
        return "fixed bottom-6 right-6";

      case "notification":
        return "fixed top-6 right-6";

      case "floating-chat":
        return "fixed bottom-6 left-6";

      case "top-banner":
        return "fixed top-5 left-1/2 -translate-x-1/2";

      case "bottom-alert":
        return "fixed bottom-5 left-1/2 -translate-x-1/2";

      default:
        return "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm";
    }
  };

  return (
    <AnimatePresence>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        transition={{
          duration: 0.25,
        }}
        className={`${getPositionClasses()} z-[9999]`}
      >

        <div
          className="
            relative
            w-[360px]
            max-w-[92vw]
            rounded-3xl
            border
            border-green-500/20
            bg-[#07111d]/95
            backdrop-blur-2xl
            shadow-2xl
            shadow-green-500/10
            overflow-hidden
          "
        >

          {/* TOP BAR */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/10 bg-black/30">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">

                {renderIcon()}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {revealed
                    ? "CyberSatark Awareness"
                    : popup.source ||
                      "Notification"}
                </p>

                <p className="text-[11px] text-gray-500">
                  Security Simulation
                </p>
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
                <h2 className="text-lg font-semibold text-white mb-3">
                  {popup.title}
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {popup.message}
                </p>

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
                    {popup.cancelText ||
                      "Close"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">

                    <TriangleAlert
                      size={22}
                      className="text-red-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-red-400">
                      You Got Phished!
                    </h2>

                    <p className="text-xs text-gray-500">
                      Awareness Simulation
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-5">
                  {popup.revealMessage}
                </p>

                <div className="space-y-2 mb-5">

                  {popup.tactics.map(
                    (tactic, index) => (
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
                    py-3
                    rounded-2xl
                    bg-green-500
                    text-black
                    font-semibold
                    hover:bg-green-400
                    transition
                  "
                >
                  Stay Alert
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}