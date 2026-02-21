"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

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

      <style jsx global>{`
        .highlight-hover {
          transition: all 0.3s ease;
        }
        .highlight-hover:hover {
          color: #00ff99;
          text-shadow: 0 0 8px rgba(0, 255, 153, 0.8);
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
          <h1 className="text-5xl md:text-6xl font-bold text-green-400 drop-shadow-lg highlight-hover cursor-pointer">
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
            <h2 className="text-3xl font-semibold text-green-400 highlight-hover cursor-pointer border-b border-green-500/30 pb-2">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To transform passive internet users into proactive cyber defenders
              by combining machine learning intelligence with real-world awareness training.
            </p>
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl font-semibold text-green-400 highlight-hover cursor-pointer border-b border-green-500/30 pb-2">
              Our Approach
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We integrate rule-based analysis, AI-driven classification,
              behavioral profiling, and simulation-based education
              to create a multi-layered cybersecurity ecosystem.
            </p>
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
          <h2 className="text-3xl font-semibold text-green-400 highlight-hover cursor-pointer">
            Team Error404
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[
              {
                name: "Abhinav Mishra",
                github: "https://github.com/NotSoAbhinav",
                linkedin: "https://www.linkedin.com/in/abhinav-mishra",
              },
              {
                name: "Jaiyansh Dhaulakhandi",
                github: "https://github.com/Jaiyansh12",
                linkedin: "https://www.linkedin.com/in/jaiyansh-dhaulakhandi",
              },
              {
                name: "Ritambhar Advait",
                github: "https://github.com/RitambharAdvait",
                linkedin: "https://www.linkedin.com/in/ritambhar-advait",
              },
              {
                name: "Piyush Kumar",
                github: "https://github.com/piyushkumar-git",
                linkedin: "https://www.linkedin.com/in/piyush-kumar",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 rounded-xl bg-black/40 border border-green-500/20 hover:-translate-y-1 hover:shadow-green-400/30 hover:shadow-lg transition duration-300"
              >
                <img
                  src={`https://github.com/${member.github.split("/").pop()}.png`}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-2 border-green-400 object-cover mb-4 hover:scale-110 transition duration-300"
                />

                <h3 className="text-white font-medium mb-3 highlight-hover cursor-pointer">
                  {member.name}
                </h3>

                {/* SOCIAL ICONS */}
                <div className="flex gap-4">
                  <a
                    href={member.github}
                    target="_blank"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    <Github size={20} />
                  </a>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    className="text-gray-400 hover:text-green-400 transition"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </>
  );
}