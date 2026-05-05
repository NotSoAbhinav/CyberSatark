"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

interface AuthResult {
  spf: string;
  dkim: string;
  dmarc: string;
  arc: string;
}

interface RoutingHop {
  from: string;
  by: string;
  delay_seconds: number;
  anomaly: boolean;
  anomaly_reason?: string;
}

interface Finding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  detail: string;
  technical_evidence: string;
}

interface HeaderAnalysis {
  verdict: "SPOOFED" | "PHISHING" | "SUSPICIOUS" | "LEGITIMATE" | "UNCERTAIN";
  confidence: number;
  risk_score: number;
  summary: string;
  auth: AuthResult;
  sender_analysis: {
    from_domain: string;
    envelope_domain: string;
    reply_to_domain: string | null;
    domain_alignment: "aligned" | "misaligned" | "partial";
    domain_age_estimate: string;
    display_name_spoofing: boolean;
    free_provider: boolean;
  };
  routing: {
    hops: RoutingHop[];
    hop_count: number;
    origin_ip: string | null;
    origin_geo_estimate: string | null;
    anomalous_routing: boolean;
  };
  technical_findings: Finding[];
  infrastructure_analysis: string;
  attacker_technique: string | null;
  recommended_action: string;
}

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0, high: 1, medium: 2, low: 3, info: 4,
};

const SYSTEM_PROMPT = `You are an expert email security analyst specialising in email header forensics, spoofing detection, and phishing infrastructure identification.

Analyse the raw email header provided. Reason about the full authentication chain, routing anomalies, infrastructure fingerprinting, and social engineering signals.

Return ONLY a valid JSON object (no markdown, no backticks, no preamble):
{
  "verdict": "SPOOFED" | "PHISHING" | "SUSPICIOUS" | "LEGITIMATE" | "UNCERTAIN",
  "confidence": <integer 0-100>,
  "risk_score": <integer 0-100>,
  "summary": "<2-3 sentence expert summary>",
  "auth": {
    "spf": "pass" | "fail" | "neutral" | "softfail" | "none" | "unknown",
    "dkim": "pass" | "fail" | "none" | "unknown",
    "dmarc": "pass" | "fail" | "none" | "unknown",
    "arc": "pass" | "fail" | "none" | "unknown"
  },
  "sender_analysis": {
    "from_domain": "<domain from From: header>",
    "envelope_domain": "<domain from Return-Path>",
    "reply_to_domain": "<domain from Reply-To or null>",
    "domain_alignment": "aligned" | "misaligned" | "partial",
    "domain_age_estimate": "<e.g. likely new, established, unknown>",
    "display_name_spoofing": <true|false>,
    "free_provider": <true|false>
  },
  "routing": {
    "hops": [
      {
        "from": "<sending host>",
        "by": "<receiving host>",
        "delay_seconds": <integer>,
        "anomaly": <true|false>,
        "anomaly_reason": "<reason if anomaly>"
      }
    ],
    "hop_count": <integer>,
    "origin_ip": "<IP of first untrusted hop or null>",
    "origin_geo_estimate": "<country/region or null>",
    "anomalous_routing": <true|false>
  },
  "technical_findings": [
    {
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "category": "<e.g. Authentication Failure, Domain Spoofing, Routing Anomaly>",
      "title": "<short title>",
      "detail": "<specific finding with evidence from the header>",
      "technical_evidence": "<exact header field or value>"
    }
  ],
  "infrastructure_analysis": "<paragraph about sending infrastructure and what it reveals>",
  "attacker_technique": "<specific attack technique name or null if legitimate>",
  "recommended_action": "<specific action for recipient or security team>"
}

Be precise. Reference actual header values. Sort findings by severity. If legitimate, say so with confidence and zero critical findings.`;

function getRiskColor(score: number) {
  if (score >= 70) return { text: "text-red-400", bar: "bg-red-500" };
  if (score >= 40) return { text: "text-yellow-400", bar: "bg-yellow-500" };
  return { text: "text-green-400", bar: "bg-green-500" };
}

function VerdictBadge({ verdict }: { verdict: HeaderAnalysis["verdict"] }) {
  const map: Record<string, string> = {
    SPOOFED:    "bg-red-500/20 text-red-400 border-red-500/40",
    PHISHING:   "bg-red-500/15 text-red-400 border-red-500/30",
    SUSPICIOUS: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    LEGITIMATE: "bg-green-500/15 text-green-400 border-green-500/30",
    UNCERTAIN:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${map[verdict]}`}>
      {verdict}
    </span>
  );
}

function AuthBadge({ label, value }: { label: string; value: string }) {
  const isPass = value === "pass";
  const isFail = value === "fail" || value === "softfail";
  const style = isPass
    ? "bg-green-500/15 text-green-400 border-green-500/30"
    : isFail
    ? "bg-red-500/15 text-red-400 border-red-500/30"
    : "bg-white/5 text-gray-400 border-white/10";
  return (
    <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border ${style}`}>
      <span className="text-[10px] font-semibold tracking-widest uppercase opacity-70">{label}</span>
      <span className="text-sm font-bold uppercase">{value}</span>
    </div>
  );
}

