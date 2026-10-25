import {
  ArrowUpRight,
  Camera,
  Check,
  Eye,
  MapPin,
  Sparkles,
} from "lucide-react";

const fieldClass =
  "w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-indigo-100";
const labelClass =
  "flex flex-col gap-1.5 text-[11px] font-medium text-zinc-600";
const panelClass =
  "rounded-xl border border-[var(--admin-line)] bg-white p-5 shadow-sm";

export default function Page() {
  return (
    <div className="w-full">
      <header className="mb-6 flex items-end justify-between gap-5 max-[700px]:items-start">
        <div>
          <h1 className="mb-1 mt-2 text-[clamp(23px,2vw,29px)] font-semibold tracking-tight">
            Profile
          </h1>
          <p className="text-[13px] text-zinc-500">
            Shape how visitors see you across your portfolio.
          </p>
        </div>
      </header>

      <div className="items-start gap-4 max-[900px]:grid-cols-1">
        <div className="space-y-4">
          <section className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Public identity</h2>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Your name and introduction lead your portfolio.
                </p>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-4 rounded-lg bg-zinc-50 p-4 max-[500px]:items-start max-[500px]:p-3">
              <div className="grid size-[68px] shrink-0 place-items-center rounded-full bg-[#eeedff] text-xl font-semibold text-[#5145cd]">
                RH
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Profile photo</p>
                <p className="mt-1 text-[10px] text-zinc-500">
                  Use a square PNG or JPG image, up to 5 MB.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button
                    className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-zinc-700 opacity-60"
                    disabled
                    type="button"
                  >
                    <Camera size={13} /> Upload photo
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              <label className={labelClass}>
                <span>Full name</span>
                <input className={fieldClass} defaultValue="Ragib Hasan" />
              </label>
              <label className={labelClass}>
                <span>Professional title</span>
                <input
                  className={fieldClass}
                  defaultValue="Computer Science undergraduate"
                />
              </label>
              <label
                className={`${labelClass} col-span-2 max-[600px]:col-span-1`}
              >
                <span>Tagline</span>
                <input
                  className={fieldClass}
                  defaultValue="Competitive programmer & software developer"
                />
              </label>
              <label className={labelClass}>
                <span>Location</span>
                <input
                  className={fieldClass}
                  defaultValue="Dhaka, Bangladesh"
                />
              </label>
              <label className={labelClass}>
                <span>Availability</span>
                <select
                  className={fieldClass}
                  defaultValue="Open to opportunities"
                >
                  <option>Open to opportunities</option>
                  <option>Not available</option>
                </select>
              </label>
              <label
                className={`${labelClass} col-span-2 max-[600px]:col-span-1`}
              >
                <span>About</span>
                <textarea
                  className={fieldClass}
                  rows={5}
                  defaultValue="I am a CSE undergraduate who enjoys solving challenging problems and building useful software."
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end border-t border-zinc-100 pt-4">
              <button
                className="rounded-md bg-[var(--accent)] px-3 py-2 text-[11px] font-medium text-white opacity-60"
                disabled
                type="button"
              >
                Save profile
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
