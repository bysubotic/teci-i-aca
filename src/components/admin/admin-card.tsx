export function AdminCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-cute">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="font-heading text-xl font-semibold text-plum">{title}</h2>
      </div>
      {description && <p className="mt-1 text-[0.95rem] text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
