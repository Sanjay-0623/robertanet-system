"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Play, Pause, Settings, Users, Activity } from "lucide-react"
import LiveMonitor from "@/components/monitor/live-monitor"
import BatchProcessor from "@/components/monitor/batch-processor"
import AlertSystem from "@/components/monitor/alert-system"
import MonitoringControls from "@/components/monitor/monitoring-controls"

export default function MonitorPage() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [systemStatus, setSystemStatus] = useState<"healthy" | "warning" | "error">("healthy")

  return (
  <div className="min-h-screen bg-white">
  <header className="border-b border-gray-200 bg-white">
  <div className="container mx-auto px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Real-time Monitor</h1>
              <p className="text-sm text-gray-500">Cyberbullying Detection System</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Badge className="flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System healthy
            </Badge>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Dashboard</a>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Analysis</a>
          </div>
        </div>
      </header>

      {/* System Status Alert */}
      {systemStatus !== "healthy" && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant={systemStatus === "warning" ? "default" : "destructive"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {systemStatus === "warning"
                ? "System performance degraded. Response times may be slower than usual."
                : "System error detected. Some features may be unavailable."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Control Panel */}
  <div className="container mx-auto px-6 py-10 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Real-time Monitoring</h2>
            <p className="text-lg text-gray-500">Monitor and manage cyberbullying detection in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              <span className="text-sm">Alerts</span>
            </div>
              {isMonitoring ? (
                <Button
                  className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2"
                  onClick={() => setIsMonitoring(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                  Stop Monitoring
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2"
                  onClick={() => setIsMonitoring(true)}
                >
                  <Play className="w-4 h-4" />
                  Start Monitoring
                </Button>
              )}
          </div>
        </div>

        {/* Monitoring Tabs */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200 rounded-xl mb-6">
            <TabsTrigger value="live" className="flex items-center gap-2 text-blue-700 font-semibold">
              <Activity className="w-4 h-4" />
              Live Monitor
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2 text-blue-700 font-semibold">
              <Users className="w-4 h-4" />
              Batch Process
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2 text-blue-700 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              Alert System
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2 text-blue-700 font-semibold">
              <Settings className="w-4 h-4" />
              Controls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <LiveMonitor isActive={isMonitoring} alertsEnabled={alertsEnabled} />
          </TabsContent>
          <TabsContent value="batch">
            <BatchProcessor />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertSystem enabled={alertsEnabled} />
          </TabsContent>
          <TabsContent value="controls">
            <MonitoringControls onStatusChange={setSystemStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
