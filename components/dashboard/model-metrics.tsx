"use client"


import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

type Metrics = {
  accuracy: number
  precision: number
  recall: number
  f1: number
  confusion_matrix: number[][]
}

type Results = {
  training_results: {
    best_val_acc: number
    best_metrics: Metrics
    train_history: {
      train_loss: number[]
      train_acc: number[]
      val_loss: number[]
      val_acc: number[]
    }
  }
  test_metrics: Metrics
  model_config: any
  data_info: any
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

export default function ModelMetrics() {
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => {
        setResults(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load metrics.")
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading metrics...</div>
  if (error || !results) return <div>{error || "No results found."}</div>

  const { test_metrics, training_results, model_config, data_info } = results
  const perfData = [
    { metric: "Accuracy", value: test_metrics.accuracy * 100 },
    { metric: "Precision", value: test_metrics.precision * 100 },
    { metric: "Recall", value: test_metrics.recall * 100 },
    { metric: "F1-Score", value: test_metrics.f1 * 100 }
  ]
  // Confusion matrix breakdown
  const cm = test_metrics.confusion_matrix
  const distributionData = [
    { name: "True Positives", value: cm[0][0], color: COLORS[0] },
    { name: "False Positives", value: cm[0][1], color: COLORS[2] },
    { name: "False Negatives", value: cm[1][0], color: COLORS[3] },
    { name: "True Negatives", value: cm[1][1], color: COLORS[1] }
  ]

  return (
    <div className="space-y-6">
      {/* Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance (Test Set)</CardTitle>
          <CardDescription>RoBERTaNET metrics from latest training run</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" name="RoBERTaNET" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confusion Matrix & Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>Test set confusion matrix</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-center border">
              <thead>
                <tr>
                  <th></th>
                  <th>Predicted: 0</th>
                  <th>Predicted: 1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Actual: 0</td>
                  <td>{cm[0][0]}</td>
                  <td>{cm[0][1]}</td>
                </tr>
                <tr>
                  <td>Actual: 1</td>
                  <td>{cm[1][0]}</td>
                  <td>{cm[1][1]}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Distribution</CardTitle>
            <CardDescription>Breakdown of model predictions on test set</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {distributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Architecture Info */}
      <Card>
        <CardHeader>
          <CardTitle>Model Architecture</CardTitle>
          <CardDescription>Technical specifications of the RoBERTaNET model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Components</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• RoBERTa-base ({model_config?.roberta_model})</p>
                <p>• GloVe embeddings ({model_config?.glove_dim}d)</p>
                <p>• Fusion method: {model_config?.fusion_method}</p>
                <p>• Classes: {model_config?.num_classes}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Training Details</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Best Val Accuracy: {training_results?.best_val_acc}</p>
                <p>• Epochs: {training_results?.train_history?.train_loss?.length}</p>
                <p>• Train size: {data_info?.train_size}</p>
                <p>• Val size: {data_info?.val_size}</p>
                <p>• Test size: {data_info?.test_size}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Dataset</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Vocab size: {data_info?.vocab_size}</p>
                <p>• Classes: {data_info?.num_classes}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
