"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname, role }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Unable to sign up");
        setSubmitting(false);
        return;
      }
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (login?.error) {
        router.replace("/login");
        return;
      }
      router.refresh();
      router.replace("/");
    } catch {
      setError("Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl mb-4">Sign up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="border p-2"
        />
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
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="border p-2"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "organizer")}
          className="border p-2"
        >
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="border px-3 py-2"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
        {error ? <p className="text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}
