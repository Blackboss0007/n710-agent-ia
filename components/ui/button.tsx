import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-[linear-gradient(135deg,rgba(139,92,246,0.95),rgba(112,72,255,0.82))] text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:brightness-110",
        secondary:
          "border-white/10 bg-white/[0.05] text-secondary-foreground hover:-translate-y-0.5 hover:bg-white/[0.08]",
        outline:
          "border-white/10 bg-white/[0.02] text-white/90 shadow-inset hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]",
        ghost: "border-transparent bg-transparent text-white/70 hover:bg-white/[0.06] hover:text-white",
        gold:
          "border-gold/30 bg-[linear-gradient(135deg,rgba(230,196,122,0.95),rgba(230,196,122,0.78))] text-black hover:-translate-y-0.5 hover:brightness-105"
      },
      size: {
        default: "px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6 text-[15px]",
        icon: "h-10 w-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
