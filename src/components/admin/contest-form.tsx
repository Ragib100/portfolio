"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { Loader2, Save } from "lucide-react";
import { saveContest } from "@/app/admin/(protected)/contests/actions";
import { CONTEST_CATEGORIES, type Contest, type ContestFormState } from "@/lib/data/contest";
import { toFormValues } from "@/lib/contests/validation";

const inputClass =
  "w-full rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 aria-[invalid=true]:border-red-400";

function Field({
  label, error, hint, className = "", children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-[11px] font-medium text-zinc-600 ${className}`}>
      <span>{label}</span>
      {children}
      {error ? (
        <span className="text-[10px] font-normal text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-[10px] font-normal text-zinc-400">{hint}</span>
      ) : null}
    </label>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-[11px] font-semibold text-zinc-800">{title}</legend>
      <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">{children}</div>
    </fieldset>
  );
}

const initialState: ContestFormState = {};

export function ContestForm({ contest }: { contest?: Contest }) {
  const [state, action, pending] = useActionState(saveContest, initialState);

  // After a failed save, keep what the admin typed; otherwise use the saved contest.
  const values = state.values ?? toFormValues(contest);
  const errors = state.fieldErrors ?? {};
  const err = (name: string) => errors[name]?.[0];
  const invalid = (name: string) => (errors[name] ? true : undefined);

  return (
    <form action={action} className="space-y-6" noValidate={false}>
      {contest ? <input type="hidden" name="id" value={contest.id} /> : null}

      {state.error ? (
        <p className="rounded-md bg-red-50 p-3 text-xs text-red-700" role="alert">{state.error}</p>
      ) : null}

      <Group title="Contest">
        <Field label="Contest name" error={err("title")} className="col-span-2 max-[500px]:col-span-1">
          <input className={inputClass} name="title" required maxLength={120} defaultValue={values.title} aria-invalid={invalid("title")} placeholder="e.g. ICPC Dhaka Regional" />
        </Field>
        <Field label="Category" error={err("category")}>
          <select className={inputClass} name="category" required defaultValue={values.category} aria-invalid={invalid("category")}>
            <option value="" disabled>Choose a category</option>
            {CONTEST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Date" error={err("date")}>
          <input className={inputClass} type="date" name="date" required defaultValue={values.date} aria-invalid={invalid("date")} />
        </Field>
      </Group>

      <Group title="Result">
        <Field label="Rank" error={err("rank")}>
          <input className={inputClass} type="number" inputMode="numeric" min={1} name="rank" defaultValue={values.rank} aria-invalid={invalid("rank")} placeholder="e.g. 8" />
        </Field>
        <Field label="Total teams" error={err("totalParticipants")}>
          <input className={inputClass} type="number" inputMode="numeric" min={1} name="totalParticipants" defaultValue={values.totalParticipants} aria-invalid={invalid("totalParticipants")} placeholder="e.g. 120" />
        </Field>
        <Field label="Solved problems" error={err("solved")}>
          <input className={inputClass} type="number" inputMode="numeric" min={0} max={100} name="solved" defaultValue={values.solved} aria-invalid={invalid("solved")} />
        </Field>
        <Field label="Total problems" error={err("totalProblems")}>
          <input className={inputClass} type="number" inputMode="numeric" min={0} name="totalProblems" defaultValue={values.totalProblems} aria-invalid={invalid("totalProblems")} />
        </Field>
        <Field label="Team name" error={err("teamName")} hint="Optional. Only the team name is shown publicly." className="col-span-2 max-[500px]:col-span-1">
          <input className={inputClass} name="teamName" maxLength={80} defaultValue={values.teamName} aria-invalid={invalid("teamName")} />
        </Field>
      </Group>

      <Group title="Links and notes">
        <Field label="Certificate or post URL" error={err("url")} className="col-span-2 max-[500px]:col-span-1">
          <input className={inputClass} type="url" name="url" maxLength={2048} defaultValue={values.url} aria-invalid={invalid("url")} placeholder="https://..." />
        </Field>
        <Field label="Notes" error={err("notes")} hint="Shown on your portfolio when published." className="col-span-2 max-[500px]:col-span-1">
          <textarea className={inputClass} name="notes" rows={3} maxLength={1000} defaultValue={values.notes} aria-invalid={invalid("notes")} />
        </Field>
      </Group>

      <label className="flex cursor-pointer items-center gap-2 text-[11px] text-zinc-600">
        <input className="cursor-pointer accent-indigo-600" type="checkbox" name="published" defaultChecked={values.published === "on"} />
        <span>Publish on portfolio</span>
      </label>

      <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-4">
        {contest ? (
          <Link href="/admin/contests" className="rounded-md border border-zinc-200 px-3 py-2 text-[11px] font-medium text-zinc-600 transition hover:bg-zinc-50">
            Cancel
          </Link>
        ) : null}
        <button type="submit" disabled={pending} className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2 text-[11px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {contest ? "Save changes" : "Add contest"}
        </button>
      </div>
    </form>
  );
}
