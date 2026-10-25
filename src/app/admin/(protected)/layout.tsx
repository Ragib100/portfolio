import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen px-6 py-16"
          aria-busy="true"
        >
          Loading admin…
        </main>
      }
    >
      <AdminSessionGuard>{children}</AdminSessionGuard>
    </Suspense>
  );
}

async function AdminSessionGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return children;
}