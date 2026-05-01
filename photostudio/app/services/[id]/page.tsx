import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, Star, ArrowRight } from "lucide-react";
import { Button, Badge } from "@/components/ui/index";
import { getServiceById, parseServiceDetailIdParam } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type Props = { params: { id: string } };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseServiceDetailIdParam(params.id);
  if (!n) {
    return { title: "Service" };
  }
  const service = await getServiceById(n);
  if (!service) {
    return { title: "Service not found" };
  }
  return {
    title: service.title,
    description: service.description.slice(0, 180),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const n = parseServiceDetailIdParam(params.id);
  if (!n) notFound();

  const service = await getServiceById(n);
  if (!service) notFound();

  const extraImages = (service.galleryImages || []).filter((u) => u && u !== service.image);

  return (
    <div className="pt-20 bg-cream dark:bg-obsidian-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-obsidian-500 hover:text-gold-600 dark:hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          All services
        </Link>

        <article>
          <div className="relative w-full aspect-[21/9] min-h-[220px] rounded-sm overflow-hidden border border-obsidian-200 dark:border-obsidian-800">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
            {service.featured && (
              <div className="absolute top-4 left-4">
                <Badge variant="featured">Featured</Badge>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-gold-600 dark:text-gold-400 mb-1">
                {service.category.replace("-", " ")}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-obsidian-900 dark:text-obsidian-50 mb-3">
                {service.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-obsidian-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {service.duration}
                </span>
                {service.reviewCount != null && service.reviewCount > 0 && service.averageRating != null && (
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-gold-500 fill-gold-500" />
                    {service.averageRating.toFixed(1)} ({service.reviewCount} review
                    {service.reviewCount === 1 ? "" : "s"})
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-xs text-obsidian-400">From</p>
              <p className="font-display text-3xl text-gold-600 dark:text-gold-400">
                {formatPrice(service.price)}
                <span className="text-base font-body text-obsidian-400"> /{service.priceUnit}</span>
              </p>
              <Link href={`/booking?service=${encodeURIComponent(service.id)}`}>
                <Button size="lg" className="gap-2">
                  Book this service <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 max-w-none">
            <p className="text-obsidian-600 dark:text-obsidian-300 leading-relaxed text-base whitespace-pre-line">
              {service.longDescription || service.description}
            </p>
          </div>

          {service.includes.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl text-obsidian-900 dark:text-obsidian-50 mb-4">What’s included</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-start gap-2 text-sm text-obsidian-600 dark:text-obsidian-400"
                  >
                    <CheckCircle size={16} className="text-gold-500 shrink-0 mt-0.5" />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {extraImages.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl text-obsidian-900 dark:text-obsidian-50 mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extraImages.map((url) => (
                  <div key={url} className="relative aspect-[4/3] rounded-sm overflow-hidden border border-obsidian-200 dark:border-obsidian-800">
                    <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-10 text-sm text-obsidian-500">
            Descriptions, pricing, inclusions, and images are managed in the{" "}
            <Link href="/admin" className="text-gold-600 dark:text-gold-400 hover:underline">
              admin
            </Link>{" "}
            panel and appear here automatically.
          </p>
        </article>
      </div>
    </div>
  );
}
