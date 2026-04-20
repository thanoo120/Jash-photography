import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button, Badge, SectionHeader } from "@/components/ui/index";
import { getEquipment } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import HeroSlideshow from "@/components/equipment/HeroSlideshow";
import heroImg1 from "@/lib/assests/hero/image1.png";
import heroImg2 from "@/lib/assests/hero/image2.png";
import heroImg4 from "@/lib/assests/hero/4.png";
import heroImg5 from "@/lib/assests/hero/5.png";
import heroImg6 from "@/lib/assests/hero/6.png";

export const metadata: Metadata = {
  title: "Equipment Rental",
  description: "Rent professional cameras, lenses, lighting and more. Top-tier gear at competitive daily rates.",
};

export const revalidate = 300; // Revalidate every 5 minutes

const categories = [
  { key: "all", label: "All Gear" },
  { key: "camera", label: "Cameras" },
  { key: "lens", label: "Lenses" },
  { key: "lighting", label: "Lighting" },
  { key: "drone", label: "Drones" },
  { key: "accessory", label: "Accessories" },
];

type EquipmentPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default async function EquipmentPage({ searchParams }: EquipmentPageProps) {
  const equipmentList = await getEquipment();
  const backendHeroImages = equipmentList
    .map((item) => item.image)
    .filter(Boolean)
    .slice(0, 6);
  const temporaryLocalHeroImages = [heroImg1.src, heroImg2.src, heroImg4.src, heroImg5.src, heroImg6.src];
  const heroImages =
    Array.from(new Set(backendHeroImages)).length >= 2
      ? Array.from(new Set(backendHeroImages)).slice(0, 6)
      : Array.from(new Set([...backendHeroImages, ...temporaryLocalHeroImages])).slice(0, 6);
  const activeCategory = categories.some((c) => c.key === searchParams?.category)
    ? (searchParams?.category as string)
    : "all";

  const byCategory = (cat: string) =>
    cat === "all" ? equipmentList : equipmentList.filter((e) => e.category === cat);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.2),transparent_45%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/70 to-obsidian-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400 mb-4">Pro Gear Rental</p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-5 leading-tight">
                Shoot with the <em className="italic text-gold-400">Best</em>
              </h1>
              <p className="text-obsidian-300 max-w-xl leading-relaxed mb-8">
                Access world-class cameras, lenses, and lighting gear — rented by the day, delivered in perfect condition.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Free Cleaning Between Rentals", "Insurance Available", "Same-Day Collection"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5 text-xs text-obsidian-300">
                    <CheckCircle size={12} className="text-gold-500" /> {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <HeroSlideshow images={heroImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 lg:top-20 z-30 bg-cream/95 dark:bg-obsidian-950/95 backdrop-blur-md border-b border-obsidian-200 dark:border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 overflow-x-auto py-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const href = cat.key === "all" ? "/equipment" : `/equipment?category=${cat.key}`;
            return (
              <Link
                key={cat.key}
                href={href}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  isActive
                    ? "border-gold-500 bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-400"
                    : "border-obsidian-200 dark:border-obsidian-700 text-obsidian-600 dark:text-obsidian-300 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Equipment grid */}
      <section className="py-16 lg:py-20 bg-cream dark:bg-obsidian-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.length === 0 && (
              <p className="col-span-full text-center text-sm text-obsidian-500 py-12">
                No equipment returned from the API. Check backend and NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL.
              </p>
            )}
            {byCategory(activeCategory).map((item) => (
              <article
                key={item.id}
                className="card-hover group bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 overflow-hidden"
              >
                <div className="img-zoom relative h-52">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={item.available ? "available" : "unavailable"}>
                      {item.available ? "Available" : "Rented Out"}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-mono bg-obsidian-950/80 text-obsidian-200 px-2 py-0.5 rounded uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium text-gold-600 dark:text-gold-400 mb-1">{item.brand}</p>
                  <h3 className="font-display text-xl font-medium text-obsidian-900 dark:text-obsidian-50 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-obsidian-500 dark:text-obsidian-400 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.specs.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="text-xs bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-600 dark:text-obsidian-300 px-2 py-0.5 rounded-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-obsidian-100 dark:border-obsidian-800">
                    <div>
                      <span className="font-display text-xl text-gold-600 dark:text-gold-400">
                        {formatPrice(item.pricePerDay)}
                      </span>
                      <span className="text-xs text-obsidian-400"> / day</span>
                    </div>
                    <Link
                      href={
                        item.available
                          ? `/booking?equipment=${encodeURIComponent(item.id)}`
                          : `/contact?subject=${encodeURIComponent(`Notify me: ${item.name}`)}`
                      }
                    >
                      <Button size="sm" variant={item.available ? "primary" : "outline"}>
                        {item.available ? "Rent Now" : "Notify Me"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Rental info */}
      <section className="py-16 bg-warm-white dark:bg-obsidian-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Rental Policy"
            title="How Rental Works"
            subtitle="Everything you need to know before you book your gear."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Requirements",
                items: ["Valid Government ID", "Credit Card Hold", "Damage Waiver (optional)", "Must be 18+"],
              },
              {
                title: "Pickup & Return",
                items: ["Collection from studio", "Return by 6pm same day", "Multi-day rentals available", "Delivery available (LKR 8,000)"],
              },
              {
                title: "Insurance",
                items: ["Basic coverage included", "Premium damage waiver 15%", "Theft protection available", "Claim within 24 hrs"],
              },
            ].map((col) => (
              <div key={col.title} className="bg-white dark:bg-obsidian-950 rounded-sm p-6 border border-obsidian-100 dark:border-obsidian-800">
                <h3 className="font-display text-lg text-obsidian-900 dark:text-obsidian-50 mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-obsidian-600 dark:text-obsidian-400">
                      <CheckCircle size={13} className="text-gold-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/contact">
              <Button variant="outline" size="lg">Have Questions? Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
