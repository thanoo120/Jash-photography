import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Star, Camera, Package, ShoppingBag } from "lucide-react";
import { Button, SectionHeader, StarRating } from "@/components/ui/index";
import { getAggregatedReviews, getEquipment, getServices } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  // Use Promise.allSettled to prevent one failed API call from blocking others
  const [servicesResult, equipmentResult, reviewsResult] = await Promise.allSettled([
    getServices(),
    getEquipment(),
    getAggregatedReviews(),
  ]);

  const servicesList = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
  const equipmentList = equipmentResult.status === 'fulfilled' ? equipmentResult.value : [];
  const reviewsList = reviewsResult.status === 'fulfilled' ? reviewsResult.value : [];

  const featuredServices = servicesList.some((s) => s.featured)
    ? servicesList.filter((s) => s.featured).slice(0, 3)
    : servicesList.slice(0, 3);

  const featuredEquipment = equipmentList.some((e) => e.featured)
    ? equipmentList.filter((e) => e.featured).slice(0, 4)
    : equipmentList.slice(0, 4);

  const featuredReviews = reviewsList.slice(0, 3);
  const reviewAvg =
    reviewsList.length > 0
      ? reviewsList.reduce((a, r) => a + r.rating, 0) / reviewsList.length
      : 0;

  return (
    <div className="overflow-hidden">
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-obsidian-50 via-blue-50 to-obsidian-50">
        <div className="absolute inset-0 noise-overlay pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/80 to-transparent opacity-80 pointer-events-none" />
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl animate-float opacity-70" />

        {/* Decorative lines - Left */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-1">
          {[...Array(8)].map((_, i) => {
            const opacityClasses = ['opacity-100', 'opacity-90', 'opacity-80', 'opacity-70', 'opacity-60', 'opacity-50', 'opacity-40', 'opacity-30'];
            return (
              <div key={i} className={`w-px h-8 bg-gold-500/40 ${opacityClasses[i]} animate-fade-in`} />
            );
          })}
        </div>

        {/* Decorative lines - Right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-1">
          {[...Array(8)].map((_, i) => {
            const opacityClasses = ['opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-80', 'opacity-90', 'opacity-100'];
            return (
              <div key={i} className={`w-px h-8 bg-gold-500/40 ${opacityClasses[i]} animate-fade-in`} />
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-mono tracking-[0.45em] uppercase text-gold-500 mb-6 opacity-0 animate-fade-up">
            ✨ Premium Photography Studio
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-obsidian-900 leading-[1.05] mb-6 tracking-tight">
            <span className="block opacity-0 animate-fade-up">
              Every Frame,
            </span>
            <span className="block bg-gradient-to-r from-gold-500 via-blue-500 to-gold-600 bg-clip-text text-transparent opacity-0 animate-fade-up delay-100">
              a Masterpiece
            </span>
          </h1>

          <p className="text-base sm:text-lg text-obsidian-600 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-blur-in delay-150">
            We capture life&apos;s most meaningful moments with artistry and precision.
            Photography services, premium equipment rental, and fine art prints — all under one roof.
          </p>

          {/* Button Container with hover effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" variant="primary" className="gap-2 animate-scale-in hover:animate-glow shadow-2xl hover:shadow-2xl transition-all duration-300 delay-200">
                Book a Session
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="ghost" className="text-obsidian-900 hover:text-gold-500 gap-2 animate-scale-in border-2 border-obsidian-200 hover:border-gold-500 transition-all duration-300 delay-300">
                <Play size={14} className="fill-current" />
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Premium Stats with animation */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-gold-200/30 pt-10 justify-items-center text-center">
            {[
              { value: "2,400+", label: "Sessions Shot" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "12 Yrs", label: "Experience" },
            ].map((stat, index) => {
              const delayClasses = ["delay-300", "delay-400", "delay-500"];
              return (
                <div key={stat.label} className={`opacity-0 animate-fade-up ${delayClasses[index]}`}>
                  <p className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-500 to-blue-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-obsidian-500 mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <div className="w-0.5 h-12 bg-gradient-to-b from-gold-500/30 via-gold-500 to-transparent rounded-full" />
          <p className="text-xs text-gold-500 tracking-widest uppercase font-semibold">Scroll</p>
        </div>
      </section>

      {/* ── INTRO STRIP ─────────────────────────────────────────────── */}
      <section className="bg-gold-500 py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {[
            { icon: Camera, text: "Professional Studio" },
            { icon: Package, text: "Equipment Rental" },
            { icon: ShoppingBag, text: "Fine Art Prints" },
            { icon: Star, text: "5-Star Rated" },
          ].map(({ icon: Icon, text }, index) => {
            const delayClasses = ["delay-100", "delay-150", "delay-200", "delay-300"];
            return (
              <div
                key={text}
                className={`flex items-center gap-3 rounded-full bg-white/15 px-4 py-3 shadow-sm ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white/25 opacity-0 animate-fade-up ${delayClasses[index]}`}
              >
                <Icon size={16} className="text-obsidian-950" />
                <span className="text-sm font-semibold text-obsidian-950 tracking-wide">{text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED SERVICES ──────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-obsidian-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <SectionHeader
              eyebrow="What We Do"
              title="Photography Services"
              subtitle="From intimate portraits to grand celebrations, our team delivers images that move, inspire, and endure."
            />
            <Link href="/services" className="mt-6">
              <Button variant="outline" size="sm" className="gap-2">
                All Services <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredServices.length === 0 && (
              <p className="col-span-full text-center text-sm text-obsidian-500">
                No services loaded yet. Add services in the backend and ensure the API URL is correct.
              </p>
            )}
            {featuredServices.map((service, i) => {
              const delayClasses = ["delay-100", "delay-150", "delay-200"];
              return (
                <div
                  key={service.id}
                  className={`card-hover group bg-white dark:bg-obsidian-900 rounded-3xl overflow-hidden border border-obsidian-100 dark:border-obsidian-800 shadow-xl dark:shadow-black/30 transform transition duration-500 ease-out hover:-translate-y-1 opacity-0 animate-fade-up ${delayClasses[i]}`}
                >
                <div className="img-zoom relative h-56 sm:h-64">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-mono bg-obsidian-950/80 text-gold-400 px-2.5 py-1 rounded-full">
                      0{i + 1}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 dark:text-obsidian-50 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-obsidian-400 dark:text-obsidian-500">From</p>
                      <p className="font-display text-xl text-gold-600 dark:text-gold-400">
                        {formatPrice(service.price)}
                      </p>
                    </div>
                    <Link href="/booking">
                      <Button size="sm" className="transition-all duration-300 group-hover:translate-y-0.5">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH SPLIT ───────────────────────────────────────────
      <section className="grid lg:grid-cols-2 min-h-[60vh]">
        <div className="relative h-64 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1000&q=80"
            alt="Studio interior"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="bg-obsidian-950 flex items-center p-10 lg:p-16">
          <div className="max-w-md">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-gold-400 mb-4">
              Our Studio
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-white mb-5 leading-tight">
              A Space Built for Great Work
            </h2>
            <p className="text-obsidian-400 text-sm leading-relaxed mb-8">
              Our 4,000 sq ft studio features professional lighting rigs, a wide selection of backdrops, 
              a client lounge, and a gear room stocked with the latest camera equipment. 
              Whether you&apos;re shooting solo or hosting a production, we have everything you need.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Sq Ft Studio", value: "4,000" },
                { label: "Backdrop Options", value: "30+" },
                { label: "Lighting Setups", value: "12" },
                { label: "Gear Items", value: "80+" },
              ].map((item) => (
                <div key={item.label} className="border border-obsidian-800 p-3 rounded-sm">
                  <p className="font-display text-2xl text-gold-400">{item.value}</p>
                  <p className="text-xs text-obsidian-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <Link href="/contact">
              <Button variant="primary">Tour the Studio</Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* ── EQUIPMENT RENTAL ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-warm-white dark:bg-obsidian-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <SectionHeader
              eyebrow="Rent Pro Gear"
              title="Equipment Rental"
              subtitle="Access the world's finest cameras, lenses, and lighting — without the commitment."
              centered={false}
            />
            <Link href="/equipment" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-2">
                View All Gear <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEquipment.length === 0 && (
              <p className="col-span-full text-center text-sm text-obsidian-500">
                No equipment loaded yet. Check that the backend is running and CORS allows this origin.
              </p>
            )}
            {featuredEquipment.map((item, index) => {
              const delayClasses = ["delay-100", "delay-150", "delay-200", "delay-300"];
              return (
                <div
                  key={item.id}
                  className={`card-hover bg-white dark:bg-obsidian-950 rounded-3xl border border-obsidian-100 dark:border-obsidian-800 overflow-hidden shadow-lg dark:shadow-black/20 group transform transition duration-500 ease-out hover:-translate-y-1 opacity-0 animate-fade-up ${delayClasses[index]}`}
                >
                <div className="img-zoom relative h-44">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.available
                          ? "bg-emerald-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      {item.available ? "Available" : "Rented"}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-obsidian-400 dark:text-obsidian-500 uppercase tracking-wide font-mono mb-1">
                    {item.brand}
                  </p>
                  <h3 className="font-medium text-obsidian-900 dark:text-obsidian-100 text-sm leading-tight mb-3">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-display text-lg text-gold-600 dark:text-gold-400">
                        {formatPrice(item.pricePerDay)}
                      </span>
                      <span className="text-xs text-obsidian-400"> /day</span>
                    </div>
                    <Link href="/equipment">
                      <Button size="sm" variant={item.available ? "primary" : "ghost"} disabled={!item.available}>
                        {item.available ? "Rent" : "Notify"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-obsidian-50 via-blue-50 to-obsidian-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <SectionHeader
              eyebrow="Client Stories"
              title={`What Our Clients Say`}
              subtitle="We let the work — and our clients — speak for us."
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <StarRating rating={reviewAvg || 5} />
              <span className="text-sm text-obsidian-600">
                {reviewsList.length > 0
                  ? `${reviewAvg.toFixed(1)} average from ${reviewsList.length} published review${reviewsList.length === 1 ? "" : "s"}`
                  : "Reviews appear after they are approved in the admin panel"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredReviews.length === 0 && (
              <p className="col-span-full text-center text-sm text-obsidian-500">
                No approved reviews yet. They load from the backend once published.
              </p>
            )}
            {featuredReviews.map((review, index) => {
              const delayClasses = ["delay-100", "delay-200", "delay-300"];
              return (
                <div
                  key={review.id}
                  className={`bg-white/95 dark:bg-obsidian-950/95 rounded-3xl p-6 border border-obsidian-200/70 dark:border-obsidian-800 shadow-2xl hover:shadow-2xl transition-shadow duration-300 relative animate-fade-up ${delayClasses[index]}`}
                >
                <div className="text-4xl text-gold-500/40 font-display leading-none mb-4">&ldquo;</div>
                <p className="text-sm text-obsidian-700 dark:text-obsidian-100 leading-relaxed mb-6 italic">
                  {review.comment.length > 180 ? `${review.comment.slice(0, 180)}…` : review.comment}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-obsidian-900 dark:text-obsidian-50">{review.name}</p>
                    <p className="text-xs text-obsidian-500 dark:text-obsidian-400">{review.service}</p>
                  </div>
                  <div className="ml-auto">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/reviews">
              <Button variant="outline" className="border-obsidian-300 text-obsidian-700 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-50 transition-all duration-300">
                Read All Reviews <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80"
            alt="Book a session CTA"
            fill
            className="object-cover opacity-25 dark:opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream dark:from-obsidian-950 via-cream/90 dark:via-obsidian-950/90 to-cream dark:to-obsidian-950" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="mx-auto mb-8 rounded-[2rem] border border-white/70 bg-white/85 dark:bg-obsidian-950/85 p-10 shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4">
              Ready to Begin?
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-obsidian-900 dark:text-white font-light mb-5 leading-tight">
              Let&apos;s Create Something <em className="italic text-gold-500">Extraordinary</em>
            </h2>
            <p className="text-obsidian-500 dark:text-obsidian-400 mb-8 max-w-lg mx-auto">
              Book your session today and experience photography at its finest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="shadow-xl transition-transform duration-300 hover:-translate-y-0.5">
                  Book a Session
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="shadow-inner transition-transform duration-300 hover:-translate-y-0.5">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
