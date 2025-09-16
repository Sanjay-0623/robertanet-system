"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, Target, Zap, Users, Clock, BarChart3, PieChart } from "lucide-react"
import ModelMetrics from "@/components/dashboard/model-metrics"
import LiveMonitor from "@/components/dashboard/live-monitor"
import TrainingHistory from "@/components/dashboard/training-history"
import ConfusionMatrix from "@/components/dashboard/confusion-matrix"
import RealTimeAnalytics from "@/components/dashboard/real-time-analytics"
import ModelComparison from "@/components/dashboard/model-comparison"

export default function DashboardPage() {
  return (
  <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sticky Header */}
  <header className="sticky top-0 z-30 shadow-lg bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl shadow-md">
              <Brain className="w-7 h-7 text-blue-600" />
            </div>
            <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">RoBERTaNET Dashboard</h1>
        <p className="text-xs text-gray-500">Professional Model Performance & Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Model Active
            </Badge>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Back to Analysis</a>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
  <div className="container mx-auto px-6 py-10">
        {/* Overview Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="bg-white shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-yellow-800">Model Accuracy</CardTitle>
              <Target className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-700">94.2%</div>
              <p className="text-xs text-gray-500">+2.1% from baseline</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-purple-800">F1 Score</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-purple-700">0.931</div>
              <p className="text-xs text-gray-500">Weighted average</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-blue-800">Inference Time</CardTitle>
              <Zap className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-700">127ms</div>
              <p className="text-xs text-gray-500">Average response time</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-green-800">Texts Analyzed</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-700">1,247</div>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

  <div className="border-t border-gray-200 my-8"></div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="metrics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-gray-100 border border-gray-200 rounded-xl shadow-md mb-6">
            <TabsTrigger value="metrics" className="flex items-center gap-2 font-semibold text-base text-gray-700">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2 font-semibold text-base text-gray-700">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Training
            </TabsTrigger>
            <TabsTrigger value="confusion" className="flex items-center gap-2 font-semibold text-base text-gray-700">
              <PieChart className="w-5 h-5 text-yellow-600" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2 font-semibold text-base text-gray-700">
              <Clock className="w-5 h-5 text-green-600" />
              Real-time
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 font-semibold text-base text-gray-700">
              <Target className="w-5 h-5 text-red-600" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2 font-semibold text-base text-gray-700">
              <Zap className="w-5 h-5 text-blue-600" />
              Live Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <ModelMetrics />
          </TabsContent>

          <TabsContent value="training">
            <TrainingHistory />
          </TabsContent>

          <TabsContent value="confusion">
            <ConfusionMatrix />
          </TabsContent>

          <TabsContent value="realtime">
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="comparison">
            <ModelComparison />
          </TabsContent>

          <TabsContent value="live">
            <LiveMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
// ...existing code...
