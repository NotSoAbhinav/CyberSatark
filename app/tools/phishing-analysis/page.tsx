"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Threat {
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  description: string;
  technique: string;
}

interface Dimensions {
  urgency_manipulation: number;
  social_engineering: number;
  technical_deception: number;
  linguistic_anomalies: number;
  impersonation: number;
  credential_harvesting: number;
}

interface AnalysisResult {
  verdict: "PHISHING" | "SUSPICIOUS" | "LEGITIMATE" | "UNCERTAIN";
  confidence: number;
  risk_score: number;
  summary: string;
  dimensions: Dimensions;
  threats: Threat[];
  iocs: string[];
  target_profile: string;
  attacker_intent: string;
  recommended_action: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a world-class cybersecurity analyst specializing in phishing detection and social engineering analysis. Analyze the given message for phishing indicators with expert precision.

Return ONLY a valid JSON object (no markdown, no backticks, no preamble) with this exact structure:
{
  "verdict": "PHISHING" | "SUSPICIOUS" | "LEGITIMATE" | "UNCERTAIN",
  "confidence": <integer 0-100>,
  "risk_score": <integer 0-100>,
  "summary": "<2-3 sentence expert summary of findings>",
  "dimensions": {
    "urgency_manipulation": <integer 0-100>,
    "social_engineering": <integer 0-100>,
    "technical_deception": <integer 0-100>,
    "linguistic_anomalies": <integer 0-100>,
    "impersonation": <integer 0-100>,
    "credential_harvesting": <integer 0-100>
  },
  "threats": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "category": "<e.g. Urgency Tactic, URL Manipulation, Brand Impersonation>",
      "description": "<specific finding with evidence from the text>",
      "technique": "<name of social engineering or technical technique>"
    }
  ],
  "iocs": ["<indicator of compromise or suspicious element>"],
  "target_profile": "<who is likely being targeted and why>",
  "attacker_intent": "<what the attacker likely wants to achieve>",
  "recommended_action": "<what the recipient should do>"
}

Be precise and evidence-based. Reference exact phrases. If text is legitimate, say so confidently with 0 threats. Never over-flag.`;

const DIMENSIONS_META: { key: keyof Dimensions; label: string }[] = [
  { key: "urgency_manipulation",  label: "Urgency Manipulation"  },
  { key: "social_engineering",    label: "Social Engineering"    },
  { key: "technical_deception",   label: "Technical Deception"   },
  { key: "linguistic_anomalies",  label: "Linguistic Anomalies"  },
  { key: "impersonation",         label: "Impersonation"         },
  { key: "credential_harvesting", label: "Credential Harvesting" },
];

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

// ─── Helper Components ────────────────────────────────────────────────────────

function VerdictBadge({ verdict }: { verdict: AnalysisResult["verdict"] }) {
  const styles: Record<string, string> = {
    PHISHING:   "bg-red-500/15 text-red-400 border border-red-500/30",
    SUSPICIOUS: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    LEGITIMATE: "bg-green-500/15 text-green-400 border border-green-500/30",
    UNCERTAIN:  "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[verdict]}`}>
      {verdict}
    </span>
  );
}

