import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home",             href: "/" },
  { label: "About",            href: "/about" },
  { label: "How to Apply",     href: "/apply" },
  { label: "Track Application",href: "/track" },
  { label: "Contact",          href: "/contact" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                <GraduationCap className="w-6 h-6" style={{ color: "var(--green-light)" }} />
              </div>
              <div>
                <p className="font-display text-sm font-bold">Scholarship Office</p>
                <p className="font-mono text-[10px] tracking-wider uppercase opacity-50">
                  City Government of San Pablo
                </p>
              </div>
            </div>
            <p className="font-body text-sm leading-relaxed opacity-60 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Empowering students through accessible scholarship opportunities.
            </p>
            <div className="space-y-2 text-sm font-body opacity-60">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>scholarship@sanpablo.gov.ph</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>(049) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>City Hall, San Pablo City, Laguna</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.3em] uppercase mb-5 opacity-50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="font-body text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.3em] uppercase mb-5 opacity-50">
              Office Hours
            </h3>
            <div className="space-y-2 font-body text-sm opacity-60">
              <p>Monday – Friday</p>
              <p className="font-medium opacity-100" style={{ color: "var(--green-light)" }}>
                8:00 AM – 5:00 PM
              </p>
              <p className="mt-4 text-xs">Closed on weekends and public holidays.</p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="font-mono text-xs opacity-40">
            © {new Date().getFullYear()} City Government of San Pablo. All rights reserved.
          </p>
          <p className="font-mono text-xs tracking-widest uppercase opacity-30">
            Made with care for San Pablo students
          </p>
        </div>
      </div>
    </footer>
  );
}