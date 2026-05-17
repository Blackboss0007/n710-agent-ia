import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-violet",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        warning: "border-gold/25 bg-gold/10 text-gold",
        danger: "border-red-400/20 bg-red-400/10 text-red-300",
        muted: "border-white/10 bg-white/[0.04] text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
