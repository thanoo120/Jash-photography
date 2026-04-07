"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui/index";
import { loginUser, registerUser } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response =
      mode === "login"
        ? await loginUser(email, password)
        : await registerUser(fullName, email, password, phone);

    setLoading(false);

    if (!response) {
      setError("Authentication failed. Check credentials and backend status.");
      return;
    }

    saveAuthSession(response.accessToken, response.refreshToken, response.user);
    router.push("/booking");
    router.refresh();
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream dark:bg-obsidian-950">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-obsidian-900 border border-obsidian-200 dark:border-obsidian-800 rounded-sm p-8">
          <h1 className="font-display text-3xl text-obsidian-900 dark:text-obsidian-50 mb-2">
            {mode === "login" ? "Login" : "Create Account"}
          </h1>
          <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mb-6">
            {mode === "login"
              ? "Sign in to book services and manage your profile."
              : "Register to continue with booking and protected features."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <Input
                id="fullName"
                name="fullName"
                label="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "register" && (
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </Button>
          </form>

          <div className="mt-5 text-sm text-obsidian-500 dark:text-obsidian-400">
            {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-gold-600 dark:text-gold-400"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </div>
          <Link href="/" className="block mt-3 text-xs text-obsidian-400 hover:text-obsidian-600">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
