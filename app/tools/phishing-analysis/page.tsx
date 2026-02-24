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

    // -------------------------------
    // 1️⃣ AI-Inspired Keyword Frequency Scoring
    // -------------------------------
    const phishingKeywords = [
      "urgent",
      "verify",
      "suspended",
      "click here",
      "limited time",
      "winner",
      "free",
      "account",
      "login",
      "confirm",
      "bank",
      "otp",
      "password",
      "credit card",
      "ssn"
    ];

    let keywordHits = 0;
    phishingKeywords.forEach(word => {
      if (text.includes(word)) {
        keywordHits++;
        findings.push(`⚠️ Suspicious keyword detected: "${word}"`);
      }
    });

    score += keywordHits * 6;

    // -------------------------------
    // 2️⃣ Threat & Fear Detection
    // -------------------------------
    const threatWords = [
      "legal action",
      "terminated",
      "blocked",
      "penalty",
      "immediately",
      "within 24 hours"
    ];

    threatWords.forEach(word => {
      if (text.includes(word)) {
        score += 10;
        findings.push(`❌ Threat-based manipulation detected: "${word}"`);
      }
    });

    // -------------------------------
    // 3️⃣ URL Analysis
    // -------------------------------
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex);

    if (links) {
      score += 10;
      findings.push(`⚠️ ${links.length} external link(s) detected.`);

      const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl"];
      links.forEach(link => {
        if (shorteners.some(short => link.includes(short))) {
          score += 15;
          findings.push("❌ URL shortener detected (high risk).");
        }

        if (link.includes("@")) {
          score += 20;
          findings.push("❌ Suspicious URL structure detected (@ symbol).");
        }

        if (link.split(".").length > 4) {
          score += 10;
          findings.push("⚠️ Excessive subdomains detected.");
        }
      });
    }

    // -------------------------------
    // 4️⃣ Obfuscation Detection (AI Pattern)
    // -------------------------------
    if (/[0-9]{4,}/.test(text)) {
      score += 8;
      findings.push("⚠️ Random numeric sequence detected.");
    }

    if (/(\.|-){3,}/.test(text)) {
      score += 6;
      findings.push("⚠️ Obfuscated formatting detected.");
    }

    // -------------------------------
    // 5️⃣ Capitalization Ratio Check
    // -------------------------------
    const capitalRatio =
      (inputText.replace(/[^A-Z]/g, "").length / inputText.length) * 100;

    if (capitalRatio > 25) {
      score += 8;
      findings.push("⚠️ Excessive capital letters detected.");
    }

    // -------------------------------
    // 6️⃣ AI Confidence Model (Weighted Normalization)
    // -------------------------------
    if (score > 100) score = 100;

    let aiConfidence = 50 + score / 2;
    if (aiConfidence > 99) aiConfidence = 99;

    // Risk Level
    let riskLevel = "";
    if (score < 30) riskLevel = "Low Risk";
    else if (score < 60) riskLevel = "Medium Risk";
    else riskLevel = "High Risk";

    setAnalysis({
      score,
      findings,
      riskLevel,
      aiConfidence
    });
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

      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] to-[#111827] text-white flex flex-col items-center px-6 py-28">

        <h1 className="text-4xl font-bold text-green-400 mb-4 text-center">
          AI-Powered Phishing Detection Engine
        </h1>

        <p className="text-gray-400 mb-10 text-center max-w-2xl">
          Advanced behavioral and linguistic analysis using AI-inspired
          heuristics to detect phishing attempts in emails and messages.
        </p>

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
            Run AI Analysis
          </button>

          {analysis && (
            <div className="mt-6 p-6 bg-black/40 border border-green-500/20 rounded-xl space-y-6">

              <div>
                <h2 className={`text-2xl font-semibold ${getRiskColor()}`}>
                  Risk Score: {analysis.score}%
                </h2>
                <p className="text-gray-400 text-sm">
                  Risk Level: {analysis.riskLevel}
                </p>
                <p className="text-gray-400 text-sm">
                  AI Confidence: {analysis.aiConfidence.toFixed(1)}%
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