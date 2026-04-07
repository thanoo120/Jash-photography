import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button, SectionHeader, Badge } from "@/components/ui/index";
import { getServices } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description: "Professional photography services — specializing in birthdays, graduations, model shoots, pre-shoots  and event coverage for organizations and home functions, with a natural and creative style.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ServicesPage() {
  const serviceList = await getServices();

  const categories = [
    { key: "all", label: "All Services" },
    { key: "graduation", label: "Graduation" },
    { key: "pre-shoot", label: "Pre-Shoot" },
    { key: "event", label: "Event" },
    { key: "model-shoot", label: "Model-Shoot" },
    { key: "Birthday", label: "Birthday" },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative py-20 lg:py-28 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80"
            alt="Services hero"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/80 to-obsidian-950" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400 mb-4">What We Offer</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-5 leading-tight">
            Photography <em className="italic text-gold-400">Services</em>
          </h1>
          <p className="text-obsidian-300 max-w-xl mx-auto leading-relaxed">
            Every shoot is an opportunity to create something timeless. Choose your service — we handle everything else.
          </p>
        </div>
      </section>

      {/* Category filters (visual only - client-side filtering could be added) */}
      <section className="sticky top-16 lg:top-20 z-30 bg-cream/95 dark:bg-obsidian-950/95 backdrop-blur-md border-b border-obsidian-200 dark:border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => (
            <span
              key={cat.key}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border border-obsidian-200 dark:border-obsidian-700 text-obsidian-600 dark:text-obsidian-300 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400"
            >
              {cat.label}
            </span>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 lg:py-20 bg-cream dark:bg-obsidian-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceList.length === 0 && (
              <p className="col-span-full text-center text-sm text-obsidian-500 py-12">
                No services returned from the API. Check backend URL (e.g. NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL) and database seed data.
              </p>
            )}
            {serviceList.map((service, i) => (
              <article
                key={service.id}
                className="group bg-white dark:bg-obsidian-900 rounded-sm overflow-hidden border border-obsidian-100 dark:border-obsidian-800 card-hover flex flex-col sm:flex-row"
              >
                {/* Image */}
                <div className="img-zoom relative sm:w-52 shrink-0 h-52 sm:h-auto">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 208px"
                  />
                  {service.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="featured">Featured</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-mono bg-obsidian-950/70 text-obsidian-200 px-2 py-0.5 rounded">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono uppercase tracking-wide text-gold-600 dark:text-gold-400">
                        {service.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-obsidian-400">
                        <Clock size={10} /> {service.duration}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-medium text-obsidian-900 dark:text-obsidian-50 mb-2">
                      {service.title}
                    </h2>
                    <p className="text-sm text-obsidian-500 dark:text-obsidian-400 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-1 mb-4">
                      {service.includes.slice(0, 3).map((inc) => (
                        <li key={inc} className="flex items-center gap-2 text-xs text-obsidian-600 dark:text-obsidian-400">
                          <CheckCircle size={12} className="text-gold-500 shrink-0" />
                          {inc}
                        </li>
                      ))}
                      {service.includes.length > 3 && (
                        <li className="text-xs text-obsidian-400 pl-5">
                          +{service.includes.length - 3} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-obsidian-100 dark:border-obsidian-800">
                    <div>
                      <p className="text-xs text-obsidian-400">From</p>
                      <p className="font-display text-xl text-gold-600 dark:text-gold-400">
                        {formatPrice(service.price)}
                        <span className="text-sm font-body text-obsidian-400"> /{service.priceUnit}</span>
                      </p>
                    </div>
                    <Link href="/booking">
                      <Button size="sm" className="gap-1.5">
                        Book Now <ArrowRight size={13} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="py-16 lg:py-20 bg-obsidian-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeader
            eyebrow="How It Works"
            title="Simple, Seamless Booking"
            subtitle="From enquiry to delivery — here's what to expect when you book with us."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Choose Service", desc: "Select the photography package that fits your needs." },
              { step: "02", title: "Book Online", desc: "Complete the booking form with your details and preferred date." },
              { step: "03", title: "Shoot Day", desc: "We arrive prepared, set up, and create magic together." },
              { step: "04", title: "Receive Gallery", desc: "Edited images delivered to your private online gallery." },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 3 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-obsidian-800" />
                )}
                <div className="w-12 h-12 rounded-full border-2 border-gold-500 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-sm text-gold-400">{item.step}</span>
                </div>
                <h3 className="font-display text-lg text-white mb-2">{item.title}</h3>
                <p className="text-xs text-obsidian-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
