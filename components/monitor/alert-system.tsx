"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, AlertTriangle, Mail, MessageSquare, Settings } from "lucide-react"

interface AlertRule {
  id: string
  name: string
  condition: string
  threshold: number
  enabled: boolean
  channels: string[]
}

interface AlertEvent {
  id: string
  timestamp: Date
  type: "high_risk" | "volume_spike" | "accuracy_drop" | "system_error"
  message: string
  severity: "low" | "medium" | "high" | "critical"
  acknowledged: boolean
}

interface AlertSystemProps {
  enabled: boolean
}

export default function AlertSystem({ enabled }: AlertSystemProps) {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "High Risk Detection",
      condition: "Bullying confidence > threshold",
      threshold: 90,
      enabled: true,
      channels: ["email", "dashboard"],
    },
    {
      id: "2",
      name: "Volume Spike",
      condition: "Requests per minute > threshold",
      threshold: 100,
      enabled: true,
      channels: ["dashboard"],
    },
    {
      id: "3",
      name: "Accuracy Drop",
      condition: "Model accuracy < threshold",
      threshold: 85,
      enabled: false,
      channels: ["email", "slack"],
    },
  ])

  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([])

  // Simulate alert events
  useEffect(() => {
    if (!enabled) return

    const generateAlert = (): AlertEvent => {
      const types: AlertEvent["type"][] = ["high_risk", "volume_spike", "accuracy_drop", "system_error"]
      const severities: AlertEvent["severity"][] = ["low", "medium", "high", "critical"]

      const type = types[Math.floor(Math.random() * types.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]

      const messages = {
        high_risk: "High confidence bullying detection requires immediate attention",
        volume_spike: "Unusual spike in analysis requests detected",
        accuracy_drop: "Model accuracy has dropped below acceptable threshold",
        system_error: "System component failure detected",
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        type,
        message: messages[type],
        severity,
        acknowledged: false,
      }
    }

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance of alert
        const newAlert = generateAlert()
        setAlertEvents((prev) => [newAlert, ...prev.slice(0, 19)]) // Keep last 20
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [enabled])

  const acknowledgeAlert = (alertId: string) => {
    setAlertEvents((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const toggleRule = (ruleId: string) => {
    setAlertRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const getSeverityColor = (severity: AlertEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadge = (severity: AlertEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const unacknowledgedAlerts = alertEvents.filter((alert) => !alert.acknowledged)

  return (
    <div className="space-y-6">
      {/* Alert Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bell className={`w-5 h-5 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
            <span className="font-medium">Alert System {enabled ? "Active" : "Disabled"}</span>
          </div>
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive">{unacknowledgedAlerts.length} unacknowledged</Badge>
          )}
        </div>
      </div>

      {!enabled && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Alert system is currently disabled. Enable alerts in the monitoring controls to receive notifications.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alert Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Alert Rules
            </CardTitle>
            <CardDescription>Configure when and how alerts are triggered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{rule.name}</h4>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                </div>

                <p className="text-sm text-muted-foreground">{rule.condition}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Threshold:</span>
                    <Badge variant="outline">{rule.threshold}%</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Channels:</span>
                    <div className="flex gap-1">
                      {rule.channels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest system alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alertEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {enabled ? "No alerts generated yet" : "Enable alerts to see notifications"}
                </div>
              ) : (
                alertEvents.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.acknowledged
                        ? "border-border bg-muted/30 opacity-60"
                        : "border-destructive/20 bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityBadge(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.timestamp.toLocaleString()}</span>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-xs h-6"
                        >
                          Ack
                        </Button>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed">{alert.message}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.type.replace("_", " ")}
                      </Badge>
                      {alert.acknowledged && <span className="text-xs text-muted-foreground">Acknowledged</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Channels Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Configure how and where alerts are delivered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send alerts to configured email addresses</p>
              <div className="space-y-2">
                <Switch defaultChecked />
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-medium">Slack</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Post alerts to Slack channels</p>
              <div className="space-y-2">
                <Switch />
                <p className="text-xs text-muted-foreground">#cyberbullying-alerts</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-medium">Dashboard</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Show alerts in the dashboard</p>
              <div className="space-y-2">
                <Switch defaultChecked />
                <p className="text-xs text-muted-foreground">Real-time notifications</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
