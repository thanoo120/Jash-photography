import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Star, Camera, Package, MapPin, Sparkles } from "lucide-react";
import { Button, SectionHeader, StarRating } from "@/components/ui/index";
import HeroSlideshow from "@/components/equipment/HeroSlideshow";
import heroImg1 from "@/lib/assests/hero/image1.png";
import heroImg2 from "@/lib/assests/hero/image2.png";
import heroImg4 from "@/lib/assests/hero/4.png";
import heroImg5 from "@/lib/assests/hero/5.png";
import heroImg6 from "@/lib/assests/hero/6.png";
import {
  getAggregatedReviews,
  getEquipment,
  getGalleryProducts,
  getServices,
} from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  // Use Promise.allSettled to prevent one failed API call from blocking others
  const [servicesResult, equipmentResult, reviewsResult, galleryResult] = await Promise.allSettled([
    getServices(),
    getEquipment(),
    getAggregatedReviews(),
    getGalleryProducts(),
  ]);

  const servicesList = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
  const equipmentList = equipmentResult.status === 'fulfilled' ? equipmentResult.value : [];
  const reviewsList = reviewsResult.status === 'fulfilled' ? reviewsResult.value : [];
  const galleryList = galleryResult.status === "fulfilled" ? galleryResult.value : [];

  const featuredServices = servicesList.some((s) => s.featured)
    ? servicesList.filter((s) => s.featured).slice(0, 3)
    : servicesList.slice(0, 3);

  const featuredEquipment = equipmentList.some((e) => e.featured)
    ? equipmentList.filter((e) => e.featured).slice(0, 4)
    : equipmentList.slice(0, 4);

  const featuredReviews = reviewsList.slice(0, 3);
  const galleryPreview = galleryList.slice(0, 4);
  const reviewAvg =
    reviewsList.length > 0
      ? reviewsList.reduce((a, r) => a + r.rating, 0) / reviewsList.length
      : 0;
  const sessionsShot = servicesList.length * 75 + reviewsList.length * 5;
  const satisfiedRate = reviewsList.length > 0 ? Math.min(99, Math.round((reviewAvg / 5) * 100)) : 98;
  const coverageLabel = equipmentList.length > 0 ? `${equipmentList.length}+ Gear Items` : "All Island";

  const adminHeroImages = galleryList
    .filter((p) => p.name.toLowerCase().startsWith("hero-slide:"))
    .flatMap((p) => p.images || [])
    .filter(Boolean);
  const temporaryLocalHeroImages = [heroImg1.src, heroImg2.src, heroImg4.src, heroImg5.src, heroImg6.src];
  const galleryHeroImages = galleryList
    .filter((p) => !p.name.toLowerCase().startsWith("hero-slide:"))
    .flatMap((p) => p.images || [])
    .filter(Boolean);
  const equipmentHeroImages = equipmentList.map((e) => e.image).filter(Boolean);
  const fallbackImages = Array.from(new Set([...temporaryLocalHeroImages, ...galleryHeroImages, ...equipmentHeroImages])).slice(0, 8);
  const uniqueAdminImages = Array.from(new Set(adminHeroImages)).slice(0, 8);
  const heroSlideshowImages =
    uniqueAdminImages.length >= 2
      ? uniqueAdminImages
      : fallbackImages;

  return (
    <div className="overflow-hidden">
      {/* ── HERO (left copy + right animated slideshow; images from gallery + equipment = admin-editable) ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#eef1f4]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(45,137,196,0.08),transparent_50%)]" />

        <div className="relative z-10 max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-20 lg:pt-20 lg:pb-20 w-full">
          <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="flex items-center justify-center lg:justify-start gap-2 text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-sky-600 mb-6">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" aria-hidden />
                Jash Photography
              </p>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-obsidian-900 leading-[1.08] mb-6 tracking-tight">
                <span className="block">Your Story.</span>
                <span className="block text-[#2D89C4]">Our Camera.</span>
              </h1>

              <p className="text-base sm:text-lg text-obsidian-600 max-w-xl lg:max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                We make you feel confident in front of the lens. Professional shoots,
                equipment support, and a smooth booking flow across Sri Lanka.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link href="/booking">
                  <Button
                    size="lg"
                    variant="primary"
                    className="gap-2 !bg-[#2D89C4] hover:!bg-[#2578ad] !text-white !shadow-[0_12px_32px_rgba(45,137,196,0.35)] border-0"
                  >
                    Book a Session
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 bg-white border-obsidian-200 text-obsidian-900 hover:border-[#2D89C4] hover:text-[#2D89C4]"
                  >
                    <Play size={14} className="fill-current" />
                    Explore Services
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0 border-t border-obsidian-200/80 pt-8 justify-items-center lg:justify-items-start text-center lg:text-left">
                {[
                  { value: `${sessionsShot.toLocaleString()}+`, label: "Sessions Shot" },
                  { value: `${satisfiedRate}%`, label: "Client Satisfaction" },
                  { value: coverageLabel, label: "Coverage" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#2D89C4]">{stat.value}</p>
                    <p className="text-xs md:text-sm text-obsidian-500 mt-1.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2 lg:-mr-10 xl:-mr-16">
              <HeroSlideshow
                variant="light"
                images={heroSlideshowImages}
                imageAlt="Jash Photography showcase"
                className="h-[56vh] sm:h-[64vh] lg:h-[86vh] xl:h-[90vh]"
              />
              <div className="absolute -bottom-4 left-4 sm:left-6 z-10 max-w-[min(100%,280px)] rounded-2xl border border-white/80 bg-white/90 backdrop-blur-md p-4 shadow-lg">
                <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#2D89C4] mb-1">
                  Bookings Open
                </p>
                <p className="text-sm text-obsidian-700 font-medium leading-snug">Limited seasonal slots available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#2D89C4]/80">
          <div className="w-0.5 h-10 bg-gradient-to-b from-[#2D89C4]/30 via-[#2D89C4] to-transparent rounded-full" />
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold">Scroll</p>
        </div>
      </section>

      {/* ── QUICK TRUST STRIP ───────────────────────────────────────── */}
      <section className="relative py-6 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 overflow-hidden">
        <div className="absolute inset-0 opacity-50 pointer-events-none bg-[radial-gradient(circle_at_25%_40%,rgba(79,177,230,0.2),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(250,204,21,0.18),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {[
            { icon: Camera, text: "Professional Shoots" },
            { icon: Package, text: "Equipment Rental" },
            { icon: MapPin, text: "Available Across Sri Lanka" },
            { icon: Star, text: "Trusted by Happy Clients" },
          ].map(({ icon: Icon, text }, index) => {
            const delayClasses = ["delay-100", "delay-150", "delay-200", "delay-300"];
            return (
              <div
                key={text}
                className={`group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-gold-400/35 opacity-0 animate-fade-up ${delayClasses[index]}`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/20 text-gold-300 group-hover:bg-gold-500/30 transition-colors duration-300">
                  <Icon size={14} />
                </span>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white tracking-[0.04em]">{text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── THROUGH THE LENS ────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-cream dark:bg-obsidian-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Through the Lens"
            title="Moments That Feel Alive"
            subtitle="A quick look at the visual style we create for weddings, birthdays, portraits, and events."
          />

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(galleryPreview.length > 0
              ? galleryPreview.map((item) => ({
                  src: item.images[0],
                  alt: item.name,
                }))
              : [
                  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=80", alt: "Gallery sample 1" },
                  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80", alt: "Gallery sample 2" },
                  { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80", alt: "Gallery sample 3" },
                  { src: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=900&q=80", alt: "Gallery sample 4" },
                ]).map((item, i) => (
              <div key={`${item.src}-${i}`} className="relative rounded-3xl overflow-hidden aspect-[4/5] card-hover">
                <Image
                  src={item.src}
                  alt={item.alt || `Gallery sample ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/35 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button variant="outline" size="sm" className="gap-2">
                See More Work <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ──────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-cream via-white to-cream dark:from-obsidian-950 dark:via-obsidian-950 dark:to-obsidian-900">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_10%_20%,rgba(79,177,230,0.16),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(245,158,11,0.14),transparent_30%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col items-center mb-14">
            <SectionHeader
              eyebrow="Our Services"
              title="Photography Packages"
              subtitle="Choose from curated service packages designed for real stories and natural emotions."
            />
            <Link href="/services" className="mt-6">
              <Button variant="outline" size="sm" className="gap-2">
                All Services <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
                  className={`card-hover group bg-white/90 dark:bg-obsidian-900/85 rounded-3xl overflow-hidden border border-white/70 dark:border-obsidian-700 shadow-[0_20px_60px_rgba(17,24,39,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transform transition duration-500 ease-out hover:-translate-y-1.5 opacity-0 animate-fade-up ${delayClasses[i]}`}
                >
                  <div className="img-zoom relative h-56 sm:h-64">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-semibold tracking-wide bg-white/85 text-obsidian-900 px-2.5 py-1 rounded-full border border-white/60">
                        0{i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl md:text-[1.75rem] lg:text-3xl font-medium text-obsidian-900 dark:text-obsidian-50 mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-obsidian-500 dark:text-obsidian-400 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs md:text-sm text-obsidian-400 dark:text-obsidian-500">From</p>
                        <p className="font-display text-xl md:text-2xl text-gold-600 dark:text-gold-400">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                      <Link href="/booking">
                        <Button size="sm" className="transition-all duration-300 group-hover:translate-y-0.5">
                          Explore More
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

      {/* ── BOOKINGS OPEN CTA BAND ─────────────────────────────────── */}
      <section className="py-12 bg-obsidian-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-obsidian-900 to-obsidian-950 px-6 sm:px-10 py-8 flex flex-col sm:flex-row gap-5 items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-gold-400 mb-1">Bookings Are Now Open</p>
              <p className="text-obsidian-200 text-sm sm:text-base md:text-lg">Limited slots available for the upcoming season.</p>
            </div>
            <Link href="/booking">
              <Button size="lg">Book Your Session</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EQUIPMENT RENTAL ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-warm-white dark:bg-obsidian-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-12 gap-4">
            <SectionHeader
              eyebrow="Rent Pro Gear"
              title="Equipment Rental"
              subtitle="Access the world's finest cameras, lenses, and lighting — without the commitment."
              centered={false}
            />
            <Link href="/equipment" className="shrink-0 sm:mt-2">
              <Button variant="outline" size="sm" className="gap-2">
                View All Gear <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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
                  className={`card-hover h-full bg-white dark:bg-obsidian-950 rounded-3xl border border-obsidian-100 dark:border-obsidian-800 overflow-hidden shadow-lg dark:shadow-black/20 group transform transition duration-500 ease-out hover:-translate-y-1 opacity-0 animate-fade-up flex flex-col ${delayClasses[index]}`}
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
                  <div className="p-5 flex flex-1 flex-col">
                    <p className="text-xs text-obsidian-400 dark:text-obsidian-500 uppercase tracking-wide font-mono mb-1">
                      {item.brand}
                    </p>
                    <h3 className="font-medium text-obsidian-900 dark:text-obsidian-100 text-sm md:text-base lg:text-lg leading-tight min-h-[3.5rem] mb-3">
                      {item.name}
                    </h3>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-display text-lg md:text-xl lg:text-2xl text-gold-600 dark:text-gold-400">
                          {formatPrice(item.pricePerDay)}
                        </span>
                        <span className="text-xs md:text-sm text-obsidian-400"> /day</span>
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
              eyebrow="What Our Clients Say"
              title={`Real Stories, Real Emotions`}
              subtitle="Feedback from clients who trusted us with their milestones."
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <StarRating rating={reviewAvg || 5} />
              <span className="text-sm md:text-base text-obsidian-600">
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
                  <p className="text-sm md:text-base text-obsidian-700 dark:text-obsidian-100 leading-relaxed mb-6 italic">
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
                      <p className="text-sm md:text-base font-medium text-obsidian-900 dark:text-obsidian-50">{review.name}</p>
                      <p className="text-xs md:text-sm text-obsidian-500 dark:text-obsidian-400">{review.service}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT + FINAL CTA ──────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1600&q=80"
            alt="Book a session CTA"
            fill
            className="object-cover opacity-20 dark:opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream dark:from-obsidian-950 via-cream/90 dark:via-obsidian-950/90 to-cream dark:to-obsidian-950" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4">
            About Jash Photography
          </p>
          <div className="mx-auto mb-8 rounded-[2rem] border border-white/70 bg-white/85 dark:bg-obsidian-950/85 p-10 shadow-2xl backdrop-blur-xl">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-obsidian-900 dark:text-white font-light mb-5 leading-tight">
              Ready to capture your <em className="italic text-gold-500">story?</em>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-obsidian-500 dark:text-obsidian-400 mb-8 max-w-2xl mx-auto">
              At Jash Photography, we transform your moments into lasting memories with creativity,
              professionalism, and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="shadow-xl transition-transform duration-300 hover:-translate-y-0.5">
                  Book Your Session
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="shadow-inner transition-transform duration-300 hover:-translate-y-0.5">
                  Let&apos;s Talk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
