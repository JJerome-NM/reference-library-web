"use client"

import * as React from "react"
import { cn } from "cn"
import {
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  Dialog as SheetPrimitive,
  DialogTrigger as SheetTriggerPrimitive,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
  type DialogProps as SheetPrimitiveProps,
  type DialogTriggerProps as SheetTriggerPrimitiveProps,
} from "react-aria-components"
import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

function SheetTrigger({ ...props }: SheetTriggerPrimitiveProps) {
  return <SheetTriggerPrimitive data-slot="sheet-trigger" {...props} />
}

interface SheetCloseProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  children?: React.ReactNode
}

function SheetClose({
  className,
  children,
  ...props
}: SheetCloseProps) {
  return (
    <Button
      slot="close"
      data-slot="sheet-close"
      variant="ghost"
      size="sm"
      className={cn("size-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer", className)}
      {...props}
    >
      {children ?? <X className="size-4" aria-hidden="true" />}
      <span className="sr-only">Close</span>
    </Button>
  )
}

function SheetOverlay({
  className,
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string
  children: React.ReactNode
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="sheet-overlay"
      isDismissable
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 data-entering:opacity-0 data-exiting:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </ModalOverlayPrimitive>
  )
}

function Sheet({
  className,
  children,
  side = "right",
  showCloseButton = true,
  isOpen,
  onOpenChange,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
  Pick<React.ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    className?: string
    children: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
    showCloseButton?: boolean
    isOpen?: boolean
    onOpenChange?: (isOpen: boolean) => void
  }) {
  return (
    <SheetOverlay isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      <ModalPrimitive
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col bg-card border-border text-foreground shadow-2xl transition duration-200 ease-in-out data-entering:opacity-0 data-exiting:opacity-0",
          side === "left" &&
            "inset-y-0 left-0 h-full w-[85vw] max-w-sm border-r data-entering:translate-x-[-100%] data-exiting:translate-x-[-100%]",
          side === "right" &&
            "inset-y-0 right-0 h-full w-[85vw] max-w-sm border-l data-entering:translate-x-[100%] data-exiting:translate-x-[100%]",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto max-h-[85vh] border-t data-entering:translate-y-[100%] data-exiting:translate-y-[100%]",
          side === "top" &&
            "inset-x-0 top-0 h-auto max-h-[85vh] border-b data-entering:translate-y-[-100%] data-exiting:translate-y-[-100%]",
          className
        )}
      >
        <SheetPrimitive
          data-slot="sheet"
          className="relative flex h-full max-h-[inherit] flex-col gap-4 p-6 overflow-y-auto outline-hidden"
        >
          {children}
          {showCloseButton && (
            <div className="absolute top-4 right-4">
              <SheetClose />
            </div>
          )}
        </SheetPrimitive>
      </ModalPrimitive>
    </SheetOverlay>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Sheet> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <Sheet
      className={className}
      side={side}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </Sheet>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 pt-4 border-t border-border", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
  return (
    <Heading
      slot="title"
      data-slot="sheet-title"
      className={cn(
        "text-base font-bold text-foreground tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
  return (
    <div
      data-slot="sheet-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  type SheetPrimitiveProps,
  type SheetTriggerPrimitiveProps,
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
