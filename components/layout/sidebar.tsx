"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, BarChart3, Settings, AlertCircle, Gauge, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const routes = [
  {
    label: "Monitoring",
    items: [
      { href: "/", label: "Dashboard", icon: Activity },
      { href: "/compliance", label: "Compliance", icon: AlertCircle },
      { href: "/metrics", label: "Metrics", icon: Gauge },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/configuration", label: "Configuration", icon: Settings },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <UISidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wifi className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-sidebar-foreground">Telecom</h1>
            <p className="text-xs text-sidebar-accent">Assurance</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-muted-foreground px-4">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "text-sidebar-foreground hover:bg-sidebar-accent/10",
                        isActive && "bg-sidebar-primary/20 text-sidebar-primary",
                      )}
                    >
                      <Link href={item.href} className="gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </UISidebar>
  )
}
