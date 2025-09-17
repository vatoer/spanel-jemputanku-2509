"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface MultiSelectComboboxProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export const MultiSelectCombobox = React.forwardRef<HTMLDivElement, MultiSelectComboboxProps>(
  ({ options, value, onChange, placeholder, label, error }, ref) => {
    const [open, setOpen] = React.useState(false);
    const toggleOption = (val: string) => {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
      // Do NOT close dropdown after selection; let user pick multiple
    };
    return (
      <div className="w-full" ref={ref}>
        {label && <label className="block font-medium mb-1">{label}</label>}
        <div
          className={cn(
            "border rounded-lg px-3 py-2 bg-white min-h-[38px] flex flex-wrap gap-1 items-center cursor-pointer",
            error ? "border-red-500" : "border-gray-300"
          )}
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={e => {
            if (e.key === "Escape") setOpen(false);
          }}
          onBlur={e => {
            // Only close if focus moves outside the combobox and dropdown
            setTimeout(() => {
              if (e.currentTarget && !e.currentTarget.contains(document.activeElement)) {
                setOpen(false);
              }
            }, 10);
          }}
        >
          {value.length === 0 && (
            <span className="text-gray-400 text-sm">{placeholder || "Pilih..."}</span>
          )}
          {value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs flex items-center gap-1"
                onClick={e => { e.stopPropagation(); toggleOption(val); }}
              >
                {opt?.label || val}
                <button type="button" className="ml-1 text-blue-500 hover:text-blue-700" aria-label="Hapus">
                  ×
                </button>
              </span>
            );
          })}
        </div>
        {open && (
          <div
            className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-auto"
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()} // prevent blur when clicking inside dropdown
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2",
                  value.includes(opt.value) ? "bg-blue-100" : ""
                )}
                onClick={() => toggleOption(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  readOnly
                  className="accent-blue-600"
                />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </div>
    );
  }
);
MultiSelectCombobox.displayName = "MultiSelectCombobox";
