"use client";

import React from "react";

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5">
      {messages.map((msg, idx) => (
        <li key={idx} className="text-sm text-red-500">
          {msg}
        </li>
      ))}
    </ul>
  );
}
