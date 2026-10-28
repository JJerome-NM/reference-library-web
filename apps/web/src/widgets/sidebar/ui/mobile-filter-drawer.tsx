"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { SlidersHorizontal } from "lucide-react"
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"

interface MobileFilterDrawerProps {
  children: React.ReactNode
  activeCount?: number
  title?: string
}

export function MobileFilterDrawer({
  children,
  activeCount = 0,
  title,
}: MobileFilterDrawerProps) {
  const t = useTranslations("common")

  return (
    <div className="lg:hidden w-full">
      <SheetTrigger>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-between rounded-xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-md px-3.5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:border-blue-500/40 hover:bg-card transition-all cursor-pointer h-auto min-h-[40px]"
        >
          <span className="flex items-center gap-2">
            <div className="size-5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <SlidersHorizontal className="size-3" aria-hidden="true" />
            </div>
            <span>{title || t("searchFilters")}</span>
          </span>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-2xs">
              {activeCount}
            </span>
          )}
        </Button>
        <Sheet side="right" className="w-[92vw] sm:max-w-md overflow-y-auto max-h-dvh p-4 sm:p-5">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>{title || t("searchFilters")}</span>
            </SheetTitle>
            <SheetDescription>
              {title || t("searchFilters")}
            </SheetDescription>
          </SheetHeader>
          <div className="py-2">
            {children}
          </div>
        </Sheet>
      </SheetTrigger>
    </div>
  )
}
