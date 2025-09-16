"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const modelComparison = [
  { model: "RoBERTaNET", accuracy: 94.2, f1: 93.1, precision: 93.8, recall: 92.6, speed: 127 },
  { model: "RoBERTa-base", accuracy: 89.1, f1: 87.8, precision: 87.5, recall: 88.2, speed: 98 },
  { model: "BERT-base", accuracy: 86.4, f1: 84.9, precision: 85.1, recall: 84.7, speed: 145 },
  { model: "DistilBERT", accuracy: 83.7, f1: 81.2, precision: 82.3, recall: 80.1, speed: 67 },
  { model: "LSTM + GloVe", accuracy: 78.9, f1: 76.4, precision: 77.8, recall: 75.1, speed: 45 },
]

const radarData = [
  { metric: "Accuracy", RoBERTaNET: 94.2, "RoBERTa-base": 89.1, "BERT-base": 86.4 },
  { metric: "Precision", RoBERTaNET: 93.8, "RoBERTa-base": 87.5, "BERT-base": 85.1 },
  { metric: "Recall", RoBERTaNET: 92.6, "RoBERTa-base": 88.2, "BERT-base": 84.7 },
  { metric: "F1-Score", RoBERTaNET: 93.1, "RoBERTa-base": 87.8, "BERT-base": 84.9 },
  { metric: "Speed (inv)", RoBERTaNET: 78.7, "RoBERTa-base": 102.0, "BERT-base": 69.0 }, // Inverted for radar
]

export default function ModelComparison() {
  return (
    <div className="space-y-6">
      {/* Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Model Performance Comparison</CardTitle>
          <CardDescription>RoBERTaNET vs other cyberbullying detection models</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={modelComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Accuracy %" />
              <Bar dataKey="f1" fill="hsl(var(--secondary))" name="F1-Score %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-dimensional Comparison</CardTitle>
            <CardDescription>Performance across multiple metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[60, 110]} />
                <Radar
                  name="RoBERTaNET"
                  dataKey="RoBERTaNET"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="RoBERTa-base"
                  dataKey="RoBERTa-base"
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Model Rankings</CardTitle>
            <CardDescription>Ranked by overall performance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelComparison
                .sort((a, b) => b.f1 - a.f1)
                .map((model, index) => (
                  <div key={model.model} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{model.model}</p>
                        <p className="text-sm text-muted-foreground">
                          F1: {model.f1}% • Speed: {model.speed}ms
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{model.accuracy}%</p>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics Comparison</CardTitle>
          <CardDescription>Comprehensive performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Model</th>
                  <th className="text-center p-2">Accuracy</th>
                  <th className="text-center p-2">Precision</th>
                  <th className="text-center p-2">Recall</th>
                  <th className="text-center p-2">F1-Score</th>
                  <th className="text-center p-2">Speed (ms)</th>
                  <th className="text-center p-2">Parameters</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((model, index) => (
                  <tr key={model.model} className={`border-b ${index === 0 ? "bg-primary/5" : ""}`}>
                    <td className="p-2 font-medium">
                      {model.model}
                      {index === 0 && (
                        <Badge className="ml-2" variant="default">
                          Best
                        </Badge>
                      )}
                    </td>
                    <td className="text-center p-2">{model.accuracy}%</td>
                    <td className="text-center p-2">{model.precision}%</td>
                    <td className="text-center p-2">{model.recall}%</td>
                    <td className="text-center p-2">{model.f1}%</td>
                    <td className="text-center p-2">{model.speed}ms</td>
                    <td className="text-center p-2">
                      {model.model === "RoBERTaNET"
                        ? "125M + 300D"
                        : model.model === "RoBERTa-base"
                          ? "125M"
                          : model.model === "BERT-base"
                            ? "110M"
                            : model.model === "DistilBERT"
                              ? "66M"
                              : "2M"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
