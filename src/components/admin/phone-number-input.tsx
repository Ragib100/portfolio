"use client";

import { useState } from "react";

type PhoneNumberInputProps = {
  className: string;
  defaultValue: string;
};

export function PhoneNumberInput({ className, defaultValue }: PhoneNumberInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <span className="flex items-center">
      <span className="rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-600">+880</span>
      <input
        className={`${className} rounded-l-none`}
        name="phone"
        type="text"
        inputMode="numeric"
        autoComplete="tel-national"
        value={value}
        onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))}
      />
    </span>
  );
}
