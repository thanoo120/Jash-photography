import Link from "next/link";
import { Camera, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 text-obsidian-200">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center">
                <Camera size={16} className="text-obsidian-950" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                JASH STUDIO<span className="text-gold-500"> Studio</span>
              </span>
            </Link>
            <p className="text-sm text-obsidian-400 leading-relaxed mb-6">
              Premium photography services and equipment rental. 
              Capturing life&apos;s most meaningful moments with artistry and precision.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-sm bg-obsidian-800 hover:bg-gold-500 flex items-center justify-center text-obsidian-300 hover:text-obsidian-950 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2.5">
              {["Wedding Photography", "Studio Portraits", "Event Coverage", "Outdoor Shoots", "Commercial", "Equipment Rental"].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-sm text-obsidian-400 hover:text-gold-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Book a Session", href: "/booking" },
                { label: "Rent Equipment", href: "/equipment" },
                { label: "Shop Prints", href: "/shop" },
                { label: "Customer Reviews", href: "/reviews" },
                { label: "Contact Us", href: "/contact" },
                { label: "Admin Panel", href: "/admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-obsidian-400 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm text-obsidian-400">
                  42 Aperture Lane, Photography District, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-gold-500 shrink-0" />
                <a href="tel:+15551234567" className="text-sm text-obsidian-400 hover:text-gold-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-gold-500 shrink-0" />
                <a href="mailto:hello@lumierestudio.com" className="text-sm text-obsidian-400 hover:text-gold-400 transition-colors">
                  hello@lumierestudio.com
                </a>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-obsidian-900 rounded-sm">
              <p className="text-xs text-obsidian-400">
                <span className="text-gold-500 font-medium">Studio Hours</span><br />
                Mon–Fri: 9am – 7pm<br />
                Sat–Sun: 10am – 5pm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-obsidian-500">
            © {new Date().getFullYear()} RootDevelopment. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-xs text-obsidian-500 hover:text-gold-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
