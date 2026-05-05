"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

interface AnalysisResult {
  verdict: "safe" | "suspicious" | "dangerous" | "unknown";
  score: number;
  summary: string;
  categories: {
    label: string;
    status: "ok" | "warn" | "danger" | "info";
    detail: string;
  }[];
  finalVerdict: string;
}

export default function URLChecker() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStage, setLoadingStage] = useState("");

  const analyzeURL = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setAnalysis(null);
    setError("");
    setLoadingStage("Sending URL to AI for deep analysis...");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a cybersecurity URL analyzer. Analyze the given URL deeply and return ONLY a valid JSON object with no markdown, no code fences, no preamble.

Analyze the URL across these dimensions:
1. Domain reputation & legitimacy (Is the domain trustworthy? Known brand? Newly registered pattern?)
2. URL structure (suspicious paths, encoded chars, obfuscation, misleading subdomain tricks)
3. Content intent inference (What does this URL appear to try to do based on path/params/keywords?)
4. Phishing signals (brand impersonation, typosquatting, lookalike domains)
5. Technical red flags (IP-based URLs, unusual ports, redirect chains, URL shorteners)
6. SSL/HTTPS posture
7. Overall trustworthiness

Return this exact JSON structure:
{
  "verdict": "safe" | "suspicious" | "dangerous" | "unknown",
  "score": <0-100, where 0=completely safe, 100=definitely malicious>,
  "summary": "<2-3 sentence natural language summary of what this URL appears to be and why>",
  "categories": [
    { "label": "Domain Legitimacy", "status": "ok"|"warn"|"danger"|"info", "detail": "<specific finding>" },
    { "label": "URL Structure", "status": "ok"|"warn"|"danger"|"info", "detail": "<specific finding>" },
    { "label": "Content Intent", "status": "ok"|"warn"|"danger"|"info", "detail": "<specific finding>" },
    { "label": "Phishing Signals", "status": "ok"|"warn"|"danger"|"info", "detail": "<specific finding>" },
    { "label": "Technical Flags", "status": "ok"|"warn"|"danger"|"info", "detail": "<specific finding>" },
    { "label": "HTTPS/SSL", "status": "ok"|"warn"|"danger"|"info", "detail": "<specific finding>" }
  ],
  "finalVerdict": "<1 sentence direct recommendation e.g. 'Do not visit this URL' or 'This appears to be a legitimate website'>"
}`,
          messages: [
            {
              role: "user",
              content: `Analyze this URL: ${trimmed}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const text = data.content?.map((b: any) => b.text || "").join("") ?? "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: AnalysisResult = JSON.parse(clean);
      setAnalysis(parsed);
    } catch (err: any) {
      setError("Analysis failed. Please check the URL and try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const getVerdictConfig = () => {
    if (!analysis) return { color: "#6b7280", label: "", bg: "transparent", border: "transparent" };
    switch (analysis.verdict) {
      case "safe":
        return { color: "#22c55e", label: "Safe", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)" };
      case "suspicious":
        return { color: "#f59e0b", label: "Suspicious", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" };
      case "dangerous":
        return { color: "#ef4444", label: "Dangerous", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" };
      default:
        return { color: "#6b7280", label: "Unknown", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.25)" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok": return { icon: "✓", color: "#22c55e" };
      case "warn": return { icon: "!", color: "#f59e0b" };
      case "danger": return { icon: "✗", color: "#ef4444" };
      default: return { icon: "i", color: "#60a5fa" };
    }
  };

  const verdict = getVerdictConfig();

  return (
    <>
      <Navbar />

      <div style={{
        minHeight: "100vh",
        background: "#080d18",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "7rem 1.5rem 4rem",
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem", maxWidth: "640px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "20px",
            padding: "4px 14px",
            fontSize: "12px",
            color: "#4ade80",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            AI-Powered Analysis
          </div>
          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            color: "#f1f5f9",
            margin: "0 0 0.75rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2
          }}>
            URL Security Analyzer
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
            Deep AI analysis — not just pattern matching. Understands domain reputation, intent, phishing tactics, and technical structure.
          </p>
        </div>

        {/* Input Area */}
        <div style={{ width: "100%", maxWidth: "680px" }}>
          <div style={{
            display: "flex",
            gap: "10px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "8px",
            marginBottom: "1.5rem"
          }}>
            <input
              type="text"
              placeholder="Paste any URL to analyze — e.g. https://example.com/login"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && analyzeURL()}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e2e8f0",
                fontSize: "14px",
                padding: "10px 14px",
              }}
            />
            <button
              onClick={analyzeURL}
              disabled={loading || !url.trim()}
              style={{
                background: loading ? "rgba(34,197,94,0.3)" : "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 22px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading || !url.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                opacity: !url.trim() ? 0.5 : 1
              }}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "2px solid rgba(34,197,94,0.2)",
                borderTop: "2px solid #22c55e",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 1rem"
              }} />
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                {loadingStage || "Analyzing URL with AI..."}
              </p>
              <p style={{ color: "#475569", fontSize: "12px", margin: "4px 0 0" }}>
                Checking domain reputation, structure, intent & phishing signals
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              color: "#fca5a5",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Results */}
          {analysis && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Verdict Banner */}
              <div style={{
                background: verdict.bg,
                border: `1px solid ${verdict.border}`,
                borderRadius: "14px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem"
              }}>
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: `${verdict.color}22`,
                  border: `2px solid ${verdict.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: "22px", color: verdict.color, fontWeight: 700 }}>
                    {analysis.verdict === "safe" ? "✓" : analysis.verdict === "dangerous" ? "✗" : "!"}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: verdict.color }}>{verdict.label}</span>
                    <span style={{
                      background: `${verdict.color}22`,
                      color: verdict.color,
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: "20px",
                      border: `1px solid ${verdict.color}33`
                    }}>Risk: {analysis.score}/100</span>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "14px", margin: "0 0 8px", lineHeight: 1.6 }}>
                    {analysis.summary}
                  </p>
                  <p style={{
                    fontSize: "13px",
                    color: verdict.color,
                    fontWeight: 500,
                    margin: 0,
                    padding: "8px 12px",
                    background: `${verdict.color}11`,
                    borderRadius: "8px",
                    border: `1px solid ${verdict.color}22`
                  }}>
                    {analysis.finalVerdict}
                  </p>
                </div>
              </div>

              {/* Risk Score Bar */}
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "1rem 1.25rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk Score</span>
                  <span style={{ fontSize: "12px", color: verdict.color, fontWeight: 600 }}>{analysis.score}%</span>
                </div>
                <div style={{
                  height: "6px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${analysis.score}%`,
                    background: analysis.score < 30 ? "#22c55e" : analysis.score < 60 ? "#f59e0b" : "#ef4444",
                    borderRadius: "3px",
                    transition: "width 0.8s ease"
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#22c55e" }}>Safe</span>
                  <span style={{ fontSize: "11px", color: "#f59e0b" }}>Suspicious</span>
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>Dangerous</span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}>
                <p style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
                  Detailed Findings
                </p>
                {analysis.categories.map((cat, i) => {
                  const s = getStatusIcon(cat.status);
                  return (
                    <div key={i} style={{
                      display: "flex",
                      gap: "12px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.02)",
                      alignItems: "flex-start"
                    }}>
                      <div style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: `${s.color}22`,
                        border: `1px solid ${s.color}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                        color: s.color,
                        marginTop: "1px"
                      }}>
                        {s.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0", display: "block", marginBottom: "2px" }}>
                          {cat.label}
                        </span>
                        <span style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                          {cat.detail}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <p style={{ fontSize: "11px", color: "#334155", textAlign: "center", margin: "4px 0 0" }}>
                AI analysis is informational only. Always exercise caution with unknown links.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
