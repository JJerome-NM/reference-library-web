"use client"

import { useTranslations } from "next-intl"
import { Mail } from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { EXTERNAL_LINKS } from "@/src/shared/config"

export function ContactsCard() {
  const t = useTranslations("common")

  return (
    <Card className="p-4 space-y-1 text-xs">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
        {t("editorialContacts")}
      </span>
      <div className="flex items-center gap-2 pt-1 text-muted-foreground">
        <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <a
          href={`mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}`}
          className="font-mono text-xs text-foreground hover:text-blue-600 transition-colors"
        >
          {EXTERNAL_LINKS.SUPPORT_EMAIL}
        </a>
      </div>
    </Card>
  )
}
