import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Eye,
  FileText,
  FolderKanban,
  Trophy,
  Users,
} from "lucide-react";
import { TrafficBarChart } from "@/components/admin/traffic-bar-chart";

const cards = [
  {
    name: "Portfolio views",
    value: "2,846",
    note: "+12.8% vs previous 30 days",
    icon: Eye,
    color: "bg-[#eeedff] text-[#5950ce]",
  },
  {
    name: "Unique visitors",
    value: "1,204",
    note: "+8.2% vs previous 30 days",
    icon: Users,
    color: "bg-sky-50 text-sky-700",
  },
  {
    name: "CV downloads",
    value: "86",
    note: "+18.4% vs previous 30 days",
    icon: ArrowDownToLine,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Published projects",
    value: "5",
    note: "1 draft awaiting review",
    icon: FolderKanban,
    color: "bg-amber-50 text-amber-700",
  },
];

export default function Page() {
  return (
    <>
      <section className="mb-[22px] flex items-end justify-between gap-5 max-[760px]:items-start">
        <div>
          <p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">
            SUNDAY, OCTOBER 25, 2026
          </p>
          <h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">
            Good morning, Ragib{" "}
            <span className="align-[3px] text-lg text-amber-500">✦</span>
          </h1>
          <p className="text-[13px] text-zinc-500">
            Here’s what’s happening with your portfolio.
          </p>
        </div>
      </section>
      <section
        className="grid grid-cols-4 gap-[15px] max-[1050px]:grid-cols-2 max-[500px]:gap-2"
        aria-label="Portfolio summary"
      >
        {cards.map(({ name, value, note, icon: Icon, color }, i) => (
          <article
            className="rounded-[9px] border border-[var(--admin-line)] bg-white p-4 shadow-sm max-[500px]:p-3"
            key={name}
          >
            <div className="flex items-center justify-between gap-1 text-xs text-zinc-600 max-[500px]:text-[10px]">
              <span>{name}</span>
              <span
                className={`grid size-[31px] shrink-0 place-items-center rounded-lg ${color}`}
              >
                <Icon size={17} />
              </span>
            </div>
            <div className="mt-3 text-[27px] font-semibold tracking-tight max-[500px]:text-[23px]">
              {value}
            </div>
            <div
              className={`mt-2 text-[10px] ${i < 3 ? "font-medium text-emerald-700" : "text-zinc-500"}`}
            >
              {note}
            </div>
          </article>
        ))}
      </section>
      <section className="mt-4 grid grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] gap-[15px] max-[760px]:grid-cols-1">
        <article className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-semibold">Traffic overview</h2>
              <p className="mt-1 text-[11px] text-zinc-500">
                Portfolio visits over time
              </p>
            </div>
            <select
              className="rounded-md border border-[var(--admin-line)] bg-white px-2 py-1.5 text-[10px] text-zinc-600"
              aria-label="Traffic date range"
              defaultValue="30"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div className="mt-[19px] flex items-center gap-2">
            <strong className="text-[22px] tracking-tight">2,846</strong>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
              <ArrowUpRight size={13} />
              12.8%
            </span>
            <small className="text-[10px] text-zinc-400">
              compared to previous period
            </small>
          </div>
          <TrafficBarChart />
        </article>
        <article className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
          <div>
            <h2 className="text-[13px] font-semibold">Content</h2>
            <p className="mt-1 text-[11px] text-zinc-500">
              Your portfolio at a glance
            </p>
          </div>
          <div className="mt-3">
            {[
              [
                "Projects",
                "5 published · 1 draft",
                FolderKanban,
                "/admin/projects",
              ],
              ["Contests", "9 results · 2 drafts", Trophy, "/admin/contests"],
              [
                "Experience",
                "4 entries published",
                FileText,
                "/admin/experience",
              ],
            ].map(([label, detail, Icon, href]) => (
              <Link
                key={String(label)}
                className="flex min-h-[53px] items-center gap-2.5 border-b border-zinc-100 text-inherit no-underline last:border-b-0"
                href={String(href)}
              >
                <span className="grid size-[31px] place-items-center rounded-lg bg-zinc-100 text-zinc-600">
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[11px] font-medium">
                    {String(label)}
                  </strong>
                  <small className="mt-0.5 block text-[10px] text-zinc-500">
                    {String(detail)}
                  </small>
                </span>
                <ArrowUpRight size={15} className="text-zinc-400" />
              </Link>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50/50 p-2.5">
            <span className="size-[7px] rounded-full bg-emerald-600" />
            <span className="flex-1">
              <strong className="block text-[11px] font-medium">
                Website is live
              </strong>
              <small className="block text-[10px] text-emerald-600">
                All systems operational
              </small>
            </span>
          </div>
        </article>
      </section>
      <section className="mt-[15px] rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold">Recent activity</h2>
            <p className="mt-1 text-[11px] text-zinc-500">
              Sample visitor activity
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[1.15fr_1fr_100px] gap-3 border-b border-[var(--admin-line)] pb-2 text-[9px] font-semibold tracking-wider text-zinc-400 max-[500px]:grid-cols-[minmax(125px,1.2fr)_minmax(75px,1fr)_54px] max-[500px]:gap-1">
          <span>EVENT</span>
          <span>SOURCE</span>
          <span className="text-right">WHEN</span>
        </div>
        {[
          ["Portfolio viewed", "Direct · Dhaka, Bangladesh", "2 min ago"],
          ["CV downloaded", "LinkedIn · Dhaka, Bangladesh", "18 min ago"],
          ["Project link clicked", "Pathao Clone · GitHub", "46 min ago"],
          ["Portfolio viewed", "Google · Chattogram, Bangladesh", "1 hr ago"],
        ].map(([title, detail, time], i) => (
          <div
            className="grid min-h-[46px] grid-cols-[1.15fr_1fr_100px] items-center gap-3 border-b border-zinc-100 text-[10px] last:border-0 max-[500px]:grid-cols-[minmax(125px,1.2fr)_minmax(75px,1fr)_54px] max-[500px]:gap-1"
            key={`${title}-${time}`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`grid size-[27px] shrink-0 place-items-center rounded-lg ${i === 1 ? "bg-emerald-50 text-emerald-700" : i === 2 ? "bg-sky-50 text-sky-700" : "bg-[#f1f0ff] text-[#665fd0]"}`}
              >
                <Eye size={15} />
              </span>
              <strong className="font-medium max-[500px]:text-[9px]">
                {title}
              </strong>
            </span>
            <span className="truncate text-zinc-500">{detail}</span>
            <span className="text-right text-zinc-500">{time}</span>
          </div>
        ))}
      </section>
    </>
  );
}
