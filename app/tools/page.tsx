"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  MailWarning,
  Link2,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    title: "URL Threat Scanner",
    description:
      "Analyze suspicious URLs using phishing detection, domain intelligence, and threat analysis.",
    href: "/tools/url-checker",
    icon: Link2,
    status: "Active",
  },

  {
    title: "Email Risk Analyzer",
    description:
      "Inspect email headers for spoofing attempts, SPF/DKIM failures, and phishing indicators.",
    href: "/tools/email-checker",
    icon: MailWarning,
    status: "Active",
  },

  {
    title: "Phishing Analyzer",
    description:
      "Detect phishing attempts inside emails, SMS, WhatsApp messages, and social engineering attacks.",
    href: "/tools/phishing-analysis",
    icon: BrainCircuit,
    status: "Active",
  },

  {
    title: "Threat Intelligence",
    description:
      "Advanced threat intelligence and malware analysis modules coming soon.",
    href: "#",
    icon: ShieldCheck,
    status: "Coming Soon",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <CyberBackground />

      <main className="min-h-screen px-6 py-28 text-white">

        <div className="max-w-7xl mx-auto">

          {/* HERO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-green-400">
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
                Cyber Security Toolkit
              </motion.span>
            </h1>

            <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">

              Access CyberSatark’s intelligent
              phishing analysis, email
              forensics, URL inspection, and
              cybersecurity awareness tools from
              one centralized workspace.
            </p>
          </motion.div>

          {/* TOOL GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {tools.map((tool, index) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={index}
                  href={tool.href}
                  className="group"
                >

                  <div
                    className="
                    h-full
                    rounded-3xl
                    border
                    border-green-500/20
                    bg-black/30
                    backdrop-blur-xl
                    overflow-hidden
                    shadow-2xl
                    shadow-green-500/5
                    hover:shadow-green-500/20
                    hover:border-green-400/40
                    transition-all
                    duration-300
                    p-7
                    flex
                    flex-col
                  "
                  >

                    {/* TOP BAR */}
                    <div className="flex items-center justify-between mb-8">

                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/70"></div>

                        <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>

                        <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                      </div>

                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border
                        ${
                          tool.status ===
                          "Active"
                            ? "border-green-500/30 text-green-400 bg-green-500/10"
                            : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                        }`}
                      >
                        {tool.status}
                      </span>
                    </div>

                    {/* ICON */}
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">

                      <Icon
                        size={30}
                        className="text-green-400"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">

                      <h2 className="text-2xl font-semibold text-white mb-4 group-hover:text-green-400 transition">
                        {tool.title}
                      </h2>

                      <p className="text-gray-400 leading-relaxed text-sm">
                        {tool.description}
                      </p>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-8 flex items-center justify-between">

                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <span className="text-green-400">
                          ●
                        </span>

                        Secure Module
                      </div>

                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium group-hover:translate-x-1 transition">

                        Open

                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>

          {/* FUTURE SECTION */}
          <section className="mt-24 text-center">

            <div className="rounded-3xl border border-green-500/20 bg-black/30 backdrop-blur-xl p-10 shadow-2xl shadow-green-500/5">

              <h2 className="text-3xl font-bold text-green-400 mb-5">
                More Tools Coming Soon
              </h2>

              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                CyberSatark will continue
                expanding with malware analysis,
                threat intelligence dashboards,
                browser safety modules, cyber
                simulations, and real-time
                phishing detection systems.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}