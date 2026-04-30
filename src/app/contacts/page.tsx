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

        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 items-start">

          <section className="section-divider pt-10">
            <div className="mb-9">
              <p className="eyebrow mb-4">Get in Touch</p>
              <h1 className="page-title text-5xl md:text-6xl mb-5">
                Contact Us
              </h1>
              <p className="lead text-base max-w-md">
                Have questions about requirements, deadlines, or application status? Reach the Scholarship Office through official city channels.
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
          </section>

          <section className="surface p-6 md:p-8 w-full">
            <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "var(--green-deep)" }}>
              Send a Message
            </h2>
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
                <textarea rows={4} placeholder="Your message here..."
                  className="field-control px-4 py-3 text-sm font-body resize-none" />
              </div>
              <button
                className="btn-primary mt-2 px-6 py-3 text-sm font-body">
                Send Message
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