function SeverityPill({ severity }: { severity: Finding["severity"] }) {
  const map: Record<string, string> = {
    critical: "bg-red-500/15 text-red-400",
    high:     "bg-orange-500/15 text-orange-400",
    medium:   "bg-yellow-500/15 text-yellow-400",
    low:      "bg-blue-500/15 text-blue-400",
    info:     "bg-gray-500/15 text-gray-400",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${map[severity]}`}>
      {severity}
    </span>
  );
}

type Tab = "auth" | "routing" | "findings" | "infrastructure";

export default function EmailChecker() {
  const [header, setHeader]       = useState("");
  const [analysis, setAnalysis]   = useState<HeaderAnalysis | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("auth");
  const [statusMsg, setStatusMsg] = useState("");

  const runAnalysis = async () => {
    if (!header.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setActiveTab("auth");

    const steps = [
      "Parsing authentication chain (SPF / DKIM / DMARC / ARC)…",
      "Tracing routing hops and origin infrastructure…",
      "Checking domain alignment and sender identity…",
      "Generating forensic threat report…",
    ];
    let idx = 0;
    setStatusMsg(steps[0]);
    const interval = setInterval(() => {
      idx = Math.min(idx + 1, steps.length - 1);
      setStatusMsg(steps[idx]);
    }, 900);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyse this raw email header:\n\n${header}` }],
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const raw: string = data.content?.[0]?.text ?? "";

      let parsed: HeaderAnalysis;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Could not parse AI response.");
        parsed = JSON.parse(match[0]);
      }

      parsed.technical_findings?.sort(
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

  const riskColor = analysis ? getRiskColor(analysis.risk_score) : null;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "auth",           label: "Authentication" },
    { id: "routing",        label: "Routing",  count: analysis?.routing.hops.length },
    { id: "findings",       label: "Findings", count: analysis?.technical_findings.length },
    { id: "infrastructure", label: "Infrastructure" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] to-[#111827] text-white flex flex-col items-center px-6 py-28">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-3">AI Email Header Forensics</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Deep forensic analysis — authentication chain, routing anomalies, spoofing detection,
            and infrastructure fingerprinting powered by Claude AI.
          </p>
        </div>

        <div className="w-full max-w-3xl space-y-5">

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Raw Email Header</label>
            <textarea
              rows={12}
              placeholder={"Paste your full raw email header here…\n\nReceived: from mail.example.com…\nAuthentication-Results: …\nFrom: …"}
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-green-500/20 focus:outline-none focus:border-green-400/60 transition resize-none text-xs font-mono text-gray-300 placeholder:text-gray-700 leading-relaxed"
            />
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading || !header.trim()}
            className="w-full py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? "Analysing…" : "Run Forensic Analysis"}
          </button>

          {loading && (
            <div className="p-5 bg-black/40 border border-green-500/20 rounded-xl space-y-3">
              {steps.map((step: string) => (
                <div key={step} className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusMsg === step ? "bg-green-400 animate-pulse" : "bg-white/15"}`} />
                  <span className={`text-sm ${statusMsg === step ? "text-gray-200" : "text-gray-600"}`}>{step}</span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {analysis && !loading && (
            <div className="space-y-4">

              {/* Verdict Card */}
              <div className="p-6 bg-black/40 border border-green-500/20 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Verdict</p>
                    <VerdictBadge verdict={analysis.verdict} />
                    {analysis.attacker_technique && (
                      <p className="text-xs text-orange-400/80 font-mono mt-1">⚑ {analysis.attacker_technique}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Risk Score</p>
                    <p className={`text-3xl font-bold ${riskColor!.text}`}>
                      {analysis.risk_score}<span className="text-base text-gray-500 font-normal">/100</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Confidence: {analysis.confidence}%</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full transition-all duration-700 ${riskColor!.bar}`} style={{ width: `${analysis.risk_score}%` }} />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{analysis.summary}</p>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Recommended Action</p>
                  <p className="text-sm text-green-400 font-medium">{analysis.recommended_action}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-black/30 rounded-xl border border-white/5">
                {tabs.map(({ id, label, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                      activeTab === id ? "bg-green-500/15 text-green-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {label}
                    {count !== undefined && count > 0 && (
                      <span className="bg-white/10 text-gray-400 rounded-full px-1.5 py-0.5 text-[10px] leading-none">{count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Auth Tab */}
              {activeTab === "auth" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <AuthBadge label="SPF"   value={analysis.auth.spf}   />
                    <AuthBadge label="DKIM"  value={analysis.auth.dkim}  />
                    <AuthBadge label="DMARC" value={analysis.auth.dmarc} />
                    <AuthBadge label="ARC"   value={analysis.auth.arc}   />
                  </div>
                  <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-3 text-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Sender Identity</p>
                    {[
                      { label: "From Domain",     value: analysis.sender_analysis.from_domain },
                      { label: "Envelope Domain", value: analysis.sender_analysis.envelope_domain },
                      { label: "Reply-To Domain", value: analysis.sender_analysis.reply_to_domain ?? "—" },
                      { label: "Domain Alignment",value: analysis.sender_analysis.domain_alignment },
                      { label: "Domain Age",      value: analysis.sender_analysis.domain_age_estimate },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                        <span className="text-gray-500 text-xs">{label}</span>
                        <span className="font-mono text-gray-300 text-xs">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-500 text-xs">Display Name Spoofing</span>
                      <span className={`text-xs font-medium ${analysis.sender_analysis.display_name_spoofing ? "text-red-400" : "text-green-400"}`}>
                        {analysis.sender_analysis.display_name_spoofing ? "Detected" : "Not detected"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-xs">Free Provider</span>
                      <span className={`text-xs font-medium ${analysis.sender_analysis.free_provider ? "text-yellow-400" : "text-gray-400"}`}>
                        {analysis.sender_analysis.free_provider ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Routing Tab */}
              {activeTab === "routing" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Hops",       value: String(analysis.routing.hop_count) },
                      { label: "Origin IP",  value: analysis.routing.origin_ip ?? "Unknown" },
                      { label: "Origin Geo", value: analysis.routing.origin_geo_estimate ?? "Unknown" },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-sm font-mono font-medium text-gray-200">{value}</p>
                      </div>
                    ))}
                  </div>
                  {analysis.routing.anomalous_routing && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <span className="text-yellow-400 text-sm mt-0.5">⚠</span>
                      <p className="text-sm text-yellow-300">Anomalous routing detected in the relay chain.</p>
                    </div>
                  )}
                  <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Relay Chain</p>
                    {analysis.routing.hops.length === 0 ? (
                      <p className="text-sm text-gray-600">No routing hops extracted.</p>
                    ) : (
                      analysis.routing.hops.map((hop, i) => (
                        <div key={i} className="relative pl-5">
                          {i < analysis.routing.hops.length - 1 && (
                            <div className="absolute left-1.5 top-5 bottom-0 w-px bg-white/10" />
                          )}
                          <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${hop.anomaly ? "bg-yellow-500/20 border-yellow-500" : "bg-green-500/20 border-green-500"}`} />
                          <div className="pb-4">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-mono text-gray-300">{hop.from}</span>
                              <span className="text-gray-600 text-xs">→</span>
                              <span className="text-xs font-mono text-gray-400">{hop.by}</span>
                              {hop.delay_seconds > 30 && (
                                <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">+{hop.delay_seconds}s</span>
                              )}
                            </div>
                            {hop.anomaly && hop.anomaly_reason && (
                              <p className="text-xs text-yellow-400/80">{hop.anomaly_reason}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Findings Tab */}
              {activeTab === "findings" && (
                <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-4">
                  {analysis.technical_findings.length === 0 ? (
                    <div className="flex items-center gap-3 text-green-400 text-sm py-2">
                      <span className="text-lg">✓</span>
                      No suspicious findings in this header.
                    </div>
                  ) : (
                    analysis.technical_findings.map((f, i) => (
                      <div key={i} className={`pb-4 ${i < analysis.technical_findings.length - 1 ? "border-b border-white/5" : ""}`}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-medium text-white">{f.title}</span>
                          <SeverityPill severity={f.severity} />
                          <span className="text-[10px] text-gray-600">{f.category}</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-2">{f.detail}</p>
                        <code className="text-xs font-mono text-green-400/70 bg-white/5 px-2 py-1 rounded block break-all">
                          {f.technical_evidence}
                        </code>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Infrastructure Tab */}
              {activeTab === "infrastructure" && (
                <div className="p-5 bg-black/40 border border-white/5 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Infrastructure Analysis</p>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{analysis.infrastructure_analysis}</p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}

const steps = [
  "Parsing authentication chain (SPF / DKIM / DMARC / ARC)…",
  "Tracing routing hops and origin infrastructure…",
  "Checking domain alignment and sender identity…",
  "Generating forensic threat report…",
];
