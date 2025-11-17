import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[10px] border-2 border-transparent bg-[#F3F3F3] px-3 py-2 text-base text-foreground outline-none overflow-hidden transition-all duration-500 placeholder:text-muted-foreground hover:border-border hover:bg-background hover:shadow-[0px_0px_0px_7px_rgba(100,100,100,0.2)] focus-visible:border-border focus-visible:bg-background focus-visible:shadow-[0px_0px_0px_7px_rgba(100,100,100,0.2)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
