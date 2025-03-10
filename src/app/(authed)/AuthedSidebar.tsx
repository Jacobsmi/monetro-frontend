"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChartPie, Gauge } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthedSidebar() {
  const pathname = usePathname();
  const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <Gauge /> },
    { href: "/budget", label: "Budget", icon: <ChartPie /> },
  ];
  return (
    <Sidebar>
      <SidebarHeader className="p-4 text-xl font-bold">Monetro</SidebarHeader>
      <SidebarContent>
        {sidebarLinks.map((link) => (
          <SidebarMenuButton asChild key={link.href}>
            <Link
              href={link.href}
              className={`pl-4 flex items-center gap-2 ${
                pathname === link.href && "bg-sidebar-accent"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
