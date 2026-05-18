import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <span className="eyebrow-chip">{eyebrow}</span> : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}
