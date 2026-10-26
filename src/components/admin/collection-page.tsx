import { ArrowUpRight, Eye, Plus } from "lucide-react";
import type { ReactNode } from "react";

export type AdminRecord = { title: string; detail: string; status: string };

export function CollectionPage({ title, description, action, fields, records, children }: { title: string; description: string; action: string; fields: string[]; records: AdminRecord[]; children?: ReactNode }) {
  return <>
    <div className="mb-6 flex items-end justify-between gap-5 max-[760px]:items-start"><div><p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">PORTFOLIO WORKSPACE</p><h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">{title}</h1><p className="text-[13px] text-zinc-500">{description}</p></div><button className="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2.5 text-xs font-medium text-white opacity-70" type="button" disabled title="Action will be connected later"><Plus size={15} />{action}</button></div>
    {children}
    <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(320px,1fr)] items-start gap-4 max-[900px]:grid-cols-1">
      <div className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm"><div className="mb-4"><h2 className="text-[13px] font-semibold">Current entries</h2><p className="mt-1 text-[11px] text-zinc-500">Demo records shown for preview; these are not stored in the database.</p></div>
        <div className="-mt-2">{records.map((record) => <div className="flex min-h-[62px] items-center gap-3 border-t border-zinc-100" key={record.title}><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-600"><Eye size={16} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium text-zinc-800">{record.title}</strong><small className="mt-1 block text-[10px] text-zinc-500">{record.detail}</small></span><span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[9px] font-medium text-zinc-600">{record.status}</span><button className="rounded px-1.5 text-zinc-400" type="button" disabled aria-label={`Edit ${record.title}`}>•••</button></div>)}</div>
        <button className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-indigo-700 opacity-60" type="button" disabled><Plus size={14} />Load more</button>
      </div>
      <div id="editor" className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm"><div className="mb-4"><h2 className="text-[13px] font-semibold">New entry</h2><p className="mt-1 text-[11px] text-zinc-500">Example editor form. Save handler will be connected to the data layer later.</p></div>
        <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">{fields.map((field) => <label key={field} className={`flex flex-col gap-1.5 text-[11px] font-medium text-zinc-600 ${/description|highlights|summary/i.test(field) ? "col-span-2 max-[500px]:col-span-1" : ""}`}><span>{field}</span>{/description|highlights/i.test(field) ? <textarea className="rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-[var(--accent)]" rows={3} placeholder={`Enter ${field.toLowerCase()}`} /> : <input className="rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-[var(--accent)]" type={/date/i.test(field) ? "date" : "text"} placeholder={`Enter ${field.toLowerCase()}`} />}</label>)}</div>
        <label className="mt-4 flex items-center gap-2 text-[11px] text-zinc-600"><input type="checkbox" className="accent-indigo-600" />Publish on portfolio</label>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4"><span className="text-[10px] text-zinc-500">Demo data · Changes are not saved</span><button className="rounded-md bg-[var(--accent)] px-3 py-2 text-[11px] font-medium text-white opacity-60" type="button" disabled>Save draft</button></div>
      </div>
    </div>
    <p className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-500">Demo content only <ArrowUpRight size={11} /> API and server action handlers will be added in Phase 2.</p>
  </>;
}
