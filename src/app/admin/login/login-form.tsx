"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSignIn() {
    setError(null);
    setPending(true);

    try {
      const auth = getFirebaseAuth();
      await setPersistence(auth, inMemoryPersistence);
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      await signOut(auth);
      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : "Sign-in failed. Please try again.";
        throw new Error(message);
      }

      router.push("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        className={`${pending ? "cursor-progress" : "cursor-pointer"} w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-medium transition hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
        type="button"
        onClick={handleSignIn}
        disabled={pending}
      >
        {pending ? "Signing in…" : "Continue with Google"}
      </button>
      {error ? <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p> : null}
    </div>
  );
}
