import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 TEMP TEST RESPONSE (to verify frontend works)
    return NextResponse.json({
      content: [
        {
          text: JSON.stringify({
            verdict: "UNCERTAIN",
            confidence: 50,
            risk_score: 30,
            summary: "Test response working",
            auth: { spf: "unknown", dkim: "unknown", dmarc: "unknown", arc: "unknown" },
            sender_analysis: {
              from_domain: "test.com",
              envelope_domain: "test.com",
              reply_to_domain: null,
              domain_alignment: "aligned",
              domain_age_estimate: "unknown",
              display_name_spoofing: false,
              free_provider: false
            },
            routing: {
              hops: [],
              hop_count: 0,
              origin_ip: null,
              origin_geo_estimate: null,
              anomalous_routing: false
            },
            technical_findings: [],
            infrastructure_analysis: "Test infra",
            attacker_technique: null,
            recommended_action: "None"
          })
        }
      ]
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}