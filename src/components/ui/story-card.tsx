import { cn } from "@/lib/utils";

// The one reusable "storybook page" wrapper every section uses — soft, rounded,
// generous, with an optional little guide character beside the title.
export function StoryCard({
  title,
  icon,
  children,
  className,
}: {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-border bg-card p-5 shadow-cute", className)}>
      {title != null && (
        <div className="mb-4 flex items-center gap-2.5">
          {icon}
          <h2 className="font-heading text-xl font-semibold text-plum">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
