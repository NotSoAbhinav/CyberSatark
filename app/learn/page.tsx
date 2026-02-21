"use client";
import { useState } from "react";

const chapters = [
  "What is Phishing",
  "How Phishing Works",
  "Types of Phishing",
  "Common Warning Signs",
  "Real-World Examples",
  "How to Stay Safe",
];

export default function LearnPage() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-screen pt-24">
      
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-[#12345c] px-6 py-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-green-400 mb-4">
          Phishing Guide
        </h2>

        <ul className="space-y-2">
          {chapters.map((c, i) => (
            <li
              key={i}
              onClick={() => setActive(i)}
              className={`cursor-pointer px-3 py-2 rounded-lg transition
                ${active === i
                  ? "bg-[#102a4d] text-green-300"
                  : "hover:bg-[#07142a]"}
              `}
            >
              {c}
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto px-12 py-10 max-w-4xl">
        {active === 0 && <WhatIsPhishing />}
        {active === 1 && <HowPhishingWorks />}
        {active === 2 && <TypesOfPhishing />}
        {active === 3 && <WarningSigns />}
        {active === 4 && <Examples />}
        {active === 5 && <StaySafe />}
      </main>
    </div>
  );
}

/* ---------- CHAPTERS ---------- */

function Section({ title, children }: any) {
  return (
    <section className="mb-10">
      <h1 className="text-3xl font-bold text-green-400 mb-4">
        {title}
      </h1>
      <div className="text-gray-300 leading-7 space-y-4">
        {children}
      </div>
    </section>
  );
}

function WhatIsPhishing() {
  return (
    <Section title="What is Phishing">
      <p>
        Phishing is a social engineering attack where attackers
        impersonate trusted entities to trick users into revealing
        sensitive information such as passwords, OTPs, banking
        credentials, or personal data.
      </p>

      <p>
        Attackers commonly use fake emails, SMS messages, websites,
        or social media accounts that appear legitimate. The goal
        is to manipulate victims into taking actions that compromise
        security.
      </p>

      <p>
        Phishing is one of the most widespread cyber threats because
        it exploits human trust rather than technical vulnerabilities.
      </p>
    </Section>
  );
}

function HowPhishingWorks() {
  return (
    <Section title="How Phishing Works">
      <p>Phishing attacks typically follow a predictable sequence:</p>

      <ul className="list-disc ml-6">
        <li>Attacker crafts a fake message or website</li>
        <li>Message appears to come from trusted source</li>
        <li>Victim is pressured to act quickly</li>
        <li>User clicks link or submits credentials</li>
        <li>Attacker steals information</li>
      </ul>

      <p>
        Psychological manipulation such as urgency, fear, or rewards
        is used to bypass rational judgment.
      </p>
    </Section>
  );
}

function TypesOfPhishing() {
  return (
    <Section title="Types of Phishing">
      <ul className="list-disc ml-6">
        <li><b>Email Phishing:</b> Fake bank or service emails</li>
        <li><b>SMS Phishing (Smishing):</b> Fraudulent text messages</li>
        <li><b>Spear Phishing:</b> Targeted attacks on individuals</li>
        <li><b>Clone Phishing:</b> Copy of legitimate message</li>
        <li><b>Social Media Phishing:</b> Fake profiles or links</li>
      </ul>

      <p>
        Each type uses different channels but the same goal:
        credential theft or malware delivery.
      </p>
    </Section>
  );
}

function WarningSigns() {
  return (
    <Section title="Common Warning Signs">
      <ul className="list-disc ml-6">
        <li>Urgent or threatening language</li>
        <li>Unexpected links or attachments</li>
        <li>Mismatched domain names</li>
        <li>Requests for passwords or OTPs</li>
        <li>Spelling or grammar errors</li>
        <li>Unknown sender address</li>
      </ul>

      <p>
        Legitimate organizations rarely request sensitive information
        through email or SMS.
      </p>
    </Section>
  );
}

function Examples() {
  return (
    <Section title="Real-World Phishing Examples">
      <p><b>Bank Alert:</b> “Your account will be blocked. Verify now.”</p>
      <p><b>Delivery Scam:</b> “Package pending. Pay shipping fee.”</p>
      <p><b>Password Reset:</b> “Suspicious login detected.”</p>
      <p><b>Job Offer:</b> “You are selected. Submit details.”</p>

      <p>
        These messages create urgency or opportunity to trick users
        into clicking malicious links.
      </p>
    </Section>
  );
}

function StaySafe() {
  return (
    <Section title="How to Stay Safe">
      <ul className="list-disc ml-6">
        <li>Verify sender domain carefully</li>
        <li>Do not click unknown links</li>
        <li>Never share OTP or password</li>
        <li>Check website URL authenticity</li>
        <li>Use phishing detection tools</li>
        <li>Enable multi-factor authentication</li>
      </ul>

      <p>
        Awareness and verification are the strongest defenses against
        phishing attacks.
      </p>
    </Section>
  );
}