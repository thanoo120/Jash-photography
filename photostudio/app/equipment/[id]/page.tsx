import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, ArrowRight } from "lucide-react";
import { Button, Badge } from "@/components/ui/index";
import { getEquipmentById, parseEquipmentDetailIdParam } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type Props = { params: { id: string } };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseEquipmentDetailIdParam(params.id);
  if (!n) {
    return { title: "Equipment" };
  }
  const item = await getEquipmentById(n);
  if (!item) {
    return { title: "Equipment not found" };
  }
  return {
    title: `${item.name} — Rental`,
    description: item.description.slice(0, 180),
  };
}

export default async function EquipmentDetailPage({ params }: Props) {
  const n = parseEquipmentDetailIdParam(params.id);
  if (!n) notFound();

  const item = await getEquipmentById(n);
  if (!item) notFound();

  const extraImages = (item.galleryImages || []).filter((u) => u && u !== item.image);

  const rentHref = item.available
    ? `/booking?equipment=${encodeURIComponent(item.id)}`
    : `/contact?subject=${encodeURIComponent(`Notify me: ${item.name}`)}`;

  return (
    <div className="pt-20 bg-cream dark:bg-obsidian-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-sm text-obsidian-500 hover:text-gold-600 dark:hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          All equipment
        </Link>

        <article>
          <div className="relative w-full aspect-[21/9] min-h-[220px] rounded-sm overflow-hidden border border-obsidian-200 dark:border-obsidian-800">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
            <div className="absolute top-4 left-3 flex flex-wrap gap-2">
              <Badge variant={item.available ? "available" : "unavailable"}>
                {item.available ? "Available" : "Rented out"}
              </Badge>
              <span className="text-xs font-mono bg-obsidian-950/80 text-obsidian-200 px-2 py-1 rounded uppercase tracking-wide">
                {item.category}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-xs font-medium text-gold-600 dark:text-gold-400 mb-1">{item.brand}</p>
              <h1 className="font-display text-4xl sm:text-5xl text-obsidian-900 dark:text-obsidian-50 mb-3">
                {item.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-obsidian-500">
                {item.reviewCount != null && item.reviewCount > 0 && item.averageRating != null && (
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-gold-500 fill-gold-500" />
                    {item.averageRating.toFixed(1)} ({item.reviewCount} review
                    {item.reviewCount === 1 ? "" : "s"})
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-xs text-obsidian-400">Daily rate</p>
              <p className="font-display text-3xl text-gold-600 dark:text-gold-400">
                {formatPrice(item.pricePerDay)}
                <span className="text-base font-body text-obsidian-400"> / day</span>
              </p>
              <Link href={rentHref} className="mt-4 inline-block">
                <Button size="lg" className="gap-2" variant={item.available ? "primary" : "outline"}>
                  {item.available ? (
                    <>
                      Rent now <ArrowRight size={16} />
                    </>
                  ) : (
                    "Notify when available"
                  )}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 max-w-none">
            <p className="text-obsidian-600 dark:text-obsidian-300 leading-relaxed text-base whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {item.specs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl text-obsidian-900 dark:text-obsidian-50 mb-4">Specifications</h2>
              <div className="flex flex-wrap gap-2">
                {item.specs.map((spec) => (
                  <span
                    key={spec}
                    className="text-sm bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-700 dark:text-obsidian-300 px-3 py-1.5 rounded-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {extraImages.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl text-obsidian-900 dark:text-obsidian-50 mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extraImages.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-[4/3] rounded-sm overflow-hidden border border-obsidian-200 dark:border-obsidian-800"
                  >
                    <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-10 text-sm text-obsidian-500">
            Details, pricing, availability, and photos are maintained in the{" "}
            <Link href="/admin" className="text-gold-600 dark:text-gold-400 hover:underline">
              admin
            </Link>{" "}
            panel.
          </p>
        </article>
      </div>
    </div>
  );
}
