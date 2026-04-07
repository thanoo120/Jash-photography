"use client";
import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Camera, ShoppingBag } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";
import { clearAuthSession, getAuthUser } from "@/lib/auth";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/equipment", label: "Equipment" },
  { href: "/shop", label: "Shop" },
  { href: "/booking", label: "Book Now" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const user = getAuthUser();
    setUserName(user?.fullName || null);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-white/95 dark:bg-obsidian-950/95 backdrop-blur-md border-b border-obsidian-200/50 dark:border-obsidian-800/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera size={16} className="text-obsidian-950" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-obsidian-900 dark:text-obsidian-50">
              JASH
              <span className="text-gold-500"> Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide underline-animate transition-colors",
                  pathname === link.href
                    ? "text-gold-600 dark:text-gold-400"
                    : "text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 dark:hover:text-obsidian-50",
                  link.href === "/booking" &&
                    "bg-gold-500 text-obsidian-950 px-4 py-2 rounded-sm hover:bg-gold-600 !no-underline transition-colors"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-sm text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 dark:hover:text-obsidian-50 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button> */}

            <Link
              href="/shop"
              className="hidden sm:flex p-2 rounded-sm text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 dark:hover:text-obsidian-50 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              aria-label="Shop"
            >
              <ShoppingBag size={18} />
            </Link>

            {userName ? (
              <button
                onClick={() => {
                  clearAuthSession();
                  setUserName(null);
                }}
                className="hidden sm:block text-xs px-3 py-1.5 rounded-sm border border-obsidian-300 dark:border-obsidian-700"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block text-xs px-3 py-1.5 rounded-sm border border-obsidian-300 dark:border-obsidian-700"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-sm text-obsidian-700 dark:text-obsidian-200 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-white dark:bg-obsidian-950 border-t border-obsidian-200 dark:border-obsidian-800 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-3 py-2.5 rounded-sm text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-950/20"
                  : "text-obsidian-700 dark:text-obsidian-200 hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
              )}
            >
              {link.label}
            </Link>
          ))}
          {userName ? (
            <button
              onClick={() => {
                clearAuthSession();
                setUserName(null);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-sm text-sm font-medium text-obsidian-700 dark:text-obsidian-200 hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="block px-3 py-2.5 rounded-sm text-sm font-medium text-obsidian-700 dark:text-obsidian-200 hover:bg-obsidian-100 dark:hover:bg-obsidian-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
