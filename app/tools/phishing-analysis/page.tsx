"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

type Verdict =
  | "LEGITIMATE"
  | "SUSPICIOUS"
  | "PHISHING";

interface Threat {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
}

interface AnalysisResult {
  verdict: Verdict;
  risk: number;
  confidence: number;
  summary: string;
  threats: Threat[];
  iocs: string[];
  dimensions: {
    urgency: number;
    impersonation: number;
    credentialHarvesting: number;
    technicalDeception: number;
    socialEngineering: number;
  };
}

function getRiskColor(score: number) {
  if (score >= 70)
    return {
      text: "text-red-400",
      bar: "bg-red-500",
    };

  if (score >= 40)
    return {
      text: "text-yellow-400",
      bar: "bg-yellow-500",
    };

  return {
    text: "text-green-400",
    bar: "bg-green-500",
  };
}

function analyseMessage(
  text: string
): AnalysisResult {
  const content = text.toLowerCase();

  let risk = 0;

  const threats: Threat[] = [];

  const iocs: string[] = [];

  let urgency = 0;
  let impersonation = 0;
  let credentialHarvesting = 0;
  let technicalDeception = 0;
  let socialEngineering = 0;

  // URL Detection
  const urls =
    text.match(
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi
    ) || [];

  if (urls.length > 0) {
    technicalDeception += 20;
    risk += 15;

    iocs.push(...urls);

    threats.push({
      severity: "medium",
      title: "Suspicious URLs Detected",
      detail:
        "Message contains external links that may redirect users to phishing pages.",
    });
  }

  // Shortened URLs
  const shorteners = [
    "bit.ly",
    "tinyurl",
    "goo.gl",
    "t.co",
  ];

  shorteners.forEach((s) => {
    if (content.includes(s)) {
      risk += 20;
      technicalDeception += 30;

      threats.push({
        severity: "high",
        title: "Shortened URL Used",
        detail:
          "Attackers commonly hide malicious links using URL shorteners.",
      });
    }
  });

  // Urgency tactics
  const urgencyWords = [
    "urgent",
    "immediately",
    "suspended",
    "verify now",
    "act now",
    "limited time",
    "expire",
    "warning",
  ];

  urgencyWords.forEach((word) => {
    if (content.includes(word)) {
      risk += 8;
      urgency += 15;
    }
  });

  if (urgency >= 20) {
    threats.push({
      severity: "medium",
      title: "Urgency Manipulation",
      detail:
        "Message attempts to create panic or urgency to pressure quick action.",
    });
  }

  // Credential harvesting
  const credentialWords = [
    "password",
    "otp",
    "bank account",
    "credit card",
    "login",
    "verify your account",
    "security code",
  ];

  credentialWords.forEach((word) => {
    if (content.includes(word)) {
      risk += 10;
      credentialHarvesting += 15;
    }
  });

  if (credentialHarvesting >= 20) {
    threats.push({
      severity: "high",
      title: "Credential Harvesting Attempt",
      detail:
        "Message requests sensitive authentication or financial information.",
    });
  }

  // Brand impersonation
  const brands = [
    "paypal",
    "microsoft",
    "google",
    "amazon",
    "netflix",
    "instagram",
    "facebook",
    "bank",
    "apple",
  ];

  brands.forEach((brand) => {
    if (content.includes(brand)) {
      impersonation += 10;
    }
  });

  if (impersonation >= 20) {
    risk += 20;

    threats.push({
      severity: "high",
      title: "Brand Impersonation",
      detail:
        "Message appears to impersonate a trusted company or service.",
    });
  }

  // Threatening language
  const threatWords = [
    "account locked",
    "legal action",
    "your account will be closed",
    "payment failed",
    "unauthorized login",
  ];

  threatWords.forEach((word) => {
    if (content.includes(word)) {
      risk += 12;
      socialEngineering += 15;
    }
  });

  if (socialEngineering >= 20) {
    threats.push({
      severity: "medium",
      title: "Social Engineering Tactics",
      detail:
        "Message uses fear or manipulation to influence the recipient.",
    });
  }

  // Crypto scam detection
  const cryptoWords = [
    "bitcoin",
    "crypto",
    "wallet",
    "binance",
    "investment",
    "trading profit",
  ];

  cryptoWords.forEach((word) => {
    if (content.includes(word)) {
      risk += 10;

      threats.push({
        severity: "medium",
        title: "Potential Crypto Scam",
        detail:
          "Message contains cryptocurrency scam-related terminology.",
      });
    }
  });

  // Giveaway scam
  const giveawayWords = [
    "won",
    "free reward",
    "claim prize",
    "gift card",
    "lottery",
  ];

  giveawayWords.forEach((word) => {
    if (content.includes(word)) {
      risk += 10;

      threats.push({
        severity: "medium",
        title: "Reward Scam Indicators",
        detail:
          "Message promises rewards or prizes commonly used in scams.",
      });
    }
  });

  risk = Math.min(risk, 100);

  let verdict: Verdict = "LEGITIMATE";

  if (risk >= 70) verdict = "PHISHING";
  else if (risk >= 35)
    verdict = "SUSPICIOUS";

  const confidence = Math.min(
    95,
    50 + threats.length * 8
  );

  const summary =
    verdict === "LEGITIMATE"
      ? "No major phishing indicators were detected in the submitted content."
      : `The message contains ${threats.length} suspicious indicators associated with phishing, impersonation, or social engineering attacks.`;

  return {
    verdict,
    risk,
    confidence,
    summary,
    threats,
    iocs,
    dimensions: {
      urgency,
      impersonation,
      credentialHarvesting,
      technicalDeception,
      socialEngineering,
    },
  };
}

