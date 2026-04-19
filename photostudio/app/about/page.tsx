import Link from "next/link";
import { Camera, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button, SectionHeader } from "@/components/ui/index";

const highlights = [
  {
    icon: Camera,
    title: "Professional Quality",
    text: "We use modern equipment and editing workflows to deliver premium photos every time.",
  },
  {
    icon: Users,
    title: "Client-First Process",
    text: "From planning to delivery, we make each step easy, clear, and comfortable.",
  },
  {
    icon: Sparkles,
    title: "Creative Direction",
    text: "We help with styling, poses, and scene ideas so your photos feel natural and unique.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-cream to-white dark:from-obsidian-950 dark:to-obsidian-900 min-h-screen pt-36 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="About Jash Studio"
          title="Photography With Heart"
          subtitle="We capture memories with creativity, professionalism, and attention to detail."
        />

        <div className="mt-10 rounded-3xl border border-obsidian-200/60 dark:border-obsidian-700 bg-white/90 dark:bg-obsidian-900/90 p-6 sm:p-8 lg:p-10 shadow-xl">
          <p className="text-base md:text-lg text-obsidian-700 dark:text-obsidian-200 leading-relaxed">
            Jash Studio was built to help people preserve meaningful moments through timeless imagery.
            Whether it is a portrait session, event coverage, or studio shoot, we focus on making every
            frame tell a story.
          </p>
          <p className="text-base md:text-lg text-obsidian-700 dark:text-obsidian-200 leading-relaxed mt-5">
            Our team combines technical skill and artistic vision to create images that feel natural,
            emotional, and elegant. We believe great photography is not only about cameras - it is about
            connection, trust, and understanding your style.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-obsidian-200/70 dark:border-obsidian-700 bg-white dark:bg-obsidian-950 p-6 shadow-lg"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-500">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-obsidian-900 dark:text-obsidian-50">{title}</h3>
              <p className="mt-2 text-sm md:text-base text-obsidian-600 dark:text-obsidian-300">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Contact Us
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
