"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

type Verdict =
  | "LEGITIMATE"
  | "SUSPICIOUS"
  | "SPOOFED"
  | "PHISHING";

interface Finding {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
}

interface AnalysisResult {
  verdict: Verdict;
  risk: number;
  confidence: number;
  summary: string;
  auth: {
    spf: string;
    dkim: string;
    dmarc: string;
  };
  findings: Finding[];
  fromDomain: string;
  replyToDomain: string | null;
  returnPathDomain: string | null;
  hopCount: number;
}

function extractHeader(header: string, key: string) {
  const regex = new RegExp(`^${key}:(.*)$`, "gim");
  const match = regex.exec(header);

  return match ? match[1].trim() : null;
}

function extractDomain(value: string | null) {
  if (!value) return null;

  const emailMatch = value.match(
    /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]+)/i
  );

  return emailMatch ? emailMatch[1].toLowerCase() : null;
}

function getAuthStatus(
  authResults: string | null,
  key: string
) {
  if (!authResults) return "unknown";

  if (authResults.includes(`${key}=pass`))
    return "pass";

  if (
    authResults.includes(`${key}=fail`) ||
    authResults.includes(`${key}=softfail`)
  )
    return "fail";

  return "unknown";
}

function analyseHeader(header: string): AnalysisResult {
  let risk = 0;

  const findings: Finding[] = [];

  const authResults = extractHeader(
    header,
    "Authentication-Results"
  );

  const spf = getAuthStatus(authResults, "spf");

  const dkim = getAuthStatus(authResults, "dkim");

  const dmarc = getAuthStatus(authResults, "dmarc");

  if (spf === "fail") {
    risk += 30;

    findings.push({
      severity: "high",
      title: "SPF Authentication Failed",
      detail:
        "The sending mail server failed SPF validation.",
    });
  }

  if (dkim === "fail") {
    risk += 25;

    findings.push({
      severity: "high",
      title: "DKIM Verification Failed",
      detail:
        "The DKIM signature could not be validated.",
    });
  }

  if (dmarc === "fail") {
    risk += 30;

    findings.push({
      severity: "critical",
      title: "DMARC Policy Failed",
      detail:
        "DMARC validation failed indicating possible spoofing.",
    });
  }

  const fromHeader = extractHeader(header, "From");

  const replyToHeader = extractHeader(
    header,
    "Reply-To"
  );

  const returnPathHeader = extractHeader(
    header,
    "Return-Path"
  );

  const fromDomain = extractDomain(fromHeader);

  const replyToDomain =
    extractDomain(replyToHeader);

  const returnPathDomain =
    extractDomain(returnPathHeader);

  if (
    replyToDomain &&
    fromDomain &&
    replyToDomain !== fromDomain
  ) {
    risk += 20;

    findings.push({
      severity: "high",
      title: "Reply-To Domain Mismatch",
      detail:
        "Reply-To domain differs from sender domain.",
    });
  }

  if (
    returnPathDomain &&
    fromDomain &&
    returnPathDomain !== fromDomain
  ) {
    risk += 15;

    findings.push({
      severity: "medium",
      title: "Return-Path Mismatch",
      detail:
        "Return-Path domain differs from sender domain.",
    });
  }

  const freeProviders = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];

  if (
    fromDomain &&
    freeProviders.includes(fromDomain)
  ) {
    risk += 10;

    findings.push({
      severity: "medium",
      title: "Free Email Provider Used",
      detail:
        "Sender uses a free email provider often abused in phishing.",
    });
  }

  const receivedHeaders =
    header.match(/^Received:.*$/gim) || [];

  const hopCount = receivedHeaders.length;

  if (hopCount >= 8) {
    risk += 10;

    findings.push({
      severity: "low",
      title: "Unusual Routing Chain",
      detail:
        "Email passed through many relay servers.",
    });
  }

  if (
    header.toLowerCase().includes("urgent") ||
    header.toLowerCase().includes("verify") ||
    header.toLowerCase().includes("suspended")
  ) {
    risk += 15;

    findings.push({
      severity: "medium",
      title: "Social Engineering Language",
      detail:
        "Header contains words commonly used in phishing attacks.",
    });
  }

  risk = Math.min(risk, 100);

  let verdict: Verdict = "LEGITIMATE";

  if (risk >= 80) verdict = "PHISHING";
  else if (risk >= 60) verdict = "SPOOFED";
  else if (risk >= 35)
    verdict = "SUSPICIOUS";

  const confidence = Math.min(
    95,
    50 + findings.length * 10
  );

  const summary =
    verdict === "LEGITIMATE"
      ? "No major spoofing or phishing indicators were detected."
      : `This email shows ${findings.length} suspicious indicators associated with phishing or spoofing attempts.`;

  return {
    verdict,
    risk,
    confidence,
    summary,
    auth: {
      spf,
      dkim,
      dmarc,
    },
    findings,
    fromDomain: fromDomain || "Unknown",
    replyToDomain,
    returnPathDomain,
    hopCount,
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

export default function EmailChecker() {
  const [header, setHeader] = useState("");

  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const runAnalysis = async () => {
    if (!header.trim()) return;

    setLoading(true);

    await new Promise((r) =>
      setTimeout(r, 1800)
    );

    const result = analyseHeader(header);

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
                Email Risk Analyzer
              </motion.span>
            </h1>

            <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
              Analyze suspicious email headers using
              phishing detection and spoofing analysis.
            </p>
          </motion.div>

          {/* INPUT */}
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
                Email Header Terminal
              </p>

              <div className="text-[10px] text-gray-600 font-mono">
                secure-analysis.ts
              </div>
            </div>

            {/* TEXTAREA */}
            <div className="p-5">
              <textarea
                rows={8}
                value={header}
                onChange={(e) =>
                  setHeader(e.target.value)
                }
                placeholder={`Paste raw email header here...\n\nAuthentication-Results: spf=pass dkim=pass dmarc=pass\nFrom: security@bank.com`}
                className="w-full rounded-2xl bg-[#050b12] border border-green-500/10 p-5 text-sm font-mono text-green-300 placeholder:text-gray-600 resize-none focus:outline-none focus:border-green-400/40"
              />

              <div className="mt-5 flex flex-col sm:flex-row gap-4 items-center justify-between">

                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                  <span className="text-green-400">
                    ●
                  </span>
                  AI Threat Detection Active
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
                    : "Run Forensic Analysis"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RESULT */}
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

                    <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 inline-block text-green-400 font-bold tracking-[0.2em] text-xs">
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

              {/* AUTH */}
              <div className="grid md:grid-cols-3 gap-5">
                {Object.entries(analysis.auth).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-green-500/20 bg-black/30 backdrop-blur-xl p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                        {key}
                      </p>

                      <h3
                        className={`text-2xl font-bold ${
                          value === "pass"
                            ? "text-green-400"
                            : value === "fail"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {value}
                      </h3>
                    </div>
                  )
                )}
              </div>

              {/* DETAILS */}
              <div className="grid md:grid-cols-3 gap-5">

                <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                    From Domain
                  </p>

                  <p className="text-green-300 font-mono">
                    {analysis.fromDomain}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                    Reply-To
                  </p>

                  <p className="text-green-300 font-mono">
                    {analysis.replyToDomain ||
                      "Not Found"}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                    Routing Hops
                  </p>

                  <p className="text-green-300 font-mono">
                    {analysis.hopCount}
                  </p>
                </div>
              </div>

              {/* FINDINGS */}
              <div className="space-y-5">
                {analysis.findings.map(
                  (finding, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-green-500/10 bg-black/30 backdrop-blur-xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3 flex-wrap">

                        <h3 className="text-lg font-semibold text-white">
                          {finding.title}
                        </h3>

                        <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-widest bg-red-500/10 text-red-400">
                          {finding.severity}
                        </span>
                      </div>

                      <p className="text-gray-400 leading-relaxed">
                        {finding.detail}
                      </p>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}