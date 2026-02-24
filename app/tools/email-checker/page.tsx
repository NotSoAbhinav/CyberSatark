"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function EmailChecker() {
  const [header, setHeader] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const normalizeHeader = (raw: string) => {
    // Handle folded headers (multiline headers)
    return raw.replace(/\r?\n\s+/g, " ");
  };

  const extractEmail = (line: string | null) => {
    if (!line) return null;

    const angleMatch = line.match(/<([^>]+)>/);
    if (angleMatch) return angleMatch[1];

    const plainMatch = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return plainMatch ? plainMatch[0] : null;
  };

  const extractDomain = (email: string | null) => {
    return email ? email.split("@")[1]?.toLowerCase() : null;
  };

  const analyzeHeader = () => {
    if (!header.trim()) return;

    const cleanHeader = normalizeHeader(header);
    const lower = cleanHeader.toLowerCase();

    let score = 0;
    let findings: string[] = [];

    /* ================= AUTHENTICATION CHECK ================= */

    const authLineMatch = cleanHeader.match(/authentication-results:([^;]+)/i);
    const authLine = authLineMatch ? authLineMatch[1].toLowerCase() : "";

    const checkAuth = (type: string) => {
      if (authLine.includes(`${type}=pass`)) {
        findings.push(`✅ ${type.toUpperCase()} passed.`);
      } else if (authLine.includes(`${type}=fail`)) {
        score += 20;
        findings.push(`❌ ${type.toUpperCase()} failed.`);
      } else {
        score += 10;
        findings.push(`⚠ ${type.toUpperCase()} result not found.`);
      }
    };

    checkAuth("spf");
    checkAuth("dkim");
    checkAuth("dmarc");

    /* ================= HEADER FIELD EXTRACTION ================= */

    const fromLine = cleanHeader.match(/^from:(.*)$/im)?.[1] || null;
    const replyLine = cleanHeader.match(/^reply-to:(.*)$/im)?.[1] || null;
    const returnLine = cleanHeader.match(/^return-path:(.*)$/im)?.[1] || null;
    const messageIdLine = cleanHeader.match(/^message-id:(.*)$/im)?.[1] || null;

    const fromEmail = extractEmail(fromLine);
    const replyEmail = extractEmail(replyLine);
    const returnEmail = extractEmail(returnLine);
    const messageEmail = extractEmail(messageIdLine);

    const fromDomain = extractDomain(fromEmail);
    const replyDomain = extractDomain(replyEmail);
    const returnDomain = extractDomain(returnEmail);
    const messageDomain = extractDomain(messageEmail);

    if (fromDomain && returnDomain && fromDomain !== returnDomain) {
      score += 15;
      findings.push("⚠ From and Return-Path domain mismatch.");
    }

    if (fromDomain && replyDomain && fromDomain !== replyDomain) {
      score += 15;
      findings.push("⚠ From and Reply-To domain mismatch.");
    }

    if (fromDomain && messageDomain && !messageDomain.includes(fromDomain)) {
      score += 10;
      findings.push("⚠ Message-ID domain mismatch.");
    }

    /* ================= RECEIVED CHAIN CHECK ================= */

    const receivedMatches = cleanHeader.match(/^received:/gim);
    if (receivedMatches && receivedMatches.length > 4) {
      score += 10;
      findings.push("⚠ Multiple relay servers detected.");
    }

    /* ================= URL CHECK ================= */

    const urlRegex = /https?:\/\/[^\s]+/gi;
    const urls = cleanHeader.match(urlRegex);

    if (urls) {
      if (urls.length > 2) {
        score += 10;
        findings.push("⚠ Multiple URLs detected.");
      }

      urls.forEach((url) => {
        if (/\d{1,3}(\.\d{1,3}){3}/.test(url)) {
          score += 15;
          findings.push("❌ IP-based URL detected.");
        }

        if (url.includes("xn--")) {
          score += 15;
          findings.push("❌ Punycode domain detected.");
        }
      });
    }

    /* ================= SOCIAL ENGINEERING CHECK ================= */

    const suspiciousWords = [
      "urgent",
      "verify",
      "suspended",
      "click here",
      "reset password",
      "invoice attached",
      "crypto",
      "update immediately",
    ];

    let keywordHits = 0;
    suspiciousWords.forEach((word) => {
      if (lower.includes(word)) keywordHits++;
    });

    if (keywordHits > 0) {
      score += keywordHits * 5;
      findings.push(`⚠ ${keywordHits} phishing keywords detected.`);
    }

    /* ================= FINAL SCORE ================= */

    if (score > 100) score = 100;

    let riskLevel = "Low Risk";
    if (score >= 60) riskLevel = "High Risk";
    else if (score >= 30) riskLevel = "Medium Risk";

    setAnalysis({
      score,
      riskLevel,
      findings,
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

      <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col items-center px-6 py-28">
        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Advanced Email Header Analyzer
        </h1>

        <div className="w-full max-w-3xl space-y-6">

          <textarea
            placeholder="Paste full email header here..."
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-green-500/20 focus:outline-none focus:border-green-400 transition"
          />

          <button
            onClick={analyzeHeader}
            className="w-full py-3 bg-green-500 text-black font-semibold rounded-lg hover:shadow-lg transition"
          >
            Analyze Header
          </button>

          {analysis && (
            <div className="mt-6 p-6 bg-black/40 border border-green-500/20 rounded-xl space-y-4">
              <div>
                <h2 className={`text-2xl font-semibold ${getRiskColor()}`}>
                  Risk Score: {analysis.score}%
                </h2>
                <p className="text-sm text-gray-400">
                  Risk Level: {analysis.riskLevel}
                </p>
              </div>

              <div className="space-y-2">
                {analysis.findings.map((item: string, index: number) => (
                  <p key={index} className="text-gray-300 text-sm">
                    • {item}
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