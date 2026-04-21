import { Mail, Phone, MapPin, Clock } from "lucide-react";

const info = [
  { icon: Mail,   label: "Email",   value: "scholarship@sanpablo.gov.ph" },
  { icon: Phone,  label: "Phone",   value: "(049) 123-4567" },
  { icon: MapPin, label: "Address", value: "City Hall, San Pablo City, Laguna" },
  { icon: Clock,  label: "Hours",   value: "Mon–Fri, 8:00 AM – 5:00 PM" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-28 pb-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-20">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--green-bright)" }}>Get in Touch</p>
          <h1 className="h1 font-display text-6xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: "var(--green-deep)" }}>
            Contact Us<br />
          </h1>
          <p className="font-body text-lg max-w-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Have questions about
            the scholarship program? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Contact info */}
          <div className="space-y-8">
            {info.map((item) => (
              <div key={item.label} className="flex gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: "var(--green-deep)" }}>
                  <item.icon className="w-4 h-4" style={{ color: "var(--cream)" }} />
                </div>
                <div>
                  <p className="font-mono text-xs tracking-widest uppercase mb-0.5"
                    style={{ color: "var(--muted)" }}>{item.label}</p>
                  <p className="font-body text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Simple form */}
          <div className="p-8 rounded-2xl border" style={{ background: "var(--parchment)", borderColor: "var(--sand)" }}>
            <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "var(--green-deep)" }}>
              Send a Message
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "var(--muted)" }}>Full Name</label>
                <input type="text" placeholder="Juan dela Cruz"
                  className="px-4 py-3 rounded-xl border text-sm font-body bg-white outline-none"
                  style={{ borderColor: "var(--sand)", color: "var(--ink)" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "var(--muted)" }}>Email</label>
                <input type="email" placeholder="juan@email.com"
                  className="px-4 py-3 rounded-xl border text-sm font-body bg-white outline-none"
                  style={{ borderColor: "var(--sand)", color: "var(--ink)" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "var(--muted)" }}>Message</label>
                <textarea rows={4} placeholder="Your message here..."
                  className="px-4 py-3 rounded-xl border text-sm font-body bg-white outline-none resize-none"
                  style={{ borderColor: "var(--sand)", color: "var(--ink)" }} />
              </div>
              <button
                className="mt-2 px-6 py-3 rounded-xl text-sm font-medium font-body transition hover:opacity-90"
                style={{ background: "var(--green-deep)", color: "var(--cream)" }}>
                Send Message →
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}