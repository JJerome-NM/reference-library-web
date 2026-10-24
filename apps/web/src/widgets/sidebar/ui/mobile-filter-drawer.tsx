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
          className="w-full flex items-center justify-between rounded-xl border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-blue-600" aria-hidden="true" />
            <span>{title || t("searchFilters")}</span>
          </span>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
        <Sheet side="right" className="w-[90vw] sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-blue-600" aria-hidden="true" />
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
