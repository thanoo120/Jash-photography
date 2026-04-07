export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-100 dark:bg-obsidian-950">
      {children}
    </div>
  );
}