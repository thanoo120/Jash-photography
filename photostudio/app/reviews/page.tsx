"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle } from "lucide-react";
import { Button, StarRating, Textarea, SectionHeader } from "@/components/ui/index";
import { getAggregatedReviews, getServices, submitReview } from "@/lib/api";
import { getAccessToken, getAuthUser } from "@/lib/auth";
import type { Review, Service } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ serviceId: "", comment: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [r, s] = await Promise.all([getAggregatedReviews(), getServices()]);
      if (!cancelled) {
        setReviews(r);
        setServices(s);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const token = getAccessToken();
    if (!token) {
      setSubmitError("Please log in to submit a review.");
      return;
    }
    const sid = Number(form.serviceId.replace(/\D/g, ""));
    if (!sid || !rating || form.comment.length < 10) {
      setSubmitError("Choose a service, rating, and write at least 10 characters.");
      return;
    }
    const ok = await submitReview(token, { serviceId: sid, rating, comment: form.comment });
    if (!ok) {
      setSubmitError("Could not submit review. Check login and backend.");
      return;
    }
    setSubmitted(true);
  };

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
    pct: reviews.length ? (reviews.filter((r) => Math.floor(r.rating) === star).length / reviews.length) * 100 : 0,
  }));

  const user = getAuthUser();

  return (
    <div className="pt-20 bg-cream dark:bg-obsidian-950 min-h-screen">
      <section className="relative py-16 lg:py-24 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"
            alt="Reviews hero"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/70 to-obsidian-950" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400 mb-4">Client Testimonials</p>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white mb-4">
            What Our Clients <em className="italic text-gold-400">Say</em>
          </h1>
          <p className="text-obsidian-300 max-w-lg mx-auto">
            Approved reviews load from the backend. New submissions are moderated before they appear.
          </p>
        </div>
      </section>

      <section className="py-12 bg-warm-white dark:bg-obsidian-900 border-b border-obsidian-200 dark:border-obsidian-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-sm text-obsidian-500">Loading reviews…</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="text-center shrink-0">
                <p className="font-display text-7xl text-gold-500 leading-none">{reviews.length ? avg.toFixed(1) : "—"}</p>
                <div className="flex justify-center mt-2 mb-1">
                  <StarRating rating={avg || 0} />
                </div>
                <p className="text-sm text-obsidian-500 dark:text-obsidian-400">
                  {reviews.length} published review{reviews.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex-1 w-full space-y-2">
                {dist.map((d) => (
                  <div key={d.star} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 w-14 justify-end shrink-0">
                      <span className="text-xs text-obsidian-600 dark:text-obsidian-400">{d.star}</span>
                      <Star size={11} className="text-gold-500 fill-gold-500" />
                    </div>
                    <div className="flex-1 h-2 bg-obsidian-200 dark:bg-obsidian-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-400 rounded-full" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="text-xs text-obsidian-500 w-6 shrink-0">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!loading && reviews.length === 0 && (
            <p className="text-center text-sm text-obsidian-500 mb-8">
              No approved reviews yet. Submit one below (requires login); an admin must approve it before it shows here.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-6 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                      <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="44px" unoptimized />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-obsidian-900 dark:text-obsidian-100">{review.name}</p>
                      <p className="text-xs text-obsidian-500">{review.service}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle size={12} />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>

                <StarRating rating={review.rating} />

                <p className="mt-3 text-sm text-obsidian-600 dark:text-obsidian-400 leading-relaxed">{review.comment}</p>

                <p className="mt-4 text-xs text-obsidian-400 dark:text-obsidian-500">{formatDate(review.date)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-warm-white dark:bg-obsidian-900 border-t border-obsidian-200 dark:border-obsidian-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-gold-600 dark:text-gold-400" />
              </div>
              <h2 className="font-display text-3xl text-obsidian-900 dark:text-obsidian-50 mb-2">
                Thank You{user?.fullName ? `, ${user.fullName}` : ""}!
              </h2>
              <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mb-5">
                Your review was submitted for moderation and will appear after approval.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ serviceId: "", comment: "" });
                  setRating(0);
                }}
                variant="outline"
              >
                Write Another Review
              </Button>
            </div>
          ) : (
            <>
              <SectionHeader
                eyebrow="Share Your Experience"
                title="Leave a Review"
                subtitle="Log in, pick a service, and tell others about your experience."
              />
              <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-obsidian-950 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-8 space-y-4">
                <p className="text-xs text-obsidian-500">
                  <Link href="/login" className="text-gold-600 underline">
                    Log in
                  </Link>{" "}
                  is required. Reviews are tied to your account.
                </p>

                <div>
                  <label htmlFor="serviceId" className="text-xs font-medium tracking-wide text-obsidian-600 dark:text-obsidian-400 uppercase block mb-2">
                    Service
                  </label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={form.serviceId}
                    onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-sm text-sm bg-white dark:bg-obsidian-900 border border-obsidian-200 dark:border-obsidian-700 text-obsidian-900 dark:text-obsidian-100 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <option value="">Select service…</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-obsidian-600 dark:text-obsidian-400 uppercase mb-2">
                    Your Rating
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5"
                        aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${s <= (hoverRating || rating) ? "text-gold-500 fill-gold-500" : "text-obsidian-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  id="comment"
                  name="comment"
                  label="Your Review"
                  placeholder="At least 10 characters — what made it special?"
                  rows={4}
                  required
                  minLength={10}
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                />

                {submitError && <p className="text-xs text-red-500">{submitError}</p>}

                <Button type="submit" size="lg" className="w-full" disabled={!rating}>
                  Submit Review
                </Button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
