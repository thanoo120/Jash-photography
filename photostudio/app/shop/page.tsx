import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Button, Badge, SectionHeader } from "@/components/ui/index";
import { getGalleryProducts } from "@/lib/api";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description: "Museum-quality prints, heirloom albums, frames, and photography accessories.",
};

export const revalidate = 300; // Revalidate every 5 minutes

const categoryFilters = [
  { key: "all", label: "All Products" },
  { key: "print", label: "Prints" },
  { key: "frame", label: "Frames" },
  { key: "album", label: "Albums" },
  { key: "gift", label: "Gift Sets" },
  { key: "accessory", label: "Accessories" },
];

export default async function ShopPage() {
  const products = await getGalleryProducts();
  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);

  return (
    <div className="pt-20">
      <section className="relative py-16 lg:py-24 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&q=80"
            alt="Shop hero"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/70 to-obsidian-950" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400 mb-4">Fine Art & Products</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-5 leading-tight">
            The <em className="italic text-gold-400">Shop</em>
          </h1>
          <p className="text-obsidian-300 max-w-xl mx-auto leading-relaxed">
            Items shown here come from your backend gallery (portfolio / print catalog). Add items via the API or admin tools.
          </p>
        </div>
      </section>

      <section className="sticky top-16 lg:top-20 z-30 bg-cream/95 dark:bg-obsidian-950/95 backdrop-blur-md border-b border-obsidian-200 dark:border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3 gap-4">
          <div className="flex gap-2 overflow-x-auto">
            {categoryFilters.map((cat) => (
              <span
                key={cat.key}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer border border-obsidian-200 dark:border-obsidian-700 text-obsidian-600 dark:text-obsidian-300 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
              >
                {cat.label}
              </span>
            ))}
          </div>
          <select title="Sort by" className="shrink-0 text-xs border border-obsidian-200 dark:border-obsidian-700 bg-transparent text-obsidian-600 dark:text-obsidian-300 rounded-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-400">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Rated</option>
          </select>
        </div>
      </section>

      <section className="py-12 bg-cream dark:bg-obsidian-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <p className="text-center text-sm text-obsidian-500 py-16">
              No gallery items from the API. Seed gallery data in the backend or add items via the admin API.
            </p>
          ) : (
            <>
              {featured.length > 0 && (
                <>
                  <p className="text-xs font-mono tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-6">
                    Featured
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {featured.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <div className="border-t border-obsidian-200 dark:border-obsidian-800 my-12" />
                </>
              )}

              {featured.length > 0 && rest.length > 0 && (
                <>
                  <p className="text-xs font-mono tracking-[0.2em] uppercase text-obsidian-400 mb-6">
                    All Products
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {rest.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
              {featured.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-12 bg-warm-white dark:bg-obsidian-900 border-t border-obsidian-200 dark:border-obsidian-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { emoji: "🎨", title: "Museum-Quality", desc: "Archival inks, premium papers" },
              { emoji: "📦", title: "Safe Shipping", desc: "Protective packaging always" },
              { emoji: "↩️", title: "Easy Returns", desc: "30-day hassle-free policy" },
              { emoji: "🌿", title: "Sustainable", desc: "Eco-friendly materials" },
            ].map((item) => (
              <div key={item.title}>
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="text-sm font-medium text-obsidian-900 dark:text-obsidian-100">{item.title}</p>
                <p className="text-xs text-obsidian-500 dark:text-obsidian-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`}>
      <article className="card-hover group bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 overflow-hidden cursor-pointer">
        <div className="img-zoom relative h-52">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 25vw"
            unoptimized
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-obsidian-950/50 flex items-center justify-center">
              <Badge variant="unavailable">Out of Stock</Badge>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="featured">Featured</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gold-600 dark:text-gold-400 font-medium uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-display text-lg text-obsidian-900 dark:text-obsidian-50 mb-1 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.floor(product.rating) ? "text-gold-500 fill-gold-500" : "text-obsidian-300"}
                />
              ))}
            </div>
            <span className="text-xs text-obsidian-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display text-xl text-obsidian-900 dark:text-obsidian-50">
              {formatPrice(product.price)}
            </span>
            <button
              className="flex items-center gap-1.5 text-xs font-medium bg-gold-500 hover:bg-gold-600 text-obsidian-950 px-3 py-1.5 rounded-sm transition-colors"
              type="button"
            >
              <ShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
