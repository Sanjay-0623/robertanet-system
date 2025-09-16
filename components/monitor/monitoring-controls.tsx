"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Server, Database, Cpu, HardDrive, Wifi, RefreshCw } from "lucide-react"

interface MonitoringControlsProps {
  onStatusChange: (status: "healthy" | "warning" | "error") => void
}

export default function MonitoringControls({ onStatusChange }: MonitoringControlsProps) {
  const [modelSettings, setModelSettings] = useState({
    confidenceThreshold: [0.7],
    batchSize: [16],
    maxConcurrency: [10],
    cacheEnabled: true,
    autoScaling: true,
  })

  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    modelLoad: 34,
  })

  const [services, setServices] = useState([
    { name: "RoBERTaNET Model", status: "healthy", uptime: "99.9%" },
    { name: "API Gateway", status: "healthy", uptime: "99.8%" },
    { name: "Database", status: "warning", uptime: "98.2%" },
    { name: "Cache Layer", status: "healthy", uptime: "99.7%" },
    { name: "Alert System", status: "healthy", uptime: "99.5%" },
  ])

  const restartService = (serviceName: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.name === serviceName ? { ...service, status: "healthy", uptime: "100%" } : service,
      ),
    )
  }

  const runHealthCheck = () => {
    // Simulate health check
    const overallHealth = Math.max(...Object.values(systemHealth))
    if (overallHealth > 80) {
      onStatusChange("error")
    } else if (overallHealth > 60) {
      onStatusChange("warning")
    } else {
      onStatusChange("healthy")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Health
          </CardTitle>
          <CardDescription>Monitor system resources and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <Cpu className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{systemHealth.cpu}%</div>
              <div className="text-sm text-muted-foreground">CPU Usage</div>
            </div>

            <div className="text-center">
              <HardDrive className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{systemHealth.memory}%</div>
              <div className="text-sm text-muted-foreground">Memory</div>
            </div>

            <div className="text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{systemHealth.disk}%</div>
              <div className="text-sm text-muted-foreground">Disk Usage</div>
            </div>

            <div className="text-center">
              <Wifi className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{systemHealth.network}%</div>
              <div className="text-sm text-muted-foreground">Network</div>
            </div>

            <div className="text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{systemHealth.modelLoad}%</div>
              <div className="text-sm text-muted-foreground">Model Load</div>
            </div>
          </div>

          <Button onClick={runHealthCheck} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Health Check
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>Adjust RoBERTaNET model parameters and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confidence Threshold: {modelSettings.confidenceThreshold[0]}
              </label>
              <Slider
                value={modelSettings.confidenceThreshold}
                onValueChange={(value) => setModelSettings((prev) => ({ ...prev, confidenceThreshold: value }))}
                max={1}
                min={0.1}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Minimum confidence for positive detection</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Batch Size: {modelSettings.batchSize[0]}</label>
              <Slider
                value={modelSettings.batchSize}
                onValueChange={(value) => setModelSettings((prev) => ({ ...prev, batchSize: value }))}
                max={64}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Number of texts processed simultaneously</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Concurrency: {modelSettings.maxConcurrency[0]}</label>
              <Slider
                value={modelSettings.maxConcurrency}
                onValueChange={(value) => setModelSettings((prev) => ({ ...prev, maxConcurrency: value }))}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Maximum concurrent requests</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Enable Caching</label>
                <p className="text-xs text-muted-foreground">Cache results for faster responses</p>
              </div>
              <Switch
                checked={modelSettings.cacheEnabled}
                onCheckedChange={(checked) => setModelSettings((prev) => ({ ...prev, cacheEnabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Scaling</label>
                <p className="text-xs text-muted-foreground">Automatically scale based on load</p>
              </div>
              <Switch
                checked={modelSettings.autoScaling}
                onCheckedChange={(checked) => setModelSettings((prev) => ({ ...prev, autoScaling: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Monitor and manage system services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">Uptime: {service.uptime}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(service.status)}>{service.status}</Badge>
                    {service.status !== "healthy" && (
                      <Button size="sm" variant="outline" onClick={() => restartService(service.name)}>
                        Restart
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Configuration changes</strong> will take effect immediately. Monitor system performance after making
          adjustments.
        </AlertDescription>
      </Alert>
    </div>
  )
}
