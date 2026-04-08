"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/control", label: "Control" },
  { href: "/tracker", label: "Tracker" },
  { href: "/countries", label: "Countries" },
  { href: "/programs", label: "Programs" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/documents", label: "Documents" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 lg:flex-col">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors lg:rounded-2xl lg:px-4 lg:py-3 ${
              isActive
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                : "bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
