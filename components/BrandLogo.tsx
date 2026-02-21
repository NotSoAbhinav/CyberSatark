"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function BrandLogo() {
  return (
    <Link
      href="/"
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        borderRadius: "999px",
        border: "1px solid #12345c",
        background: "rgba(7,20,42,0.8)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        color: "#22c55e",
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      <ShieldCheck size={20} />
      CyberSatark
    </Link>
  );
}