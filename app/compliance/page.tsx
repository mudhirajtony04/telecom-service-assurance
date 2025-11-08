import { CompliancePage } from "@/components/pages/compliance-page"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1">
        <div className="px-8 py-6">
          <CompliancePage />
        </div>
      </div>
    </div>
  )
}