export default function PhishingAnalysis() {
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const runAnalysis = async () => {
    if (!text.trim()) return;

    setLoading(true);

    await new Promise((r) =>
      setTimeout(r, 1800)
    );

    const result = analyseMessage(text);

    setAnalysis(result);

    setLoading(false);
  };

  const riskColor = useMemo(
    () =>
      analysis
        ? getRiskColor(analysis.risk)
        : null,
    [analysis]
  );

  return (
    <>
      <Navbar />

      {/* BACKGROUND */}
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

      <main className="min-h-screen px-6 py-28 text-white">
        <div className="max-w-6xl mx-auto">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
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
                PhishTrace AI
              </motion.span>
            </h1>

            <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
              Analyze suspicious emails, SMS, or
              messages using phishing detection and
              social engineering analysis.
            </p>
          </motion.div>

          {/* INPUT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-green-500/10"
          >

            {/* TOP BAR */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-green-500/10 bg-black/40">

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>

                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>

                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              </div>

              <p className="text-[11px] uppercase tracking-[0.3em] text-green-400 font-semibold">
                Threat Analysis Terminal
              </p>

              <div className="text-[10px] text-gray-600 font-mono">
                phishing-analysis.ts
              </div>
            </div>

            {/* TEXTAREA */}
            <div className="p-5">
              <textarea
                rows={8}
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                placeholder={`Paste suspicious email, SMS, WhatsApp message, or phishing text here...`}
                className="w-full rounded-2xl bg-[#050b12] border border-green-500/10 p-5 text-sm font-mono text-green-300 placeholder:text-gray-600 resize-none focus:outline-none focus:border-green-400/40"
              />

              <div className="mt-5 flex flex-col sm:flex-row gap-4 items-center justify-between">

                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                  <span className="text-green-400">
                    ●
                  </span>
                  Threat Intelligence Active
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runAnalysis}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-green-500 text-black font-bold shadow-lg shadow-green-500/20 hover:shadow-green-400/40 transition disabled:opacity-40"
                >
                  {loading
                    ? "Analysing..."
                    : "Run AI Analysis"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RESULTS */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 space-y-8"
            >

              {/* VERDICT */}
              <div className="rounded-3xl border border-green-500/20 bg-black/30 backdrop-blur-xl p-8 shadow-2xl shadow-green-500/10">

                <div className="flex flex-col md:flex-row justify-between gap-8">

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                      Threat Verdict
                    </p>

                    <div
                      className={`px-4 py-2 rounded-full inline-block font-bold tracking-[0.2em] text-xs ${
                        analysis.verdict ===
                        "PHISHING"
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : analysis.verdict ===
                            "SUSPICIOUS"
                          ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                          : "bg-green-500/10 border border-green-500/30 text-green-400"
                      }`}
                    >
                      {analysis.verdict}
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                      Risk Score
                    </p>

                    <h2
                      className={`text-5xl font-bold ${riskColor?.text}`}
                    >
                      {analysis.risk}
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm">
                      Confidence:{" "}
                      {analysis.confidence}%
                    </p>
                  </div>
                </div>

                <div className="mt-6 w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full ${riskColor?.bar}`}
                    style={{
                      width: `${analysis.risk}%`,
                    }}
                  />
                </div>

                <p className="mt-6 text-gray-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* DIMENSIONS */}
              <div className="grid md:grid-cols-5 gap-5">
                {Object.entries(
                  analysis.dimensions
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-green-500/20 bg-black/30 backdrop-blur-xl p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">
                      {key}
                    </p>

                    <h3
                      className={`text-2xl font-bold ${
                        value >= 70
                          ? "text-red-400"
                          : value >= 40
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {value}
                    </h3>
                  </div>
                ))}
              </div>

              {/* THREATS */}
              <div className="space-y-5">
                {analysis.threats.length ===
                0 ? (
                  <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5 text-green-400">
                    ✓ No major phishing indicators
                    detected.
                  </div>
                ) : (
                  analysis.threats.map(
                    (threat, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-green-500/10 bg-black/30 backdrop-blur-xl p-5"
                      >
                        <div className="flex items-center gap-3 mb-3 flex-wrap">

                          <h3 className="text-lg font-semibold text-white">
                            {threat.title}
                          </h3>

                          <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-widest bg-red-500/10 text-red-400">
                            {threat.severity}
                          </span>
                        </div>

                        <p className="text-gray-400 leading-relaxed">
                          {threat.detail}
                        </p>
                      </div>
                    )
                  )
                )}
              </div>

              {/* IOCS */}
              {analysis.iocs.length > 0 && (
                <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                    Indicators of Compromise
                  </p>

                  <div className="space-y-3">
                    {analysis.iocs.map(
                      (ioc, i) => (
                        <div
                          key={i}
                          className="font-mono text-sm text-green-300 bg-black/30 border border-green-500/10 rounded-xl px-4 py-3 break-all"
                        >
                          {ioc}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}