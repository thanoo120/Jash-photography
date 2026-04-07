"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button, Input, Textarea, Select } from "@/components/ui/index";

const subjectOptions = [
  { value: "", label: "What is this about?" },
  { value: "booking", label: "Booking Enquiry" },
  { value: "rental", label: "Equipment Rental" },
  { value: "products", label: "Products / Prints" },
  { value: "general", label: "General Question" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20 bg-cream dark:bg-obsidian-950 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"
            alt="Contact hero"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/80 to-obsidian-950" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-gold-400 mb-4">Get in Touch</p>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white mb-4 leading-tight">
            Let&apos;s <em className="italic text-gold-400">Talk</em>
          </h1>
          <p className="text-obsidian-300 max-w-lg mx-auto">
            Have a question, idea, or project in mind? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact info sidebar */}
            <aside className="lg:col-span-2 space-y-5">
              {/* Info card */}
              <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-6">
                <h3 className="font-display text-xl text-obsidian-900 dark:text-obsidian-50 mb-5">
                  Studio Information
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      label: "Address",
                      value: "42 Aperture Lane, Photography District, Los Angeles, CA 90210",
                      href: "https://maps.google.com",
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: "+1 (555) 123-4567",
                      href: "tel:+15551234567",
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: "hello@lumierestudio.com",
                      href: "mailto:hello@lumierestudio.com",
                    },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900/20 rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={14} className="text-gold-600 dark:text-gold-400" />
                      </div>
                      <div>
                        <p className="text-xs text-obsidian-400 dark:text-obsidian-500 uppercase tracking-wide font-mono">{label}</p>
                        <a
                          href={href}
                          target={href.startsWith("https") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-obsidian-700 dark:text-obsidian-200 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                        >
                          {value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={15} className="text-gold-500" />
                  <h3 className="font-display text-lg text-obsidian-900 dark:text-obsidian-50">
                    Studio Hours
                  </h3>
                </div>
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
                  { day: "Saturday", hours: "10:00 AM – 5:00 PM" },
                  { day: "Sunday", hours: "By Appointment" },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between py-2 border-b border-obsidian-100 dark:border-obsidian-800 last:border-0">
                    <span className="text-xs text-obsidian-600 dark:text-obsidian-400">{day}</span>
                    <span className="text-xs font-medium text-obsidian-800 dark:text-obsidian-200">{hours}</span>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="relative h-48 rounded-sm overflow-hidden bg-obsidian-100 dark:bg-obsidian-900 border border-obsidian-200 dark:border-obsidian-800">
                <Image
                  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=60"
                  alt="Map placeholder"
                  fill
                  className="object-cover opacity-60"
                  sizes="400px"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white dark:bg-obsidian-900 rounded-sm px-4 py-2 shadow-lg flex items-center gap-2">
                    <MapPin size={14} className="text-gold-500" />
                    <span className="text-xs font-medium text-obsidian-800 dark:text-obsidian-100">
                      Lumière Studio
                    </span>
                  </div>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-end p-3"
                >
                  <span className="text-xs bg-obsidian-950/70 text-obsidian-200 px-2 py-1 rounded hover:bg-obsidian-950 transition-colors">
                    Open in Google Maps →
                  </span>
                </a>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle size={28} className="text-gold-600 dark:text-gold-400" />
                  </div>
                  <h2 className="font-display text-3xl text-obsidian-900 dark:text-obsidian-50 mb-3">
                    Message Sent!
                  </h2>
                  <p className="text-sm text-obsidian-500 dark:text-obsidian-400 max-w-sm mb-6">
                    Thank you, <strong className="text-obsidian-800 dark:text-obsidian-200">{form.name}</strong>. 
                    We&apos;ll reply to {form.email} within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-100 dark:border-obsidian-800 p-8 space-y-4">
                  <h2 className="font-display text-2xl text-obsidian-900 dark:text-obsidian-50 mb-2">
                    Send a Message
                  </h2>
                  <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mb-4">
                    We typically respond within 24 hours on business days.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="c-name" name="name" label="Full Name" placeholder="Jane Doe" required value={form.name} onChange={handleChange} />
                    <Input id="c-email" name="email" type="email" label="Email Address" placeholder="jane@example.com" required value={form.email} onChange={handleChange} />
                  </div>

                  <Select id="c-subject" name="subject" label="Subject" options={subjectOptions} value={form.subject} onChange={handleChange} />

                  <Textarea id="c-message" name="message" label="Your Message" placeholder="Tell us how we can help..." rows={6} required value={form.message} onChange={handleChange} />

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
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
