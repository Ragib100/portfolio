"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className={`h-auto rounded-md bg-[var(--accent)] px-3 py-2 text-[11px] font-medium text-white hover:opacity-90 disabled:pointer-events-auto disabled:opacity-70 ${pending ? "cursor-progress" : "cursor-pointer"}`}
      type="submit"
      disabled={pending}
      aria-live="polite"
    >
      {pending && <LoaderCircle className="size-3 animate-spin" aria-hidden="true" />}
      {pending ? "Saving…" : "Save profile"}
    </Button>
  );
}
