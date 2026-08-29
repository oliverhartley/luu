import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-brand-500 text-white shadow-md shadow-brand-500/25 hover:bg-brand-600",
        luxury:
          "bg-gradient-to-r from-brand-600 via-brand-500 to-roseGold-dark text-white shadow-lg shadow-brand-500/30 hover:opacity-95",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-brand-200 bg-white hover:bg-brand-50 text-charcoal-800",
        secondary:
          "bg-charcoal-100 text-charcoal-900 hover:bg-charcoal-200",
        ghost: "hover:bg-brand-50 text-charcoal-700 hover:text-brand-700",
        soft: "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200/60",
        dark: "bg-charcoal-950 text-white hover:bg-charcoal-900 shadow-md",
        whatsapp: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-12 rounded-2xl px-6 text-base font-bold",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
