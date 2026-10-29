import {
  Eye, EyeOff, ExternalLink, GripVertical, Plus, Save, Trash2, Undo2,
} from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { saveContactSet } from "./actions";
import { DraggableLinkList } from "@/components/admin/draggable-link-list";
import { NewLinkFields } from "@/components/admin/new-link-fields";
import { getContactLinks, type ContactLink } from "@/lib/data/contact";

const labelClass = "flex flex-col gap-1.5 text-[11px] font-medium text-zinc-600";
const inputClass = "w-full rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10";

async function ContactContent() {
  await connection();
  let links: ContactLink[] = [];
  let loadError = false;
  try {
    links = await getContactLinks();
  } catch {
    loadError = true;
  }

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-5 max-[760px]:items-start">
        <div>
          <p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">PORTFOLIO WORKSPACE</p>
          <h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">Contact &amp; links</h1>
          <p className="text-[13px] text-zinc-500">Manage your social profiles, add new links, and arrange how they appear on your public portfolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(300px,1fr)] items-start gap-4 max-[900px]:grid-cols-1">
        <section className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
          <form action={saveContactSet}>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold">Social links</h2>
                <p className="mt-1 text-[11px] text-zinc-500">Drag links to reorder them. Edit links and change visibility here; changes take effect only after saving.</p>
              </div>
              <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500">{links.length} links</span>
            </div>

            <DraggableLinkList>
              {loadError ? <p className="rounded-md bg-red-50 p-3 text-xs text-red-700" role="alert">Unable to load contact links. Refresh the page to try again.</p> : null}
              {!loadError && links.map((link) => (
                <div key={link.id} data-drag-id={link.id} draggable className="cursor-grab rounded-md border border-zinc-200 p-3 transition data-[dragging=true]:opacity-40 active:cursor-grabbing">
                  <div className="mb-3 flex items-center gap-2">
                    <GripVertical size={15} className="shrink-0 text-zinc-400" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold text-zinc-800">{link.label}</span>
                      <span className={`mt-0.5 flex items-center gap-1 text-[10px] ${link.visible ? "text-emerald-700" : "text-zinc-400"}`}>
                        {link.visible ? <Eye size={11} /> : <EyeOff size={11} />}{link.visible ? "Visible on portfolio" : "Hidden"}
                      </span>
                    </div>
                    <label title={`Mark ${link.label} for removal when saving`} className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-zinc-500 hover:bg-red-50 hover:text-red-600 has-[:checked]:text-[var(--accent)]">
                      <input className="peer sr-only" type="checkbox" name="remove" value={link.id} aria-label={`Mark ${link.label} for removal`} />
                      <Trash2 size={13} className="peer-checked:hidden" />
                      <Undo2 size={13} className="hidden peer-checked:block" />
                      <span className="peer-checked:hidden">Delete</span>
                      <span className="hidden peer-checked:inline">Undo removal</span>
                    </label>
                  </div>
                  <input type="hidden" name="id" value={link.id} />
                  <div className="grid grid-cols-2 gap-2 max-[520px]:grid-cols-1">
                    <label className={labelClass}><span>Link type</span><input className={inputClass} name="label" defaultValue={link.label} placeholder="e.g. GitHub" /></label>
                    <label className={labelClass}><span>URL or address</span><input className={inputClass} name="value" defaultValue={link.value} placeholder="https://..." /></label>
                  </div>
                  <label className="cursor-pointer mt-3 inline-flex items-center gap-2 text-[11px] text-zinc-600">
                    <input className="accent-indigo-600 cursor-pointer" type="checkbox" name="visible" value={link.id} defaultChecked={link.visible} />
                    <span>Visible on portfolio</span>
                  </label>
                </div>
              ))}

              {!loadError && links.length === 0 && <div className="rounded-md border border-dashed border-zinc-300 px-4 py-10 text-center"><ExternalLink size={22} className="mx-auto mb-2 text-zinc-400" /><p className="text-xs font-medium text-zinc-700">No links added yet</p><p className="mt-1 text-[11px] text-zinc-500">Add your first social profile to get started.</p></div>}
            </DraggableLinkList>

            <div className="mt-5 border-t border-zinc-100 pt-4">
              <details>
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-2 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-50"><Plus size={13} /> Add link</summary>
                <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <h3 className="mb-3 text-xs font-semibold text-zinc-800">Add a new link</h3>
                  <NewLinkFields />
                </div>
              </details>
            </div>
            <div className="mt-5 flex justify-end border-t border-zinc-100 pt-4">
              <div className="flex items-center gap-2">
                {/* <a href="/admin/contact" className="rounded-md border border-zinc-200 px-3 py-2 text-[11px] font-medium text-zinc-600 transition hover:bg-zinc-50">Discard changes</a> */}
                <button type="submit" disabled={loadError} className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2 text-[11px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><Save size={13} /> Save changes</button>
              </div>
            </div>
          </form>
        </section>

        <aside className="rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
          <h2 className="text-[13px] font-semibold">Link management</h2>
          <p className="mt-1 text-[11px] text-zinc-500">Keep your important profiles easy to find.</p>
          <div className="mt-4 space-y-4">
            <div className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"><GripVertical size={15} /></div><div><p className="text-xs font-medium text-zinc-800">Control the order</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">Drag links to set how your public portfolio displays your profiles.</p></div></div>
            <div className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700"><Eye size={15} /></div><div><p className="text-xs font-medium text-zinc-800">Manage visibility</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">Hide a link temporarily without deleting it. You can make it visible again whenever you want.</p></div></div>
            <div className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700"><Plus size={15} /></div><div><p className="text-xs font-medium text-zinc-800">Add any link type</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">Add programming profiles, social media, email addresses, or your personal website.</p></div></div>
          </div>
          <div className="mt-5 rounded-md border border-zinc-100 bg-zinc-50 p-3"><p className="text-[11px] font-semibold text-zinc-700">Recommended profiles</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">GitHub · Codeforces · LinkedIn · Email · Personal website · AtCoder · CodeChef</p></div>
        </aside>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-[var(--admin-line)] bg-white p-5 text-xs text-zinc-500 shadow-sm" role="status">
          Loading contact links…
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
