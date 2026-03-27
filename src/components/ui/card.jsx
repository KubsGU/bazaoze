import { cn } from '../../lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('space-y-2', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-zinc-300', className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn('', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
