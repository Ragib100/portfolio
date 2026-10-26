import { saveProfile } from "./action";
import { connection } from "next/server";
import { Suspense } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { ProfileSubmitButton } from "@/components/admin/profile-submit-button";
import { getProfile } from "@/lib/data/profile";

const fieldClass =
  "w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-indigo-100";
const labelClass =
  "flex flex-col gap-1.5 text-[11px] font-medium text-zinc-600";
const panelClass =
  "rounded-xl border border-[var(--admin-line)] bg-white p-5 shadow-sm";

async function ProfileContent() {
  await connection();
  const profile = await getProfile();

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
        <form action={saveProfile} className="space-y-4">
          <section className={panelClass}>
            <div className="mb-5 flex items-center gap-4 rounded-lg bg-zinc-50 p-4 max-[500px]:items-start max-[500px]:p-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Profile photo</p>
                <p className="mt-1 text-[10px] text-zinc-500">
                  Use a square PNG or JPG image, up to 5 MB.
                </p>
                <ImageUpload currentImageUrl={profile?.image ?? null} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              <label className={labelClass}>
                <span>Full name</span>
                <input className={fieldClass} name="full-name" defaultValue={profile?.fullName ?? ""} />
              </label>
              <label className={labelClass}>
                <span>Professional title</span>
                <input
                  className={fieldClass}
                  name="professional-title"
                  defaultValue={profile?.professionalTitle ?? ""}
                />
              </label>
              <label
                className={`${labelClass} col-span-2 max-[600px]:col-span-1`}
              >
                <span>Tagline</span>
                <input
                  className={fieldClass}
                  name="tagline"
                  defaultValue={profile?.tagline ?? ""}
                />
              </label>
              <label className={labelClass}>
                <span>Location</span>
                <input
                  className={fieldClass}
                  name="location"
                  defaultValue={profile?.location ?? ""}
                />
              </label>
              <label className="flex items-center cursor-pointer gap-2 self-end pb-2 text-[11px] font-medium text-zinc-600">
                <Checkbox
                  name="availability"
                  defaultChecked={profile?.availableForWork ?? false}
                />
                <span>Available for work</span>
              </label>
              <label
                className={`${labelClass} col-span-2 max-[600px]:col-span-1`}
              >
                <span>About</span>
                <textarea
                  className={fieldClass}
                  rows={5}
                  name="about"
                  defaultValue={profile?.about ?? ""}
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end border-t border-zinc-100 pt-4">
              <ProfileSubmitButton />
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          className="rounded-xl border border-[var(--admin-line)] bg-white p-5 text-xs text-zinc-500 shadow-sm"
          role="status"
        >
          Loading profile settings…
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
