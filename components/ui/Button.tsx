import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-black hover:bg-accent-light",
  secondary: "bg-card text-foreground border border-edge hover:bg-edge/40",
  danger: "bg-transparent text-node-eliminado border border-node-eliminado hover:bg-node-eliminado/10",
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
