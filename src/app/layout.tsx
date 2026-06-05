import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scholarship.igat.com.ph";

export const metadata: Metadata = {
  title: "San Pablo Scholars",
  description: "Apply for Iskolar ng San Pablo and track your scholar record.",
  icons: {
    icon: "/Scholarship.svg",
  },
  openGraph: {
    title: "San Pablo Scholars",
    description: "Apply for Iskolar ng San Pablo and track your scholar record.",
    url: baseUrl,
    siteName: "San Pablo Scholars",
    images: [
      {
        url: `${baseUrl}/Scholarship.svg`,
        width: 488,
        height: 487,
        alt: "San Pablo Scholars Logo",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "San Pablo Scholars",
    description: "Apply for Iskolar ng San Pablo and track your scholar record.",
    images: [`${baseUrl}/Scholarship.svg`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
