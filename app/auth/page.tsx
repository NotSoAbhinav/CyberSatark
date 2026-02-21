"use client";
import Link from "next/link";
import { useState } from "react";
import MatrixBackground from "@/components/MatrixBackground";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/db";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");

    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        setMsg("Account created. You can login.");
        setMode("login");
        return;
      }

      // LOGIN
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // check role
      const role = await getUserRole(cred.user.uid);

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <MatrixBackground />

      <div className="w-full max-w-md bg-[#07142a]/80 backdrop-blur-md border border-[#12345c] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-green-400 text-center mb-2">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <p className="text-gray-300 text-center mb-6">
          {mode === "login"
            ? "Access your CyberSatark account"
            : "Join CyberSatark to start learning cybersecurity"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-[#12345c]"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-[#12345c]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-[#12345c]"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {msg && (
          <p className="text-sm text-green-300 mt-4 text-center">{msg}</p>
        )}

        <div className="mt-6 text-sm text-gray-400 space-y-2 text-center">

          {mode === "login" && (
            <Link href="#" className="block hover:text-green-400">
              Forgot Password?
            </Link>
          )}

          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMode("login");
              setEmail("admin@cybersatark.com");
            }}
            className="block hover:text-green-400"
          >
            Admin Login
          </Link>

          {mode === "login" ? (
            <button
              onClick={() => setMode("signup")}
              className="block w-full text-green-400 hover:underline"
            >
              New user? Sign Up
            </button>
          ) : (
            <button
              onClick={() => setMode("login")}
              className="block w-full text-green-400 hover:underline"
            >
              Already have an account? Login
            </button>
          )}

        </div>
      </div>
    </main>
  );
}