"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleReset = async () => {
    if (!email) {
      setStatus("Enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("Reset link sent. Check your email.");
    } catch {
      setStatus("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 border rounded-lg w-80 space-y-4">

        <h1 className="text-xl font-bold text-center">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-2 border rounded bg-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-green-400 text-black p-2 rounded"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center">{status}</p>

        <Link href="/login" className="text-green-400 text-sm block text-center">
          Back to Login
        </Link>

      </div>
    </div>
  );
}