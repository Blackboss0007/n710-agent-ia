import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/12 text-violet",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        warning: "border-cyan/20 bg-cyan/10 text-cyan",
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
