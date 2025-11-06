import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MockupFrameProps {
  children: ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function MockupFrame({ children, className, size = "medium" }: MockupFrameProps) {
  const sizeClasses = {
    small: "max-w-4xl",
    medium: "max-w-6xl",
    large: "max-w-7xl"
  };

  return (
    <div className={cn("mx-auto w-full", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface MockupProps {
  children: ReactNode;
  type?: "responsive" | "desktop" | "mobile";
  className?: string;
}

export function Mockup({ children, type = "responsive", className }: MockupProps) {
  return (
    <div className={cn(
      "relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-2xl",
      type === "mobile" && "max-w-sm mx-auto",
      className
    )}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
