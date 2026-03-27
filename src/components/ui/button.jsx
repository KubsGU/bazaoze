import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60',
  {
    variants: {
      variant: {
        default:
          'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400',
        secondary:
          'border border-white/20 bg-white/5 text-white hover:bg-white/10',
      },
      size: {
        default: 'h-11 px-6',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
