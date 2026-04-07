import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, CheckCircle } from "lucide-react";
import { Button, StarRating, Badge } from "@/components/ui/index";
import { getGalleryProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const products = await getGalleryProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const products = await getGalleryProducts();
  const product = products.find((p) => p.id === params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const products = await getGalleryProducts();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  return (
    <div className="pt-20 bg-cream dark:bg-obsidian-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 mb-8">
          <Link href="/shop" className="flex items-center gap-1.5 text-sm text-obsidian-500 hover:text-gold-600 transition-colors">
            <ArrowLeft size={14} /> Shop
          </Link>
          <span className="text-obsidian-300">/</span>
          <span className="text-sm text-obsidian-700 dark:text-obsidian-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-3">
            <div className="relative rounded-sm overflow-hidden h-96 lg:h-[500px] bg-obsidian-100 dark:bg-obsidian-900">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-obsidian-950/40 flex items-center justify-center">
                  <Badge variant="unavailable" className="text-sm px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative rounded-sm overflow-hidden h-20 cursor-pointer border-2 border-transparent hover:border-gold-500 transition-colors"
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="100px" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400 font-medium">
                {product.category}
              </span>
              {product.featured && <Badge variant="featured">Featured</Badge>}
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-light text-obsidian-900 dark:text-obsidian-50 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={product.rating} />
              <span className="text-sm text-obsidian-500">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="text-obsidian-600 dark:text-obsidian-400 leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-600 dark:text-obsidian-300 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-display text-4xl text-obsidian-900 dark:text-obsidian-50">
                {formatPrice(product.price)}
              </span>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle size={12} /> In Stock
                </span>
              ) : (
                <span className="text-xs text-red-500">Out of Stock</span>
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex items-center border border-obsidian-200 dark:border-obsidian-700 rounded-sm">
                <button
                  type="button"
                  className="px-3 py-2.5 text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2.5 text-sm font-medium">1</span>
                <button
                  type="button"
                  className="px-3 py-2.5 text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 transition-colors"
                >
                  +
                </button>
              </div>
              <Button size="lg" variant="primary" disabled={!product.inStock} className="flex-1 gap-2">
                <ShoppingCart size={16} />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <button
                type="button"
                title="Add to Wishlist"
                className="p-3 border border-obsidian-200 dark:border-obsidian-700 rounded-sm hover:border-gold-400 hover:text-gold-600 transition-colors"
              >
                <Heart size={18} />
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-sm text-obsidian-500 hover:text-obsidian-900 dark:hover:text-obsidian-100 transition-colors mb-8"
            >
              <Share2 size={14} /> Share this product
            </button>

            <div className="border-t border-obsidian-200 dark:border-obsidian-800 pt-6 grid grid-cols-2 gap-3">
              {[
                { icon: "🎨", text: "Archival quality guaranteed" },
                { icon: "📦", text: "Protected packaging" },
                { icon: "↩️", text: "30-day returns" },
                { icon: "🌿", text: "Eco-friendly materials" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs text-obsidian-500 dark:text-obsidian-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-obsidian-200 dark:border-obsidian-800 pt-12">
            <h2 className="font-display text-2xl text-obsidian-900 dark:text-obsidian-50 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.id}`}
                  className="group card-hover bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 overflow-hidden"
                >
                  <div className="img-zoom relative h-40">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="33vw" unoptimized />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-obsidian-900 dark:text-obsidian-100 mb-1">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base text-gold-600 dark:text-gold-400">{formatPrice(p.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-gold-500 fill-gold-500" />
                        <span className="text-xs text-obsidian-400">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
