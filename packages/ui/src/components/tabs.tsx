"use client"

import * as React from "react"
import { cn } from "cn"

type TabsListProps = React.ComponentProps<"div">

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 rounded-xl bg-muted/60 p-1 text-xs font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ComponentProps<"button"> {
  isActive?: boolean
}

function TabsTrigger({ className, isActive, ...props }: TabsTriggerProps) {
  return (
    <button
      data-slot="tabs-trigger"
      role="tab"
      aria-selected={isActive}
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isActive
          ? "bg-background text-foreground shadow-2xs"
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { TabsList, TabsTrigger }
