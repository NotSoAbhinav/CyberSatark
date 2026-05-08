"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

type Verdict =
  | "SAFE"
  | "SUSPICIOUS"
  | "DANGEROUS";

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
  findings: Finding[];
  indicators: string[];
  domain: string;
  protocol: string;
  dimensions: {
    domainRisk: number;
    phishingRisk: number;
    technicalRisk: number;
    urlStructure: number;
    trustScore: number;
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

function analyseURL(
  input: string
): AnalysisResult {
  let risk = 0;

  const findings: Finding[] = [];

  const indicators: string[] = [];

  let domainRisk = 0;
  let phishingRisk = 0;
  let technicalRisk = 0;
  let urlStructure = 0;
  let trustScore = 100;

  let parsed: URL;

  try {
    parsed = new URL(
      input.startsWith("http")
        ? input
        : `https://${input}`
    );
  } catch {
    return {
      verdict: "DANGEROUS",
      risk: 100,
      confidence: 95,
      summary:
        "The submitted input is not a valid URL.",
      findings: [
        {
          severity: "critical",
          title: "Invalid URL Format",
          detail:
            "The URL format appears malformed or invalid.",
        },
      ],
      indicators: [],
      domain: "Unknown",
      protocol: "Unknown",
      dimensions: {
        domainRisk: 100,
        phishingRisk: 100,
        technicalRisk: 100,
        urlStructure: 100,
        trustScore: 0,
      },
    };
  }

  const domain = parsed.hostname.toLowerCase();

  const protocol = parsed.protocol;

  const path = parsed.pathname.toLowerCase();

  // HTTPS CHECK
  if (protocol !== "https:") {
    risk += 25;
    technicalRisk += 35;
    trustScore -= 20;

    findings.push({
      severity: "high",
      title: "Insecure Connection",
      detail:
        "The website is not using HTTPS encryption.",
    });
  }

  // IP ADDRESS URL
  if (
    /^(\d{1,3}\.){3}\d{1,3}$/.test(domain)
  ) {
    risk += 35;
    technicalRisk += 40;
    trustScore -= 30;

    findings.push({
      severity: "critical",
      title: "IP Address URL",
      detail:
        "Using raw IP addresses instead of domains is commonly associated with phishing.",
    });
  }

  // URL SHORTENERS
  const shorteners = [
    "bit.ly",
    "tinyurl",
    "t.co",
    "goo.gl",
    "is.gd",
  ];

  if (
    shorteners.some((s) =>
      domain.includes(s)
    )
  ) {
    risk += 30;
    phishingRisk += 40;
    trustScore -= 25;

    findings.push({
      severity: "high",
      title: "Shortened URL Detected",
      detail:
        "URL shorteners are often used to hide malicious destinations.",
    });
  }

  // SUSPICIOUS KEYWORDS
  const suspiciousWords = [
    "login",
    "verify",
    "secure",
    "account",
    "update",
    "bank",
    "wallet",
    "password",
    "signin",
    "confirm",
  ];

  suspiciousWords.forEach((word) => {
    if (
      domain.includes(word) ||
      path.includes(word)
    ) {
      risk += 8;
      phishingRisk += 10;
      urlStructure += 10;
    }
  });

  if (phishingRisk >= 20) {
    findings.push({
      severity: "medium",
      title: "Phishing-Style Keywords",
      detail:
        "URL contains keywords commonly seen in credential harvesting attacks.",
    });
  }

  // EXCESSIVE SUBDOMAINS
  const subdomains = domain.split(".");

  if (subdomains.length >= 5) {
    risk += 20;
    urlStructure += 30;
    trustScore -= 15;

    findings.push({
      severity: "medium",
      title: "Excessive Subdomains",
      detail:
        "The domain structure appears unusually complex or misleading.",
    });
  }

  // SUSPICIOUS TLD
  const suspiciousTlds = [
    ".ru",
    ".tk",
    ".xyz",
    ".top",
    ".gq",
  ];

  suspiciousTlds.forEach((tld) => {
    if (domain.endsWith(tld)) {
      risk += 20;
      domainRisk += 25;
      trustScore -= 20;

      findings.push({
        severity: "medium",
        title: "Suspicious Domain TLD",
        detail:
          "This top-level domain is commonly abused in phishing campaigns.",
      });
    }
  });

  // BRAND IMPERSONATION
  const brands = [
    "paypal",
    "google",
    "amazon",
    "microsoft",
    "apple",
    "instagram",
    "facebook",
    "netflix",
    "bank",
  ];

  brands.forEach((brand) => {
    if (
      domain.includes(brand) &&
      !domain.endsWith(`${brand}.com`)
    ) {
      risk += 25;
      phishingRisk += 35;
      trustScore -= 20;

      findings.push({
        severity: "high",
        title: "Possible Brand Impersonation",
        detail:
          "The domain appears to mimic a trusted brand.",
      });
    }
  });

  // LONG URL
  if (input.length > 120) {
    risk += 10;
    urlStructure += 15;

    findings.push({
      severity: "low",
      title: "Long URL Structure",
      detail:
        "Very long URLs may attempt to hide malicious paths or parameters.",
    });
  }

  // SPECIAL CHARS
  if (
    input.includes("@") ||
    input.includes("%")
  ) {
    risk += 15;
    technicalRisk += 20;

    findings.push({
      severity: "medium",
      title: "Encoded or Obfuscated Characters",
      detail:
        "The URL contains symbols commonly used in deceptive URLs.",
    });
  }

  // QUERY PARAMS
  if (parsed.search.length > 60) {
    risk += 10;
    urlStructure += 15;

    findings.push({
      severity: "low",
      title: "Complex Query Parameters",
      detail:
        "The URL contains unusually long or complex query strings.",
    });
  }

  indicators.push(domain);

  risk = Math.min(risk, 100);

  trustScore = Math.max(
    0,
    Math.min(trustScore, 100)
  );

  let verdict: Verdict = "SAFE";

  if (risk >= 70) verdict = "DANGEROUS";
  else if (risk >= 35)
    verdict = "SUSPICIOUS";

  const confidence = Math.min(
    95,
    50 + findings.length * 8
  );

  const summary =
    verdict === "SAFE"
      ? "The URL does not show major phishing or malicious indicators."
      : `The URL contains ${findings.length} suspicious indicators associated with phishing, deception, or unsafe web activity.`;

  return {
    verdict,
    risk,
    confidence,
    summary,
    findings,
    indicators,
    domain,
    protocol,
    dimensions: {
      domainRisk,
      phishingRisk,
      technicalRisk,
      urlStructure,
      trustScore,
    },
  };
}

export default function URLChecker() {
  const [url, setUrl] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const runAnalysis = async () => {
    if (!url.trim()) return;

    setLoading(true);

    await new Promise((r) =>
      setTimeout(r, 1800)
    );

    const result = analyseURL(url);

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
                URL Threat Scanner
              </motion.span>
            </h1>

            <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
              Analyze suspicious URLs using
              phishing detection, structure analysis,
              and technical threat intelligence.
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
                URL Analysis Terminal
              </p>

              <div className="text-[10px] text-gray-600 font-mono">
                url-scanner.ts
              </div>
            </div>

            {/* INPUT FIELD */}
            <div className="p-5">
              <input
                type="text"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                placeholder="Paste suspicious URL here..."
                className="w-full rounded-2xl bg-[#050b12] border border-green-500/10 p-5 text-sm font-mono text-green-300 placeholder:text-gray-600 focus:outline-none focus:border-green-400/40"
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
                    : "Scan URL"}
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
                        "DANGEROUS"
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

              {/* DETAILS */}
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

              {/* FINDINGS */}
              <div className="space-y-5">
                {analysis.findings.length ===
                0 ? (
                  <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5 text-green-400">
                    ✓ No major threat indicators
                    detected.
                  </div>
                ) : (
                  analysis.findings.map(
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
                  )
                )}
              </div>

              {/* IOCS */}
              <div className="rounded-2xl border border-green-500/20 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                  Technical Details
                </p>

                <div className="space-y-3">

                  <div className="font-mono text-sm text-green-300 bg-black/30 border border-green-500/10 rounded-xl px-4 py-3 break-all">
                    Domain: {analysis.domain}
                  </div>

                  <div className="font-mono text-sm text-green-300 bg-black/30 border border-green-500/10 rounded-xl px-4 py-3 break-all">
                    Protocol: {analysis.protocol}
                  </div>

                  {analysis.indicators.map(
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
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}