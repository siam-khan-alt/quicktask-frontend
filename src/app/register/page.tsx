"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const LBL_CLS = "block text-sm font-medium text-zinc-300 mb-1";
const INP_CLS = "w-full rounded-xl border border-border-muted bg-surface px-4 py-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none transition-colors pr-10";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/register", form);
      toast.success("🎉 Account created successfully! Please login.");
      router.push("/login");
    } catch (err) {
      const errMsg = (err as AxiosError<{ error: string }>).response?.data?.error || "Registration failed. Try again.";
      toast.error(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
        <p className="text-zinc-400 text-sm mb-6">Get started with QuickTask today.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className={LBL_CLS}>Full Name</label>
            <input
              type="text"
              required
              className={INP_CLS}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className={LBL_CLS}>Email Address</label>
            <input
              type="email"
              required
              className={INP_CLS}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className={LBL_CLS}>Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                className={INP_CLS}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}