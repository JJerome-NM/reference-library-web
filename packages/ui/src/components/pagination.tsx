"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "cn"

export interface DataPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalElements?: number
  pageLabel?: string
  ofLabel?: string
  totalLabel?: string
  prevAriaLabel?: string
  nextAriaLabel?: string
  className?: string
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages]
}

export function DataPagination({
  page,
  totalPages,
  onPageChange,
  totalElements,
  pageLabel = "Сторінка",
  ofLabel = "з",
  totalLabel,
  prevAriaLabel = "Попередня сторінка",
  nextAriaLabel = "Наступна сторінка",
  className,
}: DataPaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border/60 text-xs",
        className
      )}
    >
      <div className="text-muted-foreground font-medium">
        <span>
          {pageLabel} <strong className="text-foreground font-mono font-bold">{page}</strong> {ofLabel}{" "}
          <strong className="text-foreground font-mono font-bold">{totalPages}</strong>
        </span>
        {totalElements !== undefined && (
          <span className="ml-1.5 opacity-80">
            ({totalElements} {totalLabel || ""})
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="inline-flex items-center justify-center size-8 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          aria-label={prevAriaLabel}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>

        {pageNumbers.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex items-center justify-center size-8 text-muted-foreground select-none"
                aria-hidden="true"
              >
                <MoreHorizontal className="size-3.5" />
              </span>
            )
          }

          const isCurrent = item === page
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={cn(
                "inline-flex items-center justify-center size-8 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer",
                isCurrent
                  ? "bg-foreground text-background font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Сторінка ${item}`}
            >
              {item}
            </button>
          )
        })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="inline-flex items-center justify-center size-8 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          aria-label={nextAriaLabel}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
