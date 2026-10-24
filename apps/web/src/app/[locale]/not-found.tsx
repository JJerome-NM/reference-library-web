import { Link } from "@/src/i18n/navigation"
import { buttonVariants } from "@workspace/ui/lib/button-variants"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page Not Found / Сторінку не знайдено</p>
      <Link href="/" className={buttonVariants({ variant: "default", size: "default", className: "mt-8" })}>
        Back to Home
      </Link>
    </div>
  )
}
