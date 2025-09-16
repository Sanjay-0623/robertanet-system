"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { Zap, BarChart3, TrendingUp, Target, AlertTriangle, Clock, Shield } from "lucide-react"

export default function LiveMonitor() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMetrics = () => {
      fetch("/api/results")
        .then((res) => res.json())
        .then((data) => {
          setMetrics(data)
          setLoading(false)
        })
        .catch(() => {
          setError("Failed to fetch live metrics.")
          setLoading(false)
        })
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <Card className="shadow-md border animate-pulse">
      <CardHeader className="flex flex-row items-center gap-2">
        <Zap className="w-5 h-5 text-blue-600" />
        <CardTitle>Live Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500 py-8">Loading...</div>
      </CardContent>
    </Card>
  )
  if (error || !metrics) return (
    <Card className="shadow-md border">
      <CardHeader className="flex flex-row items-center gap-2">
        <Zap className="w-5 h-5 text-red-600" />
        <CardTitle>Live Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-red-600 py-8">{error || "No data."}</div>
      </CardContent>
    </Card>
  )

  const { test_metrics, training_results } = metrics
  const metricCards = [
    {
      label: "Total Analyzed",
      value: metrics?.total_analyzed ?? 0,
      icon: <BarChart3 className="w-4 h-4 text-green-900" />,
      cardClass: "bg-[#f6fbfa] border border-gray-400 text-green-900"
    },
    {
      label: "Bullying Detected",
      value: metrics?.bullying_detected ?? 0,
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
      cardClass: "bg-[#f6fbfa] border border-gray-400 text-red-600"
    },
    {
      label: "Avg Response",
      value: metrics?.avg_response ?? "0ms",
      icon: <Clock className="w-4 h-4 text-green-900" />,
      cardClass: "bg-[#f6fbfa] border border-gray-400 text-green-900"
    },
    {
      label: "System Status",
      value: metrics?.system_status ?? "STOPPED",
      icon: <Shield className="w-4 h-4 text-green-900" />,
      cardClass: "bg-[#f6fbfa] border border-gray-400 text-green-900"
    }
  ]

  return (
    <div className="rounded-xl p-4 bg-[#f6fbfa] border-2 border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {metricCards.map((m, i) => (
          <div key={i} className={`rounded-lg p-4 flex flex-col gap-2 shadow-sm ${m.cardClass}`}> 
            <div className="flex items-center gap-2">
              {m.icon}
              <span className="font-semibold text-base text-gray-700">{m.label}</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{m.value}</div>
            <div className="text-xs text-green-900">{i === 0 ? "0/min current rate" : i === 1 ? "0% of total" : i === 2 ? "No data" : i === 3 ? "Monitoring disabled" : ""}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg p-4 border border-gray-400 bg-[#f6fbfa]">
          <div className="font-semibold text-green-900 mb-1">Detection Rate</div>
          <div className="text-sm text-green-900 mb-2">Real-time detection and bullying incidents</div>
          <div className="border border-dashed border-gray-400 h-40"></div>
        </div>
        <div className="rounded-lg p-4 border border-gray-400 bg-[#f6fbfa]">
          <div className="font-semibold text-green-900 mb-1">Live Detection Feed</div>
          <div className="text-sm text-green-900 mb-2">Real-time analysis results as they happen</div>
          <div className="flex items-center justify-center h-40 text-lg text-green-900 font-semibold">Start monitoring to see live feed</div>
        </div>
      </div>
      <div className="rounded-lg p-4 border-2 border-red-400 bg-[#f6fbfa]">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="font-bold text-red-600">High Risk Detections</span>
        </div>
        <div className="text-sm text-red-600 mb-2">Recent high-confidence bullying detections requiring attention</div>
        <div className="text-base text-red-600">No high-risk detections in recent activity</div>
      </div>
    </div>
  )
}
