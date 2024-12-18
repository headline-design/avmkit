import * as React from "react"

// Utility function to combine class names
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

// Define button variants and sizes
const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/80 border-shadow",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "themed-border bg-background hover:text-accent-foreground border-shadow",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-shadow",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
}

// Base button class
const baseButtonClass = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass = buttonVariants.variant[variant]
    const sizeClass = buttonVariants.size[size]

    return (
      <button
        className={cn(baseButtonClass, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

