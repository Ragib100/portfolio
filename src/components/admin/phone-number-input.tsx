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
      <input
        className={className}
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
