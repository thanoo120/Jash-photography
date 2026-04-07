import Link from "next/link";
import { Button } from "@/components/ui/index";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-obsidian-950 px-4">
      <div className="text-center">
        <p className="font-mono text-xs text-gold-500 tracking-[0.3em] uppercase mb-4">404 — Not Found</p>
        <h1 className="font-display text-7xl sm:text-9xl font-light text-obsidian-200 dark:text-obsidian-800 mb-4">
          Oops
        </h1>
        <p className="font-display text-2xl sm:text-3xl text-obsidian-700 dark:text-obsidian-300 mb-2">
          This frame is out of focus.
        </p>
        <p className="text-sm text-obsidian-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg">Back to Home</Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
