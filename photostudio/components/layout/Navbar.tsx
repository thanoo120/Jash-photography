"use client";
import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { clearAuthSession, getAuthUser } from "@/lib/auth";
import Image from 'next/image';
import logo from "../../lib/assests/jash-logo.png";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/equipment", label: "Equipment" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  /** Top of home hero: was transparent + light gray links → invisible on white */
  const heroTop = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out animate-in",
        "after:block after:h-px after:bg-gradient-to-r after:from-transparent after:via-gold-500 after:to-transparent after:opacity-60",
        heroTop
          ? "bg-black/95 backdrop-blur-xl border-b border-gold-500/25 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
          : "bg-black/95 backdrop-blur-2xl border-b border-gold-500/20 shadow-[0_1px_40px_rgba(0,0,0,0.45)]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 min-h-[96px] py-2.5 sm:min-h-[104px] lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6">

          {/* Logo + wordmark */}
          <Link
            href="/"
            className={cn(
              "order-1 lg:order-none lg:justify-self-start group flex items-center gap-1 sm:gap-1.5 shrink-0 hover-lift motion-safe:transition-transform motion-safe:duration-300",
              "motion-safe:hover:scale-[1.01]"
            )}
          >
            <Image
              src={logo}
              alt="Jash Photography"
              width={360}
              height={360}
              sizes="(max-width: 640px) 260px, 320px"
              priority
              className={cn(
                "h-20 w-auto max-h-20 sm:h-24 sm:max-h-24 md:h-[6rem] md:max-h-[6rem] lg:h-[5.75rem] lg:max-h-[5.75rem] object-contain object-left",
                "max-w-[min(340px,70vw)] sm:max-w-none",
                "motion-safe:transition-transform motion-safe:duration-300 group-hover:opacity-95",
                ""
              )}
            />
            <span
              className={cn(
                "text-[30px] sm:text-[34px] md:text-[38px] lg:text-[34px] font-semibold tracking-[0.08em] uppercase leading-tight motion-safe:transition-colors duration-300",
                heroTop
                  ? "text-obsidian-50"
                  : "text-obsidian-50"
              )}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              JASH<span className="text-gold-500"> Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul
            className={cn(
              "order-2 lg:order-none hidden lg:flex lg:justify-self-center lg:justify-center items-center gap-0.5 list-none rounded-full px-2 py-1 motion-safe:transition-[background,box-shadow,border-color] motion-safe:duration-300",
              heroTop
                ? "bg-white/70 dark:bg-obsidian-900/60 border border-gold-500/20 shadow-inner"
                : "glass-panel border border-white/10"
            )}
          >
            {navLinks.map((link, i) => (
              <li
                key={`${link.href}-group`}
                className="flex items-center motion-safe:animate-[nav-link-in_0.5s_ease_both]"
                style={{ animationDelay: `${80 + i * 55}ms` }}
              >
                {i > 0 && (
                  <span>
                    <span
                      className={cn(
                        "w-[3px] h-[3px] rounded-full block mx-1 motion-safe:transition-colors",
                        heroTop ? "bg-gold-500/45 dark:bg-gold-500/35" : "bg-gold-500/30"
                      )}
                    />
                  </span>
                )}
                <Link
                  href={link.href}
                  className={cn(
                    "relative block px-5 py-2.5 text-[15px] font-semibold tracking-[0.14em] uppercase rounded-full",
                    "motion-safe:transition-[color,transform] motion-safe:duration-300 motion-safe:hover:scale-[1.04]",
                    "after:absolute after:bottom-0.5 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-full after:bg-gold-500",
                    "after:scale-x-0 after:origin-right motion-safe:after:transition-transform motion-safe:after:duration-300 motion-safe:after:ease-out",
                    "hover:after:scale-x-100 hover:after:origin-left",
                    pathname === link.href
                      ? "text-gold-600 dark:text-gold-400 after:scale-x-100 after:origin-left"
                      : heroTop
                        ? "text-obsidian-800 hover:text-gold-600 dark:text-obsidian-200 dark:hover:text-gold-400"
                        : "text-obsidian-200 hover:text-white"
                  )}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className="ml-2 motion-safe:animate-[nav-link-in_0.5s_ease_both]"
              style={{ animationDelay: "340ms" }}
            >
              <Link
                href="/booking"
                className={cn(
                  "nav-cta-shine relative inline-block overflow-hidden px-[22px] py-[10px] bg-gold-500 text-obsidian-950",
                  "text-[15px] font-semibold tracking-[0.12em] uppercase rounded-full hover-lift",
                  "shadow-md shadow-gold-500/25 motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-300",
                  "hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/35 active:scale-[0.98]"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Book Now
              </Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="order-3 lg:order-none lg:justify-self-end flex items-center gap-2.5">
            {userName ? (
              <button
                onClick={() => { clearAuthSession(); setUserName(null); }}
                className={cn(
                  "hidden sm:block text-[14px] font-semibold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full border-2 motion-safe:transition-all motion-safe:duration-300",
                  "hover:scale-[1.03] active:scale-[0.98]",
                  heroTop
                    ? "border-gold-500/50 text-obsidian-100 bg-obsidian-900/40 hover:bg-gold-500/10 hover:border-gold-500 hover:text-gold-400"
                    : "border-gold-500/50 text-obsidian-100 hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/10"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "hidden sm:block text-[14px] font-semibold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full border-2 motion-safe:transition-all motion-safe:duration-300",
                  "hover:scale-[1.03] active:scale-[0.98]",
                  heroTop
                    ? "border-gold-500/50 text-obsidian-100 bg-obsidian-900/40 hover:bg-gold-500/10 hover:border-gold-500 hover:text-gold-400"
                    : "border-gold-500/50 text-obsidian-100 hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/10"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "lg:hidden flex flex-col gap-[4.5px] items-end p-1.5 motion-safe:transition-colors motion-safe:duration-300",
                heroTop
                  ? "text-gold-800 hover:text-gold-600 dark:text-obsidian-200 dark:hover:text-gold-400"
                  : "text-obsidian-200 hover:text-gold-400"
              )}
              aria-label="Menu"
            >
              <span
                className={cn(
                  "block h-0.5 w-[22px] bg-current motion-safe:transition-transform motion-safe:duration-300 origin-center",
                  open && "translate-y-[6px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 bg-current motion-safe:transition-all motion-safe:duration-300",
                  open ? "w-0 opacity-0" : "w-4 opacity-100"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-[22px] bg-current motion-safe:transition-transform motion-safe:duration-300 origin-center",
                  open && "-translate-y-[6px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300",
        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="bg-obsidian-950/98 border-t border-gold-500/20 px-5 py-4 space-y-1 animate-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-3 py-2.5 text-[11px] font-normal tracking-[0.14em] uppercase transition-colors rounded-sm",
                pathname === link.href
                  ? "text-gold-400 bg-gold-500/10"
                  : "text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800/80"
              )}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="block px-3 py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-gold-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book Now →
          </Link>
          {userName ? (
            <button
              onClick={() => { clearAuthSession(); setUserName(null); }}
              className="block w-full text-left px-3 py-2.5 text-[11px] tracking-[0.14em] uppercase text-obsidian-400 hover:text-obsidian-100"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="block px-3 py-2.5 text-[11px] tracking-[0.14em] uppercase text-obsidian-400 hover:text-obsidian-100"
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