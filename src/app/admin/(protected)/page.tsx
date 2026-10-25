import { Suspense } from "react";
import { connection } from "next/server";
import { SignOutButton } from "@/app/admin/sign-out-button";
import { getAdminSession } from "@/lib/auth/session";

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <main
          className="mx-auto w-full max-w-4xl flex-1 px-6 py-16"
          aria-busy="true"
        >
          Loading admin dashboard…
        </main>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  await connection();

  const session = await getAdminSession();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <header className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--accent)]">
            Portfolio
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Admin dashboard
          </h1>

          <p className="text-[var(--muted)]">
            Signed in as {session?.email}
          </p>
        </div>

        <SignOutButton />
      </header>

      <section className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-medium">
          Your admin area is ready
        </h2>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Content management tools will appear here as they are added.
        </p>
      </section>
    </main>
  );
}