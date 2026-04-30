import { Mail, Phone, MapPin, Clock } from "lucide-react";
import MovingCircleBg from "@/components/MovingCircleBg";

const info = [
  { icon: Mail, label: "Email", value: "scholarship@sanpablo.gov.ph" },
  { icon: Phone, label: "Phone", value: "(049) 123-4567" },
  { icon: MapPin, label: "Address", value: "City Hall, San Pablo City, Laguna" },
  { icon: Clock, label: "Hours", value: "Mon-Fri, 8:00 AM - 5:00 PM" },
];

export default function ContactPage() {
  return (
    <main className="page-shell pt-36 pb-24 relative overflow-hidden">
      <MovingCircleBg />
      <div className="page-container relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-12 items-start">

          <section className="section-divider pt-10">
            <div className="mb-9">
              <p className="eyebrow mb-4">Get in Touch</p>
              <h1 className="page-title text-5xl md:text-6xl mb-5">
                Contact Us
              </h1>
              <p className="lead text-base max-w-md">
                Have questions about requirements, deadlines, or application status? Reach San Pablo Scholars through official city channels.
              </p>
            </div>

            <div className="space-y-4">
              {info.map((item) => (
                <div key={item.label} className="surface flex gap-4 p-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: "var(--green-soft)" }}>
                    <item.icon className="w-4 h-4" style={{ color: "var(--green-deep)" }} />
                  </div>
                  <div>
                    <p className="value-label mb-1">{item.label}</p>
                    <p className="font-body text-sm font-medium" style={{ color: "var(--green-deep)" }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="surface-muted mt-5 p-5">
              <p className="value-label mb-2">Best for status questions</p>
              <p className="lead text-sm">
                Include your application reference code if you already submitted an application.
              </p>
            </div>
          </section>

          <section className="surface w-full overflow-hidden">
            <div className="bg-[var(--green-deep)] p-7 text-[var(--cream)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/58">San Pablo Scholars Help Desk</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-none">Send a Message</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/68">
                For application help, document questions, and status follow-ups.
              </p>
            </div>
            <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="value-label">Full Name</label>
                  <input type="text" placeholder="Juan dela Cruz"
                    className="field-control px-4 py-3 text-sm font-body" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="value-label">Email</label>
                  <input type="email" placeholder="juan@email.com"
                    className="field-control px-4 py-3 text-sm font-body" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="value-label">Message</label>
                  <textarea rows={5} placeholder="Your message here..."
                    className="field-control px-4 py-3 text-sm font-body resize-none" />
                </div>
                <button
                  className="btn-primary mt-2 px-6 py-3 text-sm font-body">
                  Send Message
                </button>
              </div>
              <div className="rounded-2xl bg-[var(--cream)] p-5">
                <p className="value-label mb-3">Common questions</p>
                <div className="space-y-3 text-sm text-[var(--green-deep)]">
                  <p className="rounded-xl bg-[var(--paper)] p-3 font-medium">Missing or incorrect reference code</p>
                  <p className="rounded-xl bg-[var(--paper)] p-3 font-medium">Document requirement clarification</p>
                  <p className="rounded-xl bg-[var(--paper)] p-3 font-medium">Profile or contact detail update</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
