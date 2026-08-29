import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-2xl border border-brand-200 bg-[#FAF8F5] px-3.5 py-2 text-xs sm:text-sm text-charcoal-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-2xl border border-brand-200 bg-[#FAF8F5] px-3.5 py-2 text-xs sm:text-sm text-charcoal-900 transition-colors placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Input, Textarea }
