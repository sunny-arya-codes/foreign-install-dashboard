import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Compass, ExternalLink } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Abroad Study Dashboard",
  description:
    "Structured dashboard for master's and PhD planning, scholarship tracking, and country-wise programme discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#f4f7f6_42%,_#eef3f1_100%)]">
          <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
            <aside className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_22px_70px_-35px_rgba(15,23,42,0.42)] backdrop-blur lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">
                      Dossier
                    </p>
                    <h1 className="text-lg font-semibold tracking-tight text-slate-950">
                      Abroad Study Dashboard
                    </h1>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-6 text-slate-500">
                  Master&apos;s and PhD planning system built from the research
                  dossier, converted into a structured decision dashboard.
                </p>

                <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                    Stack
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Next.js 16.2.2
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    App Router, React 19, Tailwind CSS v4
                  </p>
                </div>

                <div className="mt-6">
                  <SidebarNav />
                </div>

                <div className="mt-auto space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Source snapshot is embedded inside this app repo.
                  </p>
                  <Link
                    href="https://github.com/sunny-arya-codes/foreign-install"
                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition hover:text-teal-900"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Original dossier repo
                  </Link>
                </div>
              </div>
            </aside>

            <div className="rounded-[32px] border border-white/70 bg-white/70 p-4 shadow-[0_22px_70px_-38px_rgba(15,23,42,0.34)] backdrop-blur md:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
