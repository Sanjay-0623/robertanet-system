"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, AlertTriangle, Shield, Clock } from "lucide-react"

interface LiveDetection {
  id: string
  timestamp: Date
  text: string
  prediction: "bullying" | "non-bullying"
  confidence: number
  riskLevel: "low" | "medium" | "high"
  source: string
  responseTime: number
}

interface LiveMonitorProps {
  isActive: boolean
  alertsEnabled: boolean
}

export default function LiveMonitor({ isActive, alertsEnabled }: LiveMonitorProps) {
  const [detections, setDetections] = useState<LiveDetection[]>([])
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    bullyingDetected: 0,
    avgResponseTime: 0,
    currentThroughput: 0,
  })
  const [realtimeData, setRealtimeData] = useState<
    Array<{
      time: string
      detections: number
      bullying: number
    }>
  >([])

  // Simulate live detection stream
  useEffect(() => {
  if (!isActive) return

    const sampleTexts = [
      { text: "You're amazing, keep it up!", prediction: "non-bullying" as const, risk: "low" as const },
      { text: "Thanks for the help today", prediction: "non-bullying" as const, risk: "low" as const },
      { text: "You're so stupid and worthless", prediction: "bullying" as const, risk: "high" as const },
      { text: "Nobody likes you, just quit", prediction: "bullying" as const, risk: "high" as const },
      { text: "Great job on the presentation", prediction: "non-bullying" as const, risk: "low" as const },
      { text: "You should just disappear", prediction: "bullying" as const, risk: "medium" as const },
      { text: "Looking forward to working together", prediction: "non-bullying" as const, risk: "low" as const },
      { text: "Kill yourself, loser", prediction: "bullying" as const, risk: "high" as const },
    ]

    const sources = ["Twitter", "Facebook", "Instagram", "TikTok", "Discord", "Reddit"]

    const generateDetection = (): LiveDetection => {
      const sample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
      const confidence = 0.7 + Math.random() * 0.3

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        text: sample.text,
        prediction: sample.prediction,
        confidence,
        riskLevel: sample.risk,
        source: sources[Math.floor(Math.random() * sources.length)],
        responseTime: Math.floor(Math.random() * 100) + 50,
      }
    }

    const interval = setInterval(
      () => {
        const newDetection = generateDetection()

        setDetections((prev) => [newDetection, ...prev.slice(0, 49)]) // Keep last 50

        setStats((prev) => ({
          totalAnalyzed: prev.totalAnalyzed + 1,
          bullyingDetected: prev.bullyingDetected + (newDetection.prediction === "bullying" ? 1 : 0),
          avgResponseTime: Math.round(
            (prev.avgResponseTime * prev.totalAnalyzed + newDetection.responseTime) / (prev.totalAnalyzed + 1),
          ),
          currentThroughput: prev.currentThroughput + 1,
        }))

        // Update realtime chart data
        const now = new Date()
        const timeKey = now.toLocaleTimeString()

        setRealtimeData((prev) => {
          const existing = prev.find((d) => d.time === timeKey)
          if (existing) {
            return prev.map((d) =>
              d.time === timeKey
                ? {
                    ...d,
                    detections: d.detections + 1,
                    bullying: d.bullying + (newDetection.prediction === "bullying" ? 1 : 0),
                  }
                : d,
            )
          } else {
            return [
              ...prev.slice(-9),
              {
                time: timeKey,
                detections: 1,
                bullying: newDetection.prediction === "bullying" ? 1 : 0,
              },
            ]
          }
        })
      },
      2000 + Math.random() * 3000,
    ) // Random interval 2-5 seconds

    return () => clearInterval(interval)
  }, [isActive])

  // Reset throughput counter every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({ ...prev, currentThroughput: 0 }))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 bg-white text-green-900 p-2 rounded-xl">
      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#f6fbfa] border border-gray-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Analyzed</CardTitle>
            <Activity className="h-4 w-4 text-green-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.totalAnalyzed}</div>
            <p className="text-xs text-green-900">{stats.currentThroughput}/min current rate</p>
          </CardContent>
        </Card>

  <Card className="bg-[#f6fbfa] border border-gray-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Bullying Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bullyingDetected}</div>
            <p className="text-xs text-red-600">
              {stats.totalAnalyzed > 0 ? ((stats.bullyingDetected / stats.totalAnalyzed) * 100).toFixed(1) : "0"}% of total
            </p>
          </CardContent>
        </Card>

  <Card className="bg-[#f6fbfa] border border-gray-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-green-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.avgResponseTime}ms</div>
            <p className="text-xs text-green-900">{stats.avgResponseTime === 0 ? "No data" : "Average processing time"}</p>
          </CardContent>
        </Card>

  <Card className="bg-[#f6fbfa] border border-gray-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">System Status</CardTitle>
            <Shield className="h-4 w-4 text-green-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{isActive ? "ACTIVE" : "STOPPED"}</div>
            <p className="text-xs text-green-900">Monitoring {isActive ? "enabled" : "disabled"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Chart */}
        <Card className="bg-[#f6fbfa] border border-gray-400 shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-900">Detection Rate</CardTitle>
            <CardDescription className="text-green-900">Real-time detection and bullying incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="time" stroke="#14532d" />
                <YAxis stroke="#14532d" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="#14532d"
                  strokeWidth={2}
                  name="Total Detections"
                />
                <Line
                  type="monotone"
                  dataKey="bullying"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Bullying Detected"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Feed */}
  <Card className="bg-[#f6fbfa] border border-gray-400 shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-900">Live Detection Feed</CardTitle>
            <CardDescription className="text-green-900">Real-time analysis results as they happen</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {detections.length === 0 ? (
                  <div className="text-center py-8 text-green-900">
                    <span>{isActive ? "Waiting for detections..." : "Start monitoring to see live feed"}</span>
                  </div>
                ) : (
                  Array.from(
                    new Map(
                      [...detections].reverse().map((d) => [d.text, d])
                    ).values()
                  ).reverse().map((detection) => (
                    <div
                      key={detection.id}
                      className={`p-3 rounded-lg border ${
                        detection.prediction === "bullying"
                          ? "border-red-400 bg-red-50"
                          : "border-gray-400 bg-[#f6fbfa]"
                      } text-green-900`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge
                          variant={detection.prediction === "bullying" ? "destructive" : "default"}
                          className="text-xs"
                        >
                          {detection.prediction === "bullying" ? "BULLYING" : "SAFE"}
                        </Badge>
                        <div className="text-xs text-green-900">{detection.timestamp.toLocaleTimeString()}</div>
                      </div>
                      <p className="text-sm mb-2 leading-relaxed">"{detection.text}"</p>
                      <div className="flex items-center justify-between text-xs text-green-900">
                        <span>Source: {detection.source}</span>
                        <span>Confidence: {(detection.confidence * 100).toFixed(0)}%</span>
                        <span>{detection.responseTime}ms</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Alerts */}
      {alertsEnabled && (
        <Card className="bg-[#f6fbfa] border-2 border-red-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              High Risk Detections
            </CardTitle>
            <CardDescription className="text-red-600">Recent high-confidence bullying detections requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(
                new Map(
                  detections
                    .filter((d) => d.prediction === "bullying" && d.riskLevel === "high")
                    .map((d) => [d.text, d])
                ).values()
              )
                .slice(0, 5)
                .map((detection) => (
                  <div
                    key={detection.id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-400 rounded-lg text-red-600"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">High Risk Detection - {detection.source}</p>
                      <p className="text-sm">"{detection.text}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{(detection.confidence * 100).toFixed(0)}%</Badge>
                      <Button size="sm" variant="outline" className="border-red-400 text-red-600">Review</Button>
                    </div>
                  </div>
                ))}
              {detections.filter((d) => d.prediction === "bullying" && d.riskLevel === "high" ).length === 0 && (
                <div className="text-center py-4 text-red-600">No high-risk detections in recent activity</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
