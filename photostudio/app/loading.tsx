export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-obsidian-600 dark:text-obsidian-400">Loading...</p>
      </div>
    </div>
  );
}