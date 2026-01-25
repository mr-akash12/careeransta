import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90 shadow-md hover:shadow-accent",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-primary text-white shadow-lg hover:shadow-primary hover:-translate-y-0.5 transition-all duration-300",
        heroOutline: "border-2 border-muted-foreground/30 bg-transparent text-foreground hover:border-primary hover:text-primary backdrop-blur-sm",
        accent: "bg-gradient-accent text-white shadow-lg hover:shadow-accent hover:-translate-y-0.5 transition-all duration-300",
        success: "bg-gradient-success text-white hover:opacity-90",
        premium: "bg-gradient-primary text-white shadow-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-glow",
        orange: "bg-gradient-orange text-white shadow-lg hover:shadow-[0_8px_30px_-4px_hsl(28_100%_50%_/_0.35)] hover:-translate-y-0.5 transition-all duration-300",
        yellow: "bg-gradient-yellow text-gray-900 shadow-lg hover:shadow-[0_8px_30px_-4px_hsl(45_100%_50%_/_0.35)] hover:-translate-y-0.5 transition-all duration-300",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
