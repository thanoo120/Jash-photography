"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, Camera } from "lucide-react";
import { Button, Input, Textarea, Select } from "@/components/ui/index";
import { createBooking, getServices } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Service } from "@/types";
import { formatPrice } from "@/lib/utils";

const timeOptions = [
  { value: "", label: "Preferred Time" },
  { value: "9:00", label: "9:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "17:00", label: "5:00 PM (Golden Hour)" },
];

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    date: "",
    time: "",
    guests: "",
    message: "",
  });

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  const serviceOptions = useMemo(
    () => [
      { value: "", label: "Select a Service" },
      ...services.map((s) => ({
        value: s.id,
        label: `${s.title} — from ${formatPrice(s.price)}`,
      })),
    ],
    [services]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = getAccessToken();
    if (!token) {
      setError("Please login first to submit a booking request.");
      return;
    }

    const numericServiceId = Number(form.serviceType.replace(/\D/g, ""));
    if (!numericServiceId) {
      setError("Invalid service selection. Please choose a service.");
      return;
    }

    setSubmitting(true);
    const ok = await createBooking(token, {
      serviceId: numericServiceId,
      bookingDate: form.date,
      startTime: form.time || "09:00",
      location: "",
      specialRequests: form.message,
    });
    setSubmitting(false);

    if (!ok) {
      setError("Booking submission failed. Please check login and backend server.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="pt-20 bg-cream dark:bg-obsidian-950 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80"
            alt="Booking hero"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/70 to-obsidian-950" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400 mb-4">Reserve Your Session</p>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white mb-4 leading-tight">
            Book a <em className="italic text-gold-400">Session</em>
          </h1>
          <p className="text-obsidian-300 max-w-lg mx-auto">
            Fill in the form below and we&apos;ll get back to you within 24 hours to confirm your booking.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-6">
                  <h3 className="font-display text-xl text-obsidian-900 dark:text-obsidian-50 mb-4">
                    What to Expect
                  </h3>
                  {[
                    { icon: Calendar, text: "Confirmation within 24 hours" },
                    { icon: Clock, text: "Flexible scheduling available" },
                    { icon: Camera, text: "Pre-shoot consultation included" },
                    { icon: CheckCircle, text: "Gallery delivered in 7–14 days" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="w-7 h-7 rounded-sm bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center shrink-0">
                        <Icon size={13} className="text-gold-600 dark:text-gold-400" />
                      </div>
                      <p className="text-sm text-obsidian-600 dark:text-obsidian-400 leading-snug">{text}</p>
                    </div>
                  ))}
                </div>

                {/* Service quick preview */}
                <div className="bg-obsidian-950 rounded-sm p-5 border border-obsidian-800">
                  <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-4">
                    Popular Packages
                  </p>
                  {(services.some((s) => s.featured) ? services.filter((s) => s.featured) : services.slice(0, 4)).map(
                    (s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between py-2.5 border-b border-obsidian-800 last:border-0"
                      >
                        <span className="text-sm text-obsidian-300">{s.title}</span>
                        <span className="text-sm font-display text-gold-400">{formatPrice(s.price)}+</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-12 text-center">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={28} className="text-gold-600 dark:text-gold-400" />
                  </div>
                  <h2 className="font-display text-3xl text-obsidian-900 dark:text-obsidian-50 mb-3">
                    Booking Received!
                  </h2>
                  <p className="text-sm text-obsidian-500 dark:text-obsidian-400 max-w-sm mx-auto mb-6">
                    Thank you, <strong className="text-obsidian-800 dark:text-obsidian-100">{form.name}</strong>! 
                    We&apos;ll review your request and get back to you at {form.email} within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-8">
                  <h2 className="font-display text-2xl text-obsidian-900 dark:text-obsidian-50 mb-6">
                    Your Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      id="name"
                      name="name"
                      label="Full Name"
                      placeholder="Jane Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="jane@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <Input
                      id="guests"
                      name="guests"
                      type="number"
                      label="Number of Subjects"
                      placeholder="1"
                      min={1}
                      value={form.guests}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <Select
                      id="serviceType"
                      name="serviceType"
                      label="Service Type"
                      options={serviceOptions}
                      required
                      value={form.serviceType}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      label="Preferred Date"
                      required
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <Select
                      id="time"
                      name="time"
                      label="Preferred Time"
                      options={timeOptions}
                      value={form.time}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-6">
                    <Textarea
                      id="message"
                      name="message"
                      label="Additional Details"
                      placeholder="Tell us about your vision, location preferences, special requirements..."
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gold-50 dark:bg-gold-900/10 border border-gold-200 dark:border-gold-800 rounded-sm mb-6">
                    <CheckCircle size={14} className="text-gold-600 shrink-0" />
                    <p className="text-xs text-obsidian-600 dark:text-obsidian-400">
                      No payment required now. We&apos;ll send a formal quote after confirming availability.
                    </p>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 mb-4">
                      {error}{" "}
                      <Link href="/login" className="underline">
                        Go to login
                      </Link>
                    </p>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Booking Request"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
