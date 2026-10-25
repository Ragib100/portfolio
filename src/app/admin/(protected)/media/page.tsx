import { FileImage, FileText, Plus, Search, Upload } from "lucide-react";

const files = [
  { name: "profile-photo.jpg", folder: "portfolio/profile", size: "420 KB", type: "image" },
  { name: "project-dashboard.png", folder: "portfolio/projects", size: "1.2 MB", type: "image" },
  { name: "resume-oct-2026.pdf", folder: "portfolio/cv", size: "188 KB", type: "document" },
];

export default function Page() {
  return <>
    <div className="mb-6 flex items-end justify-between gap-5 max-[760px]:items-start"><div><p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">PORTFOLIO WORKSPACE</p><h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">Media library</h1><p className="text-[13px] text-zinc-500">Browse images and documents used across your portfolio.</p></div><button className="flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2.5 text-xs font-medium text-white opacity-60" disabled type="button"><Plus size={14} />Upload media</button></div>
    <section className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm"><div className="mb-4"><h2 className="text-[13px] font-semibold">Files</h2><p className="mt-1 text-[11px] text-zinc-500">Demo assets only · Cloudinary listing and deletion will be connected later.</p></div><div className="mb-4 flex items-center justify-between gap-3"><label className="flex w-full max-w-sm items-center gap-2 rounded-md border border-zinc-200 px-2.5 py-2 text-zinc-400"><Search size={14} /><input className="w-full text-xs outline-none" placeholder="Search media" /></label><select className="rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-600"><option>All folders</option><option>Projects</option><option>CV</option><option>Profile</option></select></div><div className="grid grid-cols-3 gap-3 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1">{files.map((file) => <article className="overflow-hidden rounded-lg border border-zinc-200" key={file.name}><div className="grid h-32 place-items-center bg-zinc-100 text-zinc-400">{file.type === "image" ? <FileImage size={30} /> : <FileText size={30} />}</div><div className="p-3"><div className="flex items-start justify-between gap-2"><strong className="truncate text-[11px] font-medium">{file.name}</strong><span className="rounded-full bg-zinc-100 px-2 py-1 text-[9px] text-zinc-600">{file.type}</span></div><p className="mt-1 text-[10px] text-zinc-500">{file.folder} · {file.size}</p><button className="mt-3 flex items-center gap-1 text-[10px] text-zinc-500 opacity-60" disabled type="button"><Upload size={12} />Replace file</button></div></article>)}</div></section>
  </>;
}
