"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f1a]">
        <div className="absolute w-[600px] h-[600px] bg-green-500/10 blur-3xl rounded-full top-[-200px] left-[-200px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full bottom-[-150px] right-[-150px] animate-pulse"></div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#00ff99 1px, transparent 1px), linear-gradient(90deg, #00ff99 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Highlight Hover Style */}
      <style jsx global>{`
        .highlight-hover {
          transition: all 0.3s ease;
        }
        .highlight-hover:hover {
          color: #00ff99 !important;
          text-shadow: 0 0 8px #00ff99, 0 0 16px #00ff99;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="px-8 py-32 max-w-6xl mx-auto space-y-32">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-green-400 drop-shadow-lg glow-hover highlight-hover cursor-pointer">
            About CyberSatark
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            CyberSatark is an AI-powered phishing awareness platform built to
            strengthen human judgment through intelligent detection systems
            and immersive cybersecurity simulations.
          </p>
        </motion.section>

        {/* MISSION + APPROACH */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-16"
        >
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold text-green-400 glow-hover highlight-hover cursor-pointer border-b border-green-500/30 pb-2">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To transform passive internet users into proactive cyber defenders
              by combining machine learning intelligence with real-world awareness training.
            </p>
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl font-semibold text-green-400 glow-hover highlight-hover cursor-pointer border-b border-green-500/30 pb-2">
              Our Approach
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We integrate rule-based analysis, AI-driven classification,
              behavioral profiling, and simulation-based education
              to create a multi-layered cybersecurity ecosystem.
            </p>
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-10"
        >
          {[
            {
              title: "Hybrid Detection",
              desc: "Combining rule-based inspection with machine learning accuracy."
            },
            {
              title: "Human Awareness",
              desc: "Interactive phishing simulations for real-world readiness."
            },
            {
              title: "Risk Intelligence",
              desc: "Real-time scoring and behavioral threat analysis."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-black/40 border border-green-500/20 backdrop-blur-md hover:-translate-y-1 hover:shadow-green-400/30 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-semibold text-green-300 glow-hover highlight-hover cursor-pointer mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.section>

        {/* TECH STACK */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-semibold text-green-400 glow-hover highlight-hover cursor-pointer">
            Tech Stack
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Next.js",
              "Tailwind CSS",
              "Framer Motion",
              "Machine Learning",
              "Flask API"
            ].map((tech, index) => (
              <span
                key={index}
                className="px-6 py-3 rounded-xl bg-green-500/10 border border-green-400/30 text-white text-sm font-medium hover:scale-110 hover:shadow-green-400/40 hover:shadow-md transition duration-300 glow-hover highlight-hover cursor-pointer"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* TEAM */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          <h2 className="text-3xl font-semibold text-green-400 glow-hover highlight-hover cursor-pointer">
            Team Error404
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[
              {
                name: "Abhinav Mishra",
                github: "https://github.com/NotSoAbhinav.png"
              },
              {
                name: "Jaiyansh Dhaulakhandi",
                github: "https://github.com/Jaiyansh12.png"
              },
              {
                name: "Ritambhar Advait",
                github: "https://github.com/RitambharAdvait.png"
              },
              {
                name: "Piyush Kumar",
                github: "https://github.com/piyushkumar-git.png"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 rounded-xl bg-black/40 border border-green-500/20 hover:-translate-y-1 hover:shadow-green-400/30 hover:shadow-lg transition duration-300"
              >
                {member.github ? (
                  <img
                    src={member.github}
                    alt={member.name}
                    className="w-20 h-20 rounded-full border-2 border-green-400 object-cover mb-4 hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-bold text-green-400 mb-4">
                    {member.name.charAt(0)}
                  </div>
                )}

                <h3 className="text-white font-medium glow-hover highlight-hover cursor-pointer">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </>
  );
}
