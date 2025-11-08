"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MonitoringDashboard } from "@/components/dashboard/monitoring-dashboard"

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <MonitoringDashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
