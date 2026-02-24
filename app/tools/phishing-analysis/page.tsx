"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function PhishingAnalysis() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeText = () => {
    if (!inputText.trim()) return;

    let score = 0;
    let findings: string[] = [];
    const text = inputText.toLowerCase();

    // 1️⃣ Urgency Words
    const urgencyWords = [
      "urgent",
      "immediately",
      "act now",
      "limited time",
      "asap",
      "within 24 hours"
    ];

    urgencyWords.forEach(word => {
      if (text.includes(word)) {
        score += 10;
        findings.push(`⚠️ Urgency phrase detected: "${word}"`);
      }
    });

    // 2️⃣ Threat Language
    const threatWords = [
      "account suspended",
      "legal action",
      "penalty",
      "blocked",
      "terminated",
      "verify now"
    ];

    threatWords.forEach(word => {
      if (text.includes(word)) {
        score += 15;
        findings.push(`❌ Threat-based language detected: "${word}"`);
      }
    });

    // 3️⃣ Suspicious Links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex);

    if (links) {
      score += 10;
      findings.push(`⚠️ ${links.length} link(s) detected in message.`);

      const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl"];
      links.forEach(link => {
        if (shorteners.some(short => link.includes(short))) {
          score += 15;
          findings.push("⚠️ URL shortener detected in link.");
        }
      });
    }

    // 4️⃣ Reward / Bait Words
    const rewardWords = [
      "free",
      "bonus",
      "gift",
      "prize",
      "winner",
      "congratulations"
    ];

    rewardWords.forEach(word => {
      if (text.includes(word)) {
        score += 8;
        findings.push(`⚠️ Reward-based bait detected: "${word}"`);
      }
    });

    // 5️⃣ Request for Sensitive Info
    const sensitiveWords = [
      "otp",
      "password",
      "cvv",
      "credit card",
      "bank details",
      "ssn"
    ];

    sensitiveWords.forEach(word => {
      if (text.includes(word)) {
        score += 20;
        findings.push(`❌ Sensitive information request detected: "${word}"`);
      }
    });

    // 6️⃣ Excessive Capital Letters
    const capitalRatio =
      (inputText.replace(/[^A-Z]/g, "").length / inputText.length) * 100;

    if (capitalRatio > 30) {
      score += 5;
      findings.push("⚠️ Excessive use of capital letters detected.");
    }

    // Normalize score
    if (score > 100) score = 100;

    setAnalysis({
      score,
      findings
    });
  };

  const getRiskLevel = () => {
    if (!analysis) return "";
    if (analysis.score < 30) return "Low Risk";
    if (analysis.score < 60) return "Medium Risk";
    return "High Risk";
  };

  const getRiskColor = () => {
    if (!analysis) return "text-white";
    if (analysis.score < 30) return "text-green-400";
    if (analysis.score < 60) return "text-yellow-400";
    return "text-red-500";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col items-center px-6 py-28">

        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Phishing Message Analyzer
        </h1>

        <div className="w-full max-w-3xl space-y-6">

          <textarea
            placeholder="Paste suspicious email or message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-green-500/20 focus:outline-none focus:border-green-400 transition"
          />

          <button
            onClick={analyzeText}
            className="w-full py-3 bg-green-500 text-black font-semibold rounded-lg hover:shadow-green-400/40 hover:shadow-lg transition"
          >
            Analyze Message
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
                {analysis.findings.length === 0 ? (
                  <p className="text-green-400 text-sm">
                    ✅ No strong phishing indicators detected.
                  </p>
                ) : (
                  analysis.findings.map((item: string, index: number) => (
                    <p key={index} className="text-gray-300 text-sm">
                      {item}
                    </p>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </>
  );
}