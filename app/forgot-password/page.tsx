"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-gray-200">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#07142a] border border-[#12345c] p-8 rounded-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-green-400 text-center">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-400 text-center">
          Enter your email to receive a reset link
        </p>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#020617] border border-[#12345c] outline-none focus:border-green-400"
        />

        {/* BUTTON */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-green-400 text-black font-semibold py-2 rounded-lg hover:bg-green-300 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* SUCCESS MESSAGE */}
        {message && (
          <p className="text-green-400 text-sm text-center">{message}</p>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* BACK TO LOGIN */}
        <div className="text-center text-sm">
          <Link href="/login" className="text-green-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>

    </div>
  );
}