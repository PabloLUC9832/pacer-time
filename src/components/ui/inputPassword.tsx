import * as React from "react"

import { cn } from "@/lib/utils"
import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

function InputPassword({ className, ...props }: React.ComponentProps<"input">) {

  const [isView, setIsView] = useState(false)

  return (
    <div className="relative">
      <input
          type={isView ? "text" : "password"}
          data-slot="input"
          className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              className
          )}
          {...props}
      />
      {isView ? (
        <Eye
        className="absolute right-3 top-3 size-4 cursor-pointer hover:text-accent-foreground dark:hover:text-accent-foreground-dark"
        onClick={() => setIsView(false)}
        />
      ): (
        <EyeOff
          className="absolute right-3 top-3 size-4 cursor-pointer hover:text-accent-foreground dark:hover:text-accent-foreground-dark"
          onClick={() => setIsView(!isView)}
        />
      )}
    </div>
  )
}

export { InputPassword }
