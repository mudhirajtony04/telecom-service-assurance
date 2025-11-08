const API_BASE = "/api"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const apiClient = {
  // Metrics endpoints
  metrics: {
    getHistory: async (timeRange = "24h", limit = 100) => {
      const res = await fetch(`${API_BASE}/metrics?timeRange=${timeRange}&limit=${limit}`)
      return res.json() as Promise<ApiResponse<any>>
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json() as Promise<ApiResponse<any>>
    },
  },

  // Compliance endpoints
  compliance: {
    getAll: async (status?: string) => {
      const url = status ? `${API_BASE}/compliance?status=${status}` : `${API_BASE}/compliance`
      const res = await fetch(url)
      return res.json() as Promise<ApiResponse<any>>
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/compliance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json() as Promise<ApiResponse<any>>
    },
  },

  // Alerts endpoints
  alerts: {
    getAll: async (type?: string, acknowledged?: boolean, limit = 50) => {
      let url = `${API_BASE}/alerts?limit=${limit}`
      if (type) url += `&type=${type}`
      if (acknowledged !== undefined) url += `&acknowledged=${acknowledged}`
      const res = await fetch(url)
      return res.json() as Promise<ApiResponse<any>>
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json() as Promise<ApiResponse<any>>
    },
    acknowledge: async (id: string) => {
      const res = await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {
        method: "PATCH",
      })
      return res.json() as Promise<ApiResponse<any>>
    },
  },

  // SNMP endpoints
  snmp: {
    getCollectors: async () => {
      const res = await fetch(`${API_BASE}/snmp/collectors`)
      return res.json() as Promise<ApiResponse<any>>
    },
    createCollector: async (data: any) => {
      const res = await fetch(`${API_BASE}/snmp/collectors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json() as Promise<ApiResponse<any>>
    },
  },

  // Analytics endpoints
  analytics: {
    getSummary: async (period = "7d") => {
      const res = await fetch(`${API_BASE}/analytics?period=${period}`)
      return res.json() as Promise<ApiResponse<any>>
    },
  },
}
