// Placeholder that mirrors the admin workspace (sidebar + header + two panels),
// so the real page replaces it without the layout jumping.
const bar = "rounded bg-zinc-200/70 motion-safe:animate-pulse";

export function AdminLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="relative min-h-screen bg-zinc-50"
    >
      <span className="sr-only">Loading admin…</span>

      {/* the one moving accent: a thin line across the top */}
      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-zinc-200/60">
        <div className="h-full w-1/3 bg-[var(--accent)] motion-safe:animate-pulse" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1400px]" aria-hidden="true">
        {/* sidebar */}
        <aside className="hidden w-[220px] shrink-0 border-r border-[var(--admin-line)] bg-white p-5 md:block">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="size-7 rounded-md bg-[var(--accent)]/90" />
            <div className={`${bar} h-3 w-24`} />
          </div>
          <div className="space-y-3">
            {[72, 56, 84, 64, 76].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`${bar} size-4`} />
                <div className={`${bar} h-2.5`} style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </aside>

        {/* content */}
        <main className="min-w-0 flex-1 px-6 py-8 md:px-9">
          <div className={`${bar} mb-3 h-2.5 w-32`} />
          <div className={`${bar} mb-2 h-6 w-56`} />
          <div className={`${bar} mb-8 h-3 w-full max-w-md`} />

          <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(300px,1fr)] gap-4 max-[900px]:grid-cols-1">
            <section className="space-y-3 rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
              <div className={`${bar} h-3.5 w-28`} />
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-md border border-zinc-100 p-3">
                  <div className={`${bar} mb-3 h-3 w-24`} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`${bar} h-8`} />
                    <div className={`${bar} h-8`} />
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-4 rounded-[9px] border border-[var(--admin-line)] bg-white p-[18px] shadow-sm">
              <div className={`${bar} h-3.5 w-32`} />
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className={`${bar} size-8 shrink-0`} />
                  <div className="flex-1 space-y-2">
                    <div className={`${bar} h-2.5 w-2/5`} />
                    <div className={`${bar} h-2 w-full`} />
                  </div>
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}