export function sanitizeString(input: unknown, maxLength = 255): string {
  if (typeof input !== "string") return ""
  return input
    .replace(/[<>'"&;]/g, "")
    .trim()
    .slice(0, maxLength)
}

export function sanitizeNumericParam(
  input: unknown,
  fallback?: number,
  min?: number,
  max?: number
): number | undefined {
  if (input === null || input === undefined || input === "") return fallback
  const parsed = typeof input === "number" ? input : parseFloat(String(input))
  if (Number.isNaN(parsed)) return fallback
  let val = parsed
  if (min !== undefined && val < min) val = min
  if (max !== undefined && val > max) val = max
  return val
}

export function sanitizeOrcid(orcid: unknown): string {
  if (typeof orcid !== "string") return ""
  const clean = orcid.replace(/^https?:\/\/orcid\.org\//i, "").trim()
  const match = clean.match(/^\d{4}-\d{4}-\d{4}-[\dX]{4}$/)
  return match ? match[0] : clean.slice(0, 19)
}
