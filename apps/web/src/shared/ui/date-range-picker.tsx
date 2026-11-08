"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useLocale } from "next-intl"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface DateRangePickerProps {
  startDate: string | null
  endDate: string | null
  onChange: (start: string | null, end: string | null) => void
  minDate?: string
  maxDate?: string
  issueDates?: string[]
  className?: string
}

const MONTH_NAMES_UK = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
]

const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEKDAYS_UK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
const WEEKDAYS_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

function formatIso(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0")
  const d = String(day).padStart(2, "0")
  return `${year}-${m}-${d}`
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  issueDates = [],
  className,
}: DateRangePickerProps) {
  const locale = useLocale()
  const isUk = locale === "uk"
  const monthNames = isUk ? MONTH_NAMES_UK : MONTH_NAMES_EN
  const weekdays = isUk ? WEEKDAYS_UK : WEEKDAYS_EN

  const [isOpen, setIsOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState<string | null>(null)
  const [selectingStart, setSelectingStart] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const initialDate = useMemo(() => {
    if (startDate) {
      const parts = startDate.split("-").map(Number)
      if (parts.length === 3 && parts[0] && parts[1]) {
        return new Date(parts[0], parts[1] - 1, 1)
      }
    }
    if (maxDate) {
      const parts = maxDate.split("-").map(Number)
      if (parts.length === 3 && parts[0] && parts[1]) {
        return new Date(parts[0], parts[1] - 1, 1)
      }
    }
    return new Date()
  }, [startDate, maxDate])

  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSelectingStart(null)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
      return () => document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startWeekday = (firstDay.getDay() + 6) % 7
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const days: Array<{
      dateStr: string
      dayNum: number
      isCurrentMonth: boolean
    }> = []

    for (let i = startWeekday - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear
      days.push({
        dateStr: formatIso(prevY, prevM, dayNum),
        dayNum,
        isCurrentMonth: false,
      })
    }

    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      days.push({
        dateStr: formatIso(viewYear, viewMonth, dayNum),
        dayNum,
        isCurrentMonth: true,
      })
    }

    const remaining = (7 - (days.length % 7)) % 7
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear
      days.push({
        dateStr: formatIso(nextY, nextM, dayNum),
        dayNum,
        isCurrentMonth: false,
      })
    }

    return days
  }, [viewYear, viewMonth])

  function handleDayClick(dateStr: string) {
    if (!selectingStart) {
      setSelectingStart(dateStr)
    } else {
      let start = selectingStart
      let end = dateStr
      if (start > end) {
        const temp = start
        start = end
        end = temp
      }
      setSelectingStart(null)
      onChange(start, end)
      setIsOpen(false)
    }
  }

  const activeStart = selectingStart ?? startDate
  const activeEnd = selectingStart ? (hoverDate ?? selectingStart) : endDate
  const effectiveStart = activeStart && activeEnd && activeStart > activeEnd ? activeEnd : activeStart
  const effectiveEnd = activeStart && activeEnd && activeStart > activeEnd ? activeStart : activeEnd

  const triggerLabel = useMemo(() => {
    if (!startDate && !endDate) {
      return isUk ? "Оберіть дату" : "Pick a date"
    }
    if (startDate && endDate) {
      if (startDate === endDate) return startDate
      if (startDate.slice(0, 4) === endDate.slice(0, 4) && startDate.endsWith("-01-01") && endDate.endsWith("-12-31")) {
        return isUk ? `${startDate.slice(0, 4)} рік` : `Year ${startDate.slice(0, 4)}`
      }
      return `${startDate} — ${endDate}`
    }
    if (startDate) return isUk ? `від ${startDate}` : `from ${startDate}`
    if (endDate) return isUk ? `до ${endDate}` : `to ${endDate}`
    return isUk ? "Оберіть дату" : "Pick a date"
  }, [startDate, endDate, isUk])

  const isFiltered = startDate !== null || endDate !== null

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-between gap-2 h-8 min-h-8 max-h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer select-none shadow-2xs",
          isFiltered
            ? "bg-brand text-brand-foreground border-brand hover:bg-brand/90"
            : "bg-card border-border hover:bg-muted/50 text-foreground"
        )}
        aria-label={triggerLabel}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <CalendarIcon className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
          <span className="truncate">{triggerLabel}</span>
        </div>
        <ChevronDown
          className={cn("size-3 opacity-70 shrink-0 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-76 p-3 rounded-xl bg-card border border-border shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="size-7 rounded-lg border border-border hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>

            <span className="text-xs font-bold text-foreground">
              {monthNames[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="size-7 rounded-lg border border-border hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((wd) => (
              <span
                key={wd}
                className="text-[11px] font-semibold text-muted-foreground/80 py-0.5 select-none"
              >
                {wd}
              </span>
            ))}

            {calendarDays.map((day) => {
              const isStart = day.dateStr === effectiveStart
              const isEnd = day.dateStr === effectiveEnd
              const isInRange =
                effectiveStart && effectiveEnd && day.dateStr >= effectiveStart && day.dateStr <= effectiveEnd
              const isIssueDay = issueDates.includes(day.dateStr)
              const isDisabled =
                (minDate && day.dateStr < minDate) || (maxDate && day.dateStr > maxDate)

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  disabled={Boolean(isDisabled)}
                  onClick={() => handleDayClick(day.dateStr)}
                  onMouseEnter={() => setHoverDate(day.dateStr)}
                  className={cn(
                    "relative size-8 text-xs font-medium rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer select-none disabled:opacity-25 disabled:pointer-events-none",
                    !day.isCurrentMonth && "text-muted-foreground/35",
                    day.isCurrentMonth && !isStart && !isEnd && !isInRange && "text-foreground hover:bg-muted/60",
                    isInRange && !isStart && !isEnd && "bg-brand/15 text-brand font-semibold rounded-none",
                    (isStart || isEnd) && "bg-brand text-brand-foreground font-bold shadow-2xs z-10"
                  )}
                >
                  <span>{day.dayNum}</span>
                  {isIssueDay && (
                    <span
                      className={cn(
                        "size-1 rounded-full absolute bottom-1",
                        isStart || isEnd ? "bg-brand-foreground" : "bg-brand"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
            {isFiltered ? (
              <button
                type="button"
                onClick={() => {
                  setSelectingStart(null)
                  onChange(null, null)
                  setIsOpen(false)
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                <span>{isUk ? "Скинути" : "Reset"}</span>
              </button>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                {isUk ? "Оберіть 1 або 2 дати" : "Pick 1 or 2 dates"}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setSelectingStart(null)
              }}
              className="px-2.5 py-1 rounded-lg bg-well border border-well-border text-foreground text-[11px] font-semibold hover:bg-muted/50 transition-colors cursor-pointer"
            >
              {isUk ? "Закрити" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
