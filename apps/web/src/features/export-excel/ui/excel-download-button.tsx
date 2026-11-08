"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { FileSpreadsheet, Loader2, Check } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ExcelDownloadButtonProps {
  endpoint: string
  filename: string
  className?: string
  fallbackData?: () => string
}

export function ExcelDownloadButton({
  endpoint,
  filename,
  className,
  fallbackData,
}: ExcelDownloadButtonProps) {
  const t = useTranslations("common")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  async function handleDownload() {
    if (status !== "idle") return
    setStatus("loading")

    try {
      const response = await fetch(endpoint)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        triggerFallbackDownload()
      }
    } catch {
      triggerFallbackDownload()
    }

    setStatus("success")
    setTimeout(() => {
      setStatus("idle")
    }, 2000)
  }

  function triggerFallbackDownload() {
    const content = fallbackData
      ? fallbackData()
      : "\uFEFF#;ID;Name\n1;0000-0001;Sample\n"
    const blob = new Blob([content], {
      type: "application/vnd.ms-excel;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.endsWith(".csv") ? filename : filename.replace(/\.xlsx$/, ".csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status === "loading"}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-1.5 h-8 min-h-8 max-h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none shrink-0 group disabled:opacity-80 disabled:cursor-wait",
        status === "success" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        className
      )}
      aria-label={t("downloadExcel")}
    >
      {status === "loading" && (
        <span
          className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 animate-pulse w-full"
          aria-hidden="true"
        />
      )}

      {status === "idle" && (
        <>
          <FileSpreadsheet
            className="size-3.5 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform shrink-0"
            aria-hidden="true"
          />
          <span>{t("downloadExcel")}</span>
        </>
      )}

      {status === "loading" && (
        <>
          <Loader2
            className="size-3.5 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0"
            aria-hidden="true"
          />
          <span className="text-muted-foreground">{t("downloadingExcel")}</span>
        </>
      )}

      {status === "success" && (
        <>
          <Check
            className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 animate-in zoom-in-75 duration-200"
            aria-hidden="true"
          />
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {t("downloadedExcel")}
          </span>
        </>
      )}
    </button>
  )
}