function SeverityDot({ severity }: { severity: Threat["severity"] }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500",
    high:     "bg-orange-500",
    medium:   "bg-yellow-500",
    low:      "bg-blue-500",
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${styles[severity]}`} />
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function getRiskColor(score: number) {
  if (score >= 70) return { text: "text-red-400",    bar: "bg-red-500",    hex: "#f87171" };
  if (score >= 40) return { text: "text-yellow-400", bar: "bg-yellow-500", hex: "#facc15" };
  return               { text: "text-green-400",  bar: "bg-green-500",  hex: "#4ade80" };
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "dimensions" | "findings" | "intel" | "iocs";

export default function PhishingAnalysis() {
  const [inputText, setInputText]   = useState("");
  const [analysis, setAnalysis]     = useState<AnalysisResult | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [activeTab, setActiveTab]   = useState<Tab>("dimensions");
  const [statusMsg, setStatusMsg]   = useState("");

  // ── Analysis runner ─────────────────────────────────────────────────────────

  const runAnalysis = async () => {
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setActiveTab("dimensions");

    const steps = [
      "Running deep linguistic analysis…",
      "Detecting psychological manipulation tactics…",
      "Analysing technical indicators & URL patterns…",
      "Generating expert threat report…",
    ];
    let stepIdx = 0;
    setStatusMsg(steps[stepIdx]);
    const interval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      setStatusMsg(steps[stepIdx]);
    }, 900);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1800,
          system: SYSTEM_PROMPT,
          messages: [
            { role: "user", content: `Analyze this message:\n\n${inputText}` },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);

      const data = await response.json();
      const raw: string = data.content?.[0]?.text ?? "";

      // Safely parse — strip any accidental markdown fences
      let parsed: AnalysisResult;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Could not parse AI response.");
        parsed = JSON.parse(match[0]);
      }

      // Sort threats by severity
      parsed.threats?.sort(
        (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
      );

      setAnalysis(parsed);
    } catch (err: any) {
      setError(err?.message ?? "Analysis failed. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setStatusMsg("");
    }
  };

  // ── Derived values ───────────────────────────────────────────────────────────

  const riskColor = analysis ? getRiskColor(analysis.risk_score) : null;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "dimensions", label: "Dimensions" },
    { id: "findings",   label: "Findings",  count: analysis?.threats.length },
    { id: "intel",      label: "Threat Intel" },
    { id: "iocs",       label: "IOCs",      count: analysis?.iocs.length },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] to-[#111827] text-white flex flex-col items-center px-6 py-28">

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-3">
            AI-Powered Phishing Detection Engine
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Deep behavioural, linguistic, and technical analysis powered by Claude AI — 
            not keyword matching. Paste any suspicious email, SMS, or message below.
          </p>
        </div>

        <div className="w-full max-w-3xl space-y-5">

          {/* ── Input ── */}
          <textarea
            rows={8}
            placeholder="Paste suspicious email or message here…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-green-500/20 focus:outline-none focus:border-green-400/60 transition resize-none text-sm font-mono text-gray-200 placeholder:text-gray-600"
          />

          <button
            onClick={runAnalysis}
            disabled={loading || !inputText.trim()}
            className="w-full py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? "Analysing…" : "Run AI Analysis"}
          </button>

          {/* ── Loading state ── */}
          {loading && (
            <div className="p-5 bg-black/40 border border-green-500/20 rounded-xl space-y-3">
              {["Running deep linguistic analysis…",
                "Detecting psychological manipulation tactics…",
                "Analysing technical indicators & URL patterns…",
                "Generating expert threat report…",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      statusMsg === step ? "bg-green-400 animate-pulse" : "bg-white/15"
                    }`}
                  />
                  <span className={`text-sm transition-colors ${
                    statusMsg === step ? "text-gray-200" : "text-gray-600"
                  }`}>{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Error state ── */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ── Results ── */}
          {analysis && !loading && (
            <div className="space-y-4">

              {/* ── Verdict card ── */}
              <div className="p-6 bg-black/40 border border-green-500/20 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Verdict</p>
                    <VerdictBadge verdict={analysis.verdict} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Risk Score</p>
                    <p className={`text-3xl font-bold ${riskColor!.text}`}>
                      {analysis.risk_score}
                      <span className="text-base text-gray-500 font-normal">/100</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      AI confidence: {analysis.confidence}%
                    </p>
                  </div>
                </div>

                {/* Risk bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${riskColor!.bar}`}
                    style={{ width: `${analysis.risk_score}%` }}
                  />
                </div>

                <p className="text-sm text-gray-400 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* ── Tabs ── */}
              <div className="flex gap-1 p-1 bg-black/30 rounded-xl border border-white/5">
                {tabs.map(({ id, label, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                      activeTab === id
                        ? "bg-green-500/15 text-green-400"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {label}
                    {count !== undefined && count > 0 && (
                      <span className="bg-red-500/20 text-red-400 rounded-full px-1.5 py-0.5 text-[10px] leading-none">
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Tab: Dimensions ── */}
              {activeTab === "dimensions" && (
                <div className="grid grid-cols-2 gap-3">
                  {DIMENSIONS_META.map(({ key, label }) => {
                    const score = analysis.dimensions[key];
                    const color = getRiskColor(score);
                    return (
                      <div key={key} className="p-4 bg-black/40 border border-white/5 rounded-xl">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-xs text-gray-500">{label}</span>
                          <span className={`text-sm font-semibold ${color.text}`}>{score}</span>
                        </div>
                        <ScoreBar score={score} color={color.bar} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Tab: Findings ── */}
              {activeTab === "findings" && (
                <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-4">
                  {analysis.threats.length === 0 ? (
                    <div className="flex items-center gap-3 text-green-400 text-sm py-2">
                      <span className="text-lg">✓</span>
                      No phishing indicators detected in this message.
                    </div>
                  ) : (
                    analysis.threats.map((threat, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 pb-4 ${
                          i < analysis.threats.length - 1
                            ? "border-b border-white/5"
                            : ""
                        }`}
                      >
                        <SeverityDot severity={threat.severity} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-medium text-white">
                              {threat.technique}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase tracking-wide">
                              {threat.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed mb-1">
                            {threat.description}
                          </p>
                          <p className="text-xs text-gray-600">{threat.category}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Tab: Threat Intel ── */}
              {activeTab === "intel" && (
                <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-5 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Target Profile</p>
                    <p className="text-gray-300 leading-relaxed">{analysis.target_profile || "Not determined."}</p>
                  </div>
                  <div className="border-t border-white/5 pt-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Attacker Intent</p>
                    <p className="text-gray-300 leading-relaxed">{analysis.attacker_intent || "Not determined."}</p>
                  </div>
                  <div className="border-t border-white/5 pt-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Recommended Action</p>
                    <p className="text-green-400 font-medium leading-relaxed">{analysis.recommended_action || "Exercise caution."}</p>
                  </div>
                </div>
              )}

              {/* ── Tab: IOCs ── */}
              {activeTab === "iocs" && (
                <div className="p-5 bg-black/40 border border-white/5 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                    Indicators of Compromise
                  </p>
                  {analysis.iocs.length === 0 ? (
                    <p className="text-gray-500 text-sm">No IOCs identified.</p>
                  ) : (
                    <ul className="space-y-2">
                      {analysis.iocs.map((ioc, i) => (
                        <li
                          key={i}
                          className="font-mono text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2 break-all"
                        >
                          {ioc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}
