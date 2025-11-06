import { cn } from "@/lib/utils";

interface GlowProps {
  variant?: "top" | "bottom" | "center";
  className?: string;
}

export function Glow({ variant = "center", className }: GlowProps) {
  const variants = {
    top: "-top-40",
    bottom: "-bottom-40",
    center: "top-1/2 -translate-y-1/2"
  };

  return (
    <div className={cn(
      "absolute left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none",
      variants[variant],
      className
    )}>
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute inset-10 bg-primary/30 rounded-full blur-[80px]" />
    </div>
  );
}
