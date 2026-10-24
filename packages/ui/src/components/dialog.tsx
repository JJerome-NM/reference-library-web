"use client"

import * as React from "react"
import { cn } from "cn"
import {
  Dialog as DialogPrimitive,
  DialogTrigger as DialogTriggerPrimitive,
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  type DialogProps as DialogPrimitiveProps,
  type DialogTriggerProps as DialogTriggerPrimitiveProps,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components"
import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

function DialogTrigger({ ...props }: DialogTriggerPrimitiveProps) {
  return <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />
}

interface DialogCloseProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  children?: React.ReactNode
}

function DialogClose({
  className,
  children,
  ...props
}: DialogCloseProps) {
  return (
    <Button
      slot="close"
      data-slot="dialog-close"
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

function DialogOverlay({
  className,
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string
  children: React.ReactNode
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="dialog-overlay"
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

function DialogContent({
  className,
  children,
  showCloseButton = true,
  isOpen,
  onOpenChange,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
  Pick<React.ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    className?: string
    children: React.ReactNode
    showCloseButton?: boolean
    isOpen?: boolean
    onOpenChange?: (isOpen: boolean) => void
  }) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      <ModalPrimitive
        data-slot="dialog-modal"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl transition duration-200 ease-in-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0",
          className
        )}
      >
        <DialogPrimitive
          data-slot="dialog"
          className="relative flex flex-col gap-4 outline-hidden"
        >
          {children}
          {showCloseButton && (
            <div className="absolute top-0 right-0">
              <DialogClose />
            </div>
          )}
        </DialogPrimitive>
      </ModalPrimitive>
    </DialogOverlay>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2 pt-4 border-t border-border", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
  return (
    <Heading
      slot="title"
      data-slot="dialog-title"
      className={cn(
        "text-base font-bold text-foreground tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
  return (
    <div
      data-slot="dialog-description"
      className={cn("text-xs text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

export {
  type DialogPrimitiveProps,
  type DialogTriggerPrimitiveProps,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
