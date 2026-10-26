"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    setPending(false);
    router.refresh();
  }

  return (
    <button
      className={`${pending ? "cursor-progress" : "cursor-pointer"} w-full rounded-md border border-[var(--admin-line)] px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
      type="button"
      onClick={handleSignOut}
      disabled={pending}
    >
      <LogOut size={14} className="mr-1 inline-block" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
