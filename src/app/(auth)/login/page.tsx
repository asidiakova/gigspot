"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password");
        setSubmitting(false);
        return;
      }
      window.location.href = searchParams.get("callbackUrl") ?? "/";
    } catch {
      setError("Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="border px-3 py-2"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>
        {error ? <p className="text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}
