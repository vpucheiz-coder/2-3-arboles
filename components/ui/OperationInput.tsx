"use client";

import { useState } from "react";

interface OperationInputProps {
  label: string;
  placeholder?: string;
  buttonLabel: string;
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export function OperationInput({
  label,
  placeholder,
  buttonLabel,
  onSubmit,
  disabled,
}: OperationInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const n = Number(value);
    if (value.trim() === "" || Number.isNaN(n)) return;
    onSubmit(n);
    setValue("");
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#8B949E]">{label}</label>
        <input
          type="number"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-28 rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#E6EDF3] outline-none focus:border-[#F0A500] disabled:opacity-50"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="rounded-md bg-[#F0A500] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#FFD166] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
