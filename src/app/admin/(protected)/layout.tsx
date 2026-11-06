import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLoading } from "@/components/admin/admin-loading";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={<AdminLoading />}
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
  if (!session) redirect("/admin/login?invalid=1");

  return <AdminShell>{children}</AdminShell>;
}