"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Hotel, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@hotelrajhansinternational.com");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/ranjhans/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120d0a] text-cream flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#1d1612] border border-gold-400/20 rounded-2xl shadow-2xl overflow-hidden relative z-10 p-8">
        {/* Header Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-400 mb-2">
            <Hotel className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-gold-200 font-semibold tracking-wide">
            Rajhans Admin
          </h1>
          <p className="text-xs text-gold-200/60 uppercase tracking-widest font-mono">
            Hotel Management System Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold-200/70 mb-2 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotelrajhansinternational.com"
                className="w-full bg-[#140e0b] border border-gold-400/20 rounded-lg py-3 pl-10 pr-4 text-sm text-gold-100 placeholder-gold-200/20 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gold-200/70 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#140e0b] border border-gold-400/20 rounded-lg py-3 pl-10 pr-4 text-sm text-gold-100 placeholder-gold-200/20 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gold-200/60 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-gold-500 bg-[#140e0b] border-gold-400/30"
              />
              <span>Remember me</span>
            </label>
            <span className="flex items-center gap-1 text-[10px] text-gold-400">
              <ShieldCheck className="h-3.5 w-3.5" /> 256-bit Encrypted
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-bold uppercase tracking-widest text-xs py-3.5 px-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? "Authenticating..." : "Login to Management Portal"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold-400/10 text-center text-[10px] text-gold-200/40 uppercase tracking-widest">
          Hotel Rajhans International Management System v1.0
        </div>
      </div>
    </div>
  );
}
