"use client"

import * as React from "react"
import { cn } from "cn"
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  Header as HeaderPrimitive,
  ListBoxItem as ListBoxItemPrimitive,
  ListBox as ListBoxPrimitive,
  ListBoxSection as ListBoxSectionPrimitive,
  Popover as PopoverPrimitive,
  Select as SelectPrimitive,
  SelectValue as SelectValuePrimitive,
  Separator as SeparatorPrimitive,
  type ListBoxProps,
  type ListBoxSectionProps as SelectGroupProps,
  type SelectProps as AriaSelectProps,
  type SelectValueProps,
} from "react-aria-components"
import { Check, ChevronDown } from "lucide-react"

function Select<T extends object>({
  className,
  ...props
}: AriaSelectProps<T> & { className?: string }) {
  return (
    <SelectPrimitive
      data-slot="select"
      className={cn("w-fit", className)}
      {...props}
    />
  )
}

function SelectGroup<T extends object>({
  className,
  ...props
}: SelectGroupProps<T>) {
  return (
    <ListBoxSectionPrimitive
      data-slot="select-group"
      className={cn("p-1", className)}
      {...props}
    />
  )
}

function SelectValue<T extends object>({
  className,
  ...props
}: SelectValueProps<T>) {
  return (
    <SelectValuePrimitive
      data-slot="select-value"
      className={cn(
        "flex flex-1 text-left line-clamp-1 data-placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

interface SelectTriggerProps
  extends Omit<React.ComponentProps<typeof ButtonPrimitive>, "children"> {
  children?: React.ReactNode
  size?: "sm" | "default"
}

function SelectTrigger({
  className,
  size = "sm",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <ButtonPrimitive
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "relative inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground shadow-2xs transition-all outline-none hover:bg-muted/50 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none",
        size === "sm" ? "h-8 min-w-[130px]" : "h-9 min-w-[150px]",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <ChevronDown
            className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[open]:rotate-180"
            aria-hidden="true"
          />
        </>
      ))}
    </ButtonPrimitive>
  )
}

function SelectPopover({
  className,
  children,
  placement = "bottom start",
  offset = 4,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive>,
  "className" | "children"
> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <PopoverPrimitive
      data-slot="select-popover"
      placement={placement}
      offset={offset}
      className={cn(
        "z-50 min-w-(--trigger-width) max-h-72 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-150 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive>
  )
}

function SelectList<T extends object>({
  className,
  ...props
}: ListBoxProps<T>) {
  return (
    <ListBoxPrimitive
      data-slot="select-list"
      className={cn("p-1 max-h-60 overflow-y-auto outline-hidden", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  children,
  placement = "bottom start",
  offset = 4,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive>,
  "className" | "children"
> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <SelectPopover
      className={className}
      placement={placement}
      offset={offset}
      {...props}
    >
      <SelectList>{children}</SelectList>
    </SelectPopover>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ListBoxItemPrimitive>) {
  return (
    <ListBoxItemPrimitive
      data-slot="select-item"
      textValue={typeof children === "string" ? children : undefined}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between rounded-lg py-1.5 pr-7 pl-2.5 text-xs font-semibold text-foreground outline-hidden select-none transition-colors data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[selected]:font-bold data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          <span className="truncate">{children}</span>
          <span className="absolute right-2 flex size-3.5 items-center justify-center">
            {isSelected && <Check className="size-3.5 text-blue-600" aria-hidden="true" />}
          </span>
        </>
      ))}
    </ListBoxItemPrimitive>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof HeaderPrimitive>) {
  return (
    <HeaderPrimitive
      data-slot="select-label"
      className={cn("px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border/60", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectPopover,
  SelectList,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
}
