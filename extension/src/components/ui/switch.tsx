"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const sizes = {
  small: { root: "h-[0.875rem] w-6", thumb: "size-3 translate-x-[calc(100%-2px)]" },
  medium: { root: "h-[1.15rem] w-8", thumb: "size-4 translate-x-[calc(100%-2px)]" },
  large: { root: "h-[1.5rem] w-10", thumb: "size-5 translate-x-[calc(100%-2px)]" },
}

function Switch({
  className,
  size = "medium",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { size?: "small" | "medium" | "large" }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300 focus-visible:ring-2 transition-all rounded-full flex items-center border border-transparent shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size].root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white block rounded-full ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          sizes[size].thumb
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
