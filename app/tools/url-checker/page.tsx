"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function URLChecker() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeURL = () => {
    if (!url) return;

    let score = 0;
    let findings: string[] = [];

    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();

      // 1️⃣ HTTPS
      if (parsed.protocol !== "https:") {
        score += 20;
        findings.push("❌ URL does not use HTTPS.");
      } else {
        findings.push("✅ HTTPS protocol detected.");
      }

      // 2️⃣ IP Address Check
      const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      if (ipRegex.test(hostname)) {
        score += 25;
        findings.push("❌ URL uses IP address instead of domain name.");
      }

      // 3️⃣ @ Symbol
      if (url.includes("@")) {
        score += 15;
        findings.push("⚠️ '@' symbol detected (possible redirect attack).");
      }

      // 4️⃣ Too Many Subdomains
      if (hostname.split(".").length > 3) {
        score += 10;
        findings.push("⚠️ Excessive subdomains detected.");
      }

      // 5️⃣ Very Long URL
      if (url.length > 120) {
        score += 10;
        findings.push("⚠️ URL is unusually long.");
      }

      // 6️⃣ Hyphen in Domain
      if (hostname.includes("-")) {
        score += 5;
        findings.push("⚠️ Hyphen found in domain (common in phishing).");
      }

      // 7️⃣ URL Shorteners
      const shorteners = [
        "bit.ly",
        "tinyurl.com",
        "goo.gl",
        "t.co",
        "ow.ly"
      ];
      if (shorteners.some((short) => hostname.includes(short))) {
        score += 20;
        findings.push("⚠️ URL shortener detected.");
      }

      // 8️⃣ Encoded Characters
      if (url.includes("%")) {
        score += 5;
        findings.push("⚠️ Encoded characters detected in URL.");
      }

      // 9️⃣ Suspicious Keywords
      const suspiciousWords = [
        "login",
        "verify",
        "secure",
        "update",
        "bank",
        "account",
        "free",
        "bonus",
        "signin",
        "reset"
      ];

      suspiciousWords.forEach((word) => {
        if (url.toLowerCase().includes(word)) {
          score += 5;
          findings.push(`⚠️ Suspicious keyword detected: '${word}'`);
        }
      });

      if (score > 100) score = 100;

      setAnalysis({
        score,
        findings
      });

    } catch {
      setAnalysis({
        score: 100,
        findings: ["❌ Invalid URL format."]
      });
    }
  };

  const getRiskColor = () => {
    if (!analysis) return "text-white";
    if (analysis.score < 30) return "text-green-400";
    if (analysis.score < 60) return "text-yellow-400";
    return "text-red-500";
  };

  const getRiskLevel = () => {
    if (!analysis) return "";
    if (analysis.score < 30) return "Low Risk";
    if (analysis.score < 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col items-center px-6 py-28">

        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Advanced URL Security Checker
        </h1>

        <div className="w-full max-w-2xl space-y-6">

          <input
            type="text"
            placeholder="Enter URL (https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-green-500/20 focus:outline-none focus:border-green-400 transition"
          />

          <button
            onClick={analyzeURL}
            className="w-full py-3 bg-green-500 text-black font-semibold rounded-lg hover:shadow-green-400/40 hover:shadow-lg transition"
          >
            Analyze URL
          </button>

          {analysis && (
            <div className="mt-6 p-6 bg-black/40 border border-green-500/20 rounded-xl space-y-4">

              <div>
                <h2 className={`text-2xl font-semibold ${getRiskColor()}`}>
                  Risk Score: {analysis.score}%
                </h2>
                <p className="text-sm text-gray-400">
                  Risk Level: {getRiskLevel()}
                </p>
              </div>

              <div className="space-y-2">
                {analysis.findings.map((item: string, index: number) => (
                  <p key={index} className="text-gray-300 text-sm">
                    {item}
                  </p>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </>
  );
}