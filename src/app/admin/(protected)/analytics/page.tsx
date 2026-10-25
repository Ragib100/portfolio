import { ArrowDownToLine, Eye, Users } from "lucide-react";
import { TrafficBarChart } from "@/components/admin/traffic-bar-chart";

const metrics = [["Views","2,846",Eye],["Unique visitors","1,204",Users],["CV downloads","86",ArrowDownToLine]] as const;
const sources = [["Direct", "1,208", "42.5%"],["Google", "824", "28.9%"],["LinkedIn", "516", "18.1%"],["Other", "298", "10.5%"]];

export default function Page() {
  return <>
    <div className="mb-6"><p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">PORTFOLIO WORKSPACE</p><h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">Analytics</h1><p className="text-[13px] text-zinc-500">Sample visits, CV activity, referrers, and links for the last 30 days.</p></div>
    <div className="mb-4 grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">{metrics.map(([label, value, Icon]) => <article className="flex items-center gap-3 rounded-lg border border-[var(--admin-line)] bg-white p-4" key={label}><span className="grid size-9 place-items-center rounded-lg bg-[#eeedff] text-[#5950ce]"><Icon size={17} /></span><span><small className="block text-[10px] text-zinc-500">{label}</small><strong className="mt-0.5 block text-xl font-semibold">{value}</strong></span></article>)}</div>
    <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)] gap-4 max-[850px]:grid-cols-1"><section className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px]"><h2 className="text-[13px] font-semibold">Daily traffic</h2><p className="mt-1 text-[11px] text-zinc-500">Demo page views by date</p><TrafficBarChart /></section><section className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px]"><h2 className="text-[13px] font-semibold">Top referrers</h2><p className="mt-1 text-[11px] text-zinc-500">Traffic source breakdown</p><div className="mt-4">{sources.map(([source, views, share]) => <div className="border-t border-zinc-100 py-3" key={source}><div className="flex justify-between text-[11px]"><strong className="font-medium">{source}</strong><span className="text-zinc-500">{views} · {share}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-indigo-400" style={{ width: share }} /></div></div>)}</div></section></div>
  </>;
}
