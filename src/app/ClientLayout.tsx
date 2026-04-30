"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile") || pathname?.startsWith("/apply");

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {!isDashboard && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
