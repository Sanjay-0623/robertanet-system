"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Clock, TrendingUp, AlertTriangle } from "lucide-react"

interface RealtimeData {
  timestamp: string
  requests: number
  avgResponseTime: number
  bullyingDetected: number
  accuracy: number
}

export default function RealTimeAnalytics() {
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([])
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const generateDataPoint = (): RealtimeData => {
      const now = new Date()
      return {
        timestamp: now.toLocaleTimeString(),
        requests: Math.floor(Math.random() * 20) + 5,
        avgResponseTime: Math.floor(Math.random() * 50) + 100,
        bullyingDetected: Math.floor(Math.random() * 3),
        accuracy: 0.92 + Math.random() * 0.06,
      }
    }

    // Initialize with some data
    const initialData = Array.from({ length: 10 }, (_, i) => {
      const time = new Date(Date.now() - (9 - i) * 30000)
      return {
        timestamp: time.toLocaleTimeString(),
        requests: Math.floor(Math.random() * 20) + 5,
        avgResponseTime: Math.floor(Math.random() * 50) + 100,
        bullyingDetected: Math.floor(Math.random() * 3),
        accuracy: 0.92 + Math.random() * 0.06,
      }
    })
    setRealtimeData(initialData)

    const interval = setInterval(() => {
      if (isLive) {
        setRealtimeData((prev) => {
          const newData = [...prev.slice(1), generateDataPoint()]
          return newData
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const currentStats = realtimeData[realtimeData.length - 1] || {
    requests: 0,
    avgResponseTime: 0,
    bullyingDetected: 0,
    accuracy: 0,
  }

  const totalRequests = realtimeData.reduce((sum, data) => sum + data.requests, 0)
  const totalBullying = realtimeData.reduce((sum, data) => sum + data.bullyingDetected, 0)

  return (
    <div className="space-y-6">
      {/* Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
          <span className="font-medium">{isLive ? "Live Monitoring Active" : "Monitoring Paused"}</span>
        </div>
        <button onClick={() => setIsLive(!isLive)} className="text-sm text-muted-foreground hover:text-foreground">
          {isLive ? "Pause" : "Resume"}
        </button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentStats.requests}/min</div>
            <p className="text-xs text-muted-foreground">{totalRequests} total in last 5 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentStats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bullying Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{currentStats.bullyingDetected}</div>
            <p className="text-xs text-muted-foreground">{totalBullying} total incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{(currentStats.accuracy * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Current model accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Real-time analysis requests per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgResponseTime"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest analysis requests and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "14:32:15", text: "You are amazing!", result: "safe", confidence: 0.96 },
              { time: "14:31:42", text: "Go kill yourself...", result: "bullying", confidence: 0.94 },
              { time: "14:31:28", text: "Thanks for the help", result: "safe", confidence: 0.98 },
              { time: "14:30:55", text: "You are so stupid", result: "bullying", confidence: 0.89 },
              { time: "14:30:33", text: "Great work everyone!", result: "safe", confidence: 0.97 },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-mono">{activity.time}</span>
                  <span className="text-sm max-w-xs truncate">"{activity.text}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={activity.result === "bullying" ? "destructive" : "default"}>{activity.result}</Badge>
                  <span className="text-sm text-muted-foreground">{(activity.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
