import { ArrowDownToLine, Database, RefreshCw, Upload } from "lucide-react";

const tasks = [
  { title: "Export all data", detail: "Download portfolio content and settings as a JSON backup.", icon: ArrowDownToLine, action: "Export JSON" },
  { title: "Import data", detail: "Restore content from a previously exported JSON backup.", icon: Upload, action: "Choose backup" },
  { title: "Revalidate public site", detail: "Refresh cached public content after admin updates.", icon: RefreshCw, action: "Revalidate now" },
];

export default function Page() {
  return <>
    <div className="mb-6"><p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">PORTFOLIO WORKSPACE</p><h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">Maintenance</h1><p className="text-[13px] text-zinc-500">Back up your content and manage the public site cache.</p></div>
    <div className="grid grid-cols-3 gap-4 max-[850px]:grid-cols-1">{tasks.map(({ title, detail, icon: Icon, action }) => <section className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm" key={title}><div className="mb-4"><h2 className="text-[13px] font-semibold">{title}</h2><p className="mt-1 text-[11px] text-zinc-500">{detail}</p></div><span className="mb-2 grid size-9 place-items-center rounded-lg bg-[#eeedff] text-indigo-700"><Icon size={17} /></span><button type="button" disabled className="mt-2 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-medium text-zinc-600 opacity-60">{action}</button></section>)}</div>
    <section className="mt-4 rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm"><div className="mb-4"><h2 className="text-[13px] font-semibold">System status</h2><p className="mt-1 text-[11px] text-zinc-500">Demo environment status indicators.</p></div><div className="divide-y divide-zinc-100">{[["Firestore data layer","Not connected yet"],["Cloudinary media","Upload route not connected"],["Public cache","Revalidation handler not connected"]].map(([name, status]) => <div className="flex items-center gap-3 py-3" key={name}><Database size={15} className="text-zinc-400" /><strong className="flex-1 text-[11px] font-medium">{name}</strong><span className="text-[10px] text-zinc-500">{status}</span></div>)}</div></section>
  </>;
}
