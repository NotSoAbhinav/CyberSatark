"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
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

      {/* HERO */}
      <section className="px-8 py-28 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-green-400 drop-shadow-lg">
          Stay Cyber Safe
        </h1>

        <p className="mt-6 text-2xl font-semibold text-green-300">
          Are you being phished?
        </p>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          Phishing attacks trick users into revealing passwords, OTPs,
          and financial information. Analyze suspicious messages instantly
          with CyberSatark.
        </p>

        {/* SINGLE CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/tools/phishing"
            className="relative px-10 py-4 rounded-xl bg-green-500 text-black font-semibold overflow-hidden group shadow-lg shadow-green-500/30 hover:shadow-green-400/50 transition"
          >
            <span className="relative z-10">Check Now</span>
            <span className="absolute inset-0 bg-green-300 opacity-0 group-hover:opacity-20 transition"></span>
          </Link>
        </div>
      </section>

      {/* CTA */}
<section className="px-8 py-24 text-center">
  <h2 className="text-3xl font-bold mb-4">
    Think Before You Click
  </h2>

  <p className="text-gray-300 mb-8">
    Stay alert. Stay secure. Stay CyberSatark.
  </p>

  <Link
    href="/learn"
    className="px-10 py-4 rounded-xl bg-green-500 text-black font-semibold 
               shadow-lg shadow-green-500/30 
               hover:shadow-green-400/50 transition"
  >
    Start Learning
  </Link>
</section>
    </>
  );
}