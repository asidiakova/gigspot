"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });
      if (res?.error) {
        if (res.error === "AccountNotFound") {
          setError(`Account for ${identifier} does not exist`);
        } else if (res.error === "InvalidPassword") {
          setError("Invalid password");
        } else if (res.error === "MissingCredentials") {
          setError("Please fill in both fields");
        } else {
          setError("Invalid email or password");
        }
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
          type="text"
          placeholder="Email or nickname"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
