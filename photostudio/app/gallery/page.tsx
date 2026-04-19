import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, SectionHeader } from "@/components/ui/index";
import { getGalleryProducts } from "@/lib/api";

export const revalidate = 300;

export default async function GalleryPage() {
  const galleryList = await getGalleryProducts();

  const items =
    galleryList.length > 0
      ? galleryList
      : [
          {
            id: "fallback-1",
            name: "Wedding Story",
            description: "Beautiful wedding moments captured with natural light.",
            images: ["https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80"],
          },
          {
            id: "fallback-2",
            name: "Portrait Session",
            description: "Creative portrait sessions for personal and professional needs.",
            images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80"],
          },
          {
            id: "fallback-3",
            name: "Event Highlights",
            description: "Special event highlights delivered in premium quality.",
            images: ["https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80"],
          },
          {
            id: "fallback-4",
            name: "Studio Work",
            description: "Studio-style photos for products and branding.",
            images: ["https://images.unsplash.com/photo-1464863979621-258859e62245?w=1200&q=80"],
          },
        ];

  return (
    <div className="bg-cream dark:bg-obsidian-950 min-h-screen pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Gallery"
          title="Captured Moments"
          subtitle="Browse our recent work across weddings, portraits, and events."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl overflow-hidden bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-obsidian-800 shadow-lg"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-obsidian-900 dark:text-obsidian-50">{item.name}</h3>
                <p className="text-sm text-obsidian-600 dark:text-obsidian-300 mt-2">
                  {item.description || "Gallery showcase image"}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/booking">
            <Button size="lg" className="gap-2">
              Book a Session
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
