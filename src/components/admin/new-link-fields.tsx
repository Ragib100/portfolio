"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

type NewLinkRow = {
  id: number;
  label: string;
  value: string;
};

const labelClass = "flex flex-col gap-1.5 text-[11px] font-medium text-zinc-600";
const inputClass = "w-full rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10";

export function NewLinkFields() {
  const nextId = useRef(1);
  const [rows, setRows] = useState<NewLinkRow[]>([{ id: 0, label: "", value: "" }]);
  const populatedCount = rows.filter((row) => row.label.trim() || row.value.trim()).length;

  function updateRow(id: number, field: "label" | "value", value: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function addRow() {
    setRows((current) => [...current, { id: nextId.current++, label: "", value: "" }]);
  }

  function removeRow(id: number) {
    setRows((current) => {
      if (current.length === 1) return [{ id: nextId.current++, label: "", value: "" }];
      return current.filter((row) => row.id !== id);
    });
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={row.id} className="rounded-md border border-zinc-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[10px] font-semibold tracking-[.08em] text-zinc-500">NEW LINK {index + 1}</h4>
            {rows.length > 1 ? (
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                aria-label={`Remove new link ${index + 1}`}
                className="rounded-md p-1 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2 max-[520px]:grid-cols-1">
            <label className={labelClass}>
              <span>Link type</span>
              <input
                className={inputClass}
                name="newLabel"
                maxLength={80}
                value={row.label}
                onChange={(event) => updateRow(row.id, "label", event.target.value)}
                placeholder="e.g. GitHub, Codeforces, Personal website"
              />
            </label>
            <label className={labelClass}>
              <span>URL or address</span>
              <input
                className={inputClass}
                name="newValue"
                maxLength={2048}
                value={row.value}
                onChange={(event) => updateRow(row.id, "value", event.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={addRow}
          className="rounded-md border border-zinc-200 px-3 py-2 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Add another
        </button>
        <p className="text-[10px] text-zinc-500" role="status" aria-live="polite">
          {populatedCount > 0
            ? `${populatedCount} new link${populatedCount === 1 ? "" : "s"} will be added when you save.`
            : "Empty rows are ignored when you save."}
        </p>
      </div>
    </div>
  );
}
