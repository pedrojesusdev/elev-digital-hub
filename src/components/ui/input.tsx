import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[10px] border-2 border-transparent bg-[#F3F3F3] px-3 py-2 text-base text-foreground outline-none overflow-hidden transition-all duration-500 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-border hover:bg-background hover:shadow-[0px_0px_0px_7px_rgba(100,100,100,0.2)] focus-visible:border-border focus-visible:bg-background focus-visible:shadow-[0px_0px_0px_7px_rgba(100,100,100,0.2)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
