import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#F0A500] text-black hover:bg-[#FFD166]",
  secondary: "bg-[#21262D] text-[#E6EDF3] border border-[#30363D] hover:bg-[#30363D]",
  danger: "bg-transparent text-[#EF4444] border border-[#EF4444] hover:bg-[#EF4444]/10",
};

export function Button({ children, onClick, disabled, variant = "secondary" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${STYLES[variant]}`}
    >
      {children}
    </button>
  );
}
