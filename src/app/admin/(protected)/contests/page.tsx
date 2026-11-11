import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { CalendarDays, ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2, Trophy } from "lucide-react";
import { requireAdminSession } from "@/lib/auth/session";
import { type Contest } from "@/lib/data/contest";
import { formatContestDate } from "@/lib/contests/validation";
import { ContestForm } from "@/components/admin/contest-form";
import { deleteContest, togglePublished, getContests } from "./actions";

const panelClass = "rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm";
const iconButton =
  "inline-flex size-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700";

function bestFinish(contests: Contest[]) {
  const ranked = contests.filter((c) => c.rank && c.totalParticipants);
  if (ranked.length === 0) return null;
  return ranked.reduce((best, c) => (c.rank! / c.totalParticipants! < best.rank! / best.totalParticipants! ? c : best));
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className={panelClass}>
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {note ? <p className="mt-0.5 truncate text-[11px] text-zinc-500">{note}</p> : null}
    </div>
  );
}

async function ContestsContent({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await connection();
  await requireAdminSession();

  const { edit } = await searchParams;
  let contests: Contest[] = [];
  let loadError = false;
  try {
    contests = await getContests();
  } catch {
    loadError = true;
  }

  const editing = edit ? contests.find((c) => c.id === edit) : undefined;
  const publishedCount = contests.filter((c) => c.published).length;
  const best = bestFinish(contests);

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-5 max-[760px]:items-start">
        <div>
          <p className="text-[10px] font-semibold tracking-[.09em] text-zinc-400">PORTFOLIO WORKSPACE</p>
          <h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">Contest results</h1>
          <p className="text-[13px] text-zinc-500">
            Record competitive programming contests and hackathons. Only the team name is shown; member details are not collected.
          </p>
        </div>
        <Link href="/admin/contests#editor" className="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2.5 text-xs font-medium text-white transition hover:opacity-90">
          <Plus size={15} /> Add contest
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
        <Stat label="Contests" value={String(contests.length)} />
        <Stat label="On portfolio" value={String(publishedCount)} note={`${contests.length - publishedCount} drafts`} />
        <Stat
          label="Best finish"
          value={best ? `#${best.rank}` : "–"}
          note={best ? `of ${best.totalParticipants} · ${best.title}` : "Add a ranked contest"}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(340px,1fr)] items-start gap-4 max-[960px]:grid-cols-1">
        <section className={panelClass}>
          <div className="mb-4">
            <h2 className="text-[13px] font-semibold">Entries</h2>
            <p className="mt-1 text-[11px] text-zinc-500">Newest first. Hidden entries stay saved but don&apos;t appear on your portfolio.</p>
          </div>

          {loadError ? (
            <p className="rounded-md bg-red-50 p-3 text-xs text-red-700" role="alert">
              Unable to load contests. Refresh the page to try again.
            </p>
          ) : contests.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-300 px-4 py-10 text-center">
              <Trophy size={22} className="mx-auto mb-2 text-zinc-400" />
              <p className="text-xs font-medium text-zinc-700">No contests yet</p>
              <p className="mt-1 text-[11px] text-zinc-500">Add your first result using the form.</p>
            </div>
          ) : (
            <ul>
              {contests.map((c) => {
                const podium = c.rank !== undefined && c.rank <= 3;
                const isEditing = editing?.id === c.id;
                return (
                  <li
                    key={c.id}
                    className={`flex items-start gap-3 border-t border-zinc-100 py-3.5 first:border-t-0 first:pt-0 ${isEditing ? "rounded-md bg-indigo-50/50 px-2 -mx-2" : ""}`}
                  >
                    <div className={`grid size-11 shrink-0 place-items-center rounded-lg text-[13px] font-semibold tabular-nums ${podium ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>
                      {c.rank ? `#${c.rank}` : "–"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="truncate text-xs font-semibold text-zinc-800">{c.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${c.published ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {c.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
                        <span>{c.category}</span>
                        <span className="inline-flex items-center gap-1"><CalendarDays size={11} />{formatContestDate(c.date)}</span>
                      </p>
                      {c.rank && c.totalParticipants || c.solved !== undefined || c.totalProblems !== undefined || c.teamName ? (
                        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-zinc-600">
                          {c.rank && c.totalParticipants ? <span>Rank {c.rank} of {c.totalParticipants}</span> : null}
                          {c.solved !== undefined ? <span>{c.solved} solved</span> : null}
                          {c.totalProblems !== undefined ? <span>{c.totalProblems} problems</span> : null}
                          {c.teamName ? <span>Team {c.teamName}</span> : null}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label={`Open link for ${c.title}`} title="Open link">
                          <ExternalLink size={14} />
                        </a>
                      ) : null}
                      <Link href={`/admin/contests?edit=${c.id}#editor`} className={iconButton} aria-label={`Edit ${c.title}`} title="Edit">
                        <Pencil size={14} />
                      </Link>
                      <form action={togglePublished}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="next" value={String(!c.published)} />
                        <button type="submit" className={iconButton} aria-label={c.published ? `Hide ${c.title}` : `Publish ${c.title}`} title={c.published ? "Hide from portfolio" : "Publish"}>
                          {c.published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </form>
                      <form action={deleteContest}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className={`${iconButton} hover:!bg-red-50 hover:!text-red-600`} aria-label={`Delete ${c.title}`} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section id="editor" className={`${panelClass} scroll-mt-6 min-[961px]:sticky min-[961px]:top-6`}>
          <div className="mb-5">
            <h2 className="text-[13px] font-semibold">{editing ? "Edit contest" : "New contest"}</h2>
            <p className="mt-1 text-[11px] text-zinc-500">
              {editing ? `Editing ${editing.title}.` : "Fill in the details. Save it as a draft or publish it right away."}
            </p>
            {edit && !editing && !loadError ? (
              <p className="mt-2 rounded-md bg-amber-50 p-2 text-[11px] text-amber-800">That contest wasn&apos;t found, so this form is adding a new one.</p>
            ) : null}
          </div>
          <ContestForm key={editing?.id ?? "new"} contest={editing} />
        </section>
      </div>
    </>
  );
}

export default function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-[var(--admin-line)] bg-white p-5 text-xs text-zinc-500 shadow-sm" role="status">
          Loading contests…
        </div>
      }
    >
      <ContestsContent searchParams={searchParams} />
    </Suspense>
  );
}
