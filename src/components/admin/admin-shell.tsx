"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Eye,
  FileText,
  FolderKanban,
  GitBranch,
  Globe2,
  LayoutDashboard,
  Mail,
  Settings2,
  Sparkles,
  Trophy,
  Upload,
  Users,
} from "lucide-react";
import { SignOutButton } from "@/app/admin/sign-out-button";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: Eye },
  { label: "Profile", href: "/admin/profile", icon: Users },
  { label: "Contact & links", href: "/admin/contact", icon: Mail },
  { label: "CV manager", href: "/admin/cv", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Contests", href: "/admin/contests", icon: Trophy },
  { label: "Experience", href: "/admin/experience", icon: BriefcaseBusiness },
  { label: "Skills", href: "/admin/skills", icon: Sparkles },
  { label: "Integrations", href: "/admin/integrations", icon: GitBranch },
  { label: "Media library", href: "/admin/media", icon: Upload },
  { label: "Maintenance", href: "/admin/maintenance", icon: Settings2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f8f8fa] text-zinc-900">
      <aside className="sticky top-0 flex h-dvh w-[252px] shrink-0 flex-col overflow-hidden border-r border-[var(--admin-line)] bg-[var(--admin-sidebar)] px-[15px] py-6 max-[1050px]:w-[220px] max-[1050px]:shrink-0 max-[760px]:relative max-[760px]:grid max-[760px]:h-auto max-[760px]:w-auto max-[760px]:grid-cols-[1fr_auto] max-[760px]:grid-rows-[auto_auto] max-[760px]:items-center max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:px-4 max-[760px]:py-3">
        <div className="flex items-center gap-2.5 rounded-[9px] border border-[var(--admin-line)] bg-white p-2.5 max-[760px]:hidden">
          <div className="grid size-[31px] place-items-center rounded-[9px] border border-[#d9d6fe] bg-[#eeedff] font-semibold text-[#5145cd]">
            R
          </div>
          <div>
            <p className="text-sm font-semibold">Personal site</p>
            <p className="text-xs text-[var(--admin-subtle)]">Workspace</p>
          </div>
        </div>
        <nav
          aria-label="Admin navigation"
          className="mt-[30px] min-h-0 flex-1 overflow-y-auto max-[760px]:col-span-2 max-[760px]:row-start-2 max-[760px]:mt-3 max-[760px]:flex max-[760px]:gap-1.5 max-[760px]:overflow-x-auto max-[760px]:overflow-y-hidden max-[760px]:pb-0.5"
        >
          <p className="mb-2 px-2.5 text-[10px] font-semibold tracking-[.08em] text-zinc-400 max-[760px]:hidden">
            WORKSPACE
          </p>
          {navigation.slice(0, 1).map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
          <Link
            className="flex min-h-[38px] items-center gap-[11px] rounded-[7px] px-2.5 text-[13px] text-[#5c5c65] no-underline hover:bg-zinc-100 max-[760px]:hidden"
            href="/"
            target="_blank"
          >
            <Globe2 size={17} />
            My portfolio
            <ArrowUpRight size={13} className="ml-auto" />
          </Link>
          <p className="mb-2 mt-7 px-2.5 text-[10px] font-semibold tracking-[.08em] text-zinc-400 max-[760px]:hidden">
            CONTENT
          </p>
          {navigation.slice(2, 11).map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              }
            />
          ))}
          <p className="mb-2 mt-7 px-2.5 text-[10px] font-semibold tracking-[.08em] text-zinc-400 max-[760px]:hidden">
            SYSTEM
          </p>
          {navigation.slice(11).map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-[var(--admin-line)] pt-3 max-[760px]:col-start-2 max-[760px]:row-start-1 max-[760px]:mt-0 max-[760px]:border-0 max-[760px]:p-0">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden max-[760px]:h-auto">
        <header className="sticky top-0 z-10 flex h-[65px] shrink-0 items-center justify-between border-b border-[var(--admin-line)] bg-white px-[38px] max-[1050px]:px-6 max-[760px]:h-[52px] max-[760px]:px-4">
          <div className="text-xs text-zinc-500">
            Admin <span className="px-2 text-zinc-300">/</span>
            <strong className="font-medium text-zinc-800">
              {navigation.find((item) => item.href === pathname)?.label ??
                "Editor"}
            </strong>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="flex items-center gap-1.5 text-xs text-zinc-700 no-underline"
              href="/"
              target="_blank"
            >
              View site <ArrowUpRight size={14} />
            </Link>
          </div>
        </header>
        <div className="mx-0 min-h-0 w-full flex-1 overflow-y-auto px-[38px] py-[26px] max-[1050px]:px-6 max-[760px]:px-4 max-[760px]:py-[18px]">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({
  label,
  href,
  icon: Icon,
  active,
}: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      className={`my-0.5 flex min-h-[38px] items-center gap-[11px] rounded-[7px] px-2.5 text-[13px] no-underline max-[760px]:min-h-8 max-[760px]:shrink-0 ${active ? "bg-[#eeedff] font-semibold text-[#4f46c8]" : "text-[#5c5c65] hover:bg-zinc-100"}`}
      href={href}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}
