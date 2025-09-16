"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Play, FileText, AlertTriangle } from "lucide-react"

interface BatchResult {
  id: number
  text: string
  prediction: "bullying" | "non-bullying"
  confidence: number
  riskLevel: "low" | "medium" | "high"
}

export default function BatchProcessor() {
  const [batchText, setBatchText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<BatchResult[]>([])
  const [processingStats, setProcessingStats] = useState({
    total: 0,
    bullying: 0,
    nonBullying: 0,
    highRisk: 0,
  })

  const processBatch = async () => {
    if (!batchText.trim()) return

    setIsProcessing(true)
    setProgress(0)
    setResults([])

    // Split text into lines for batch processing
    const lines = batchText.split("\n").filter((line) => line.trim())
    const batchResults: BatchResult[] = []

    let bullyingCount = 0
    let nonBullyingCount = 0
    let highRiskCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Simulate analysis (same logic as single analysis)
      const bullyingKeywords = ["stupid", "idiot", "loser", "ugly", "hate", "kill", "die", "worthless"]
      const words = line.toLowerCase().split(/\s+/)
      const hasBullyingWords = words.some((word) => bullyingKeywords.some((keyword) => word.includes(keyword)))

      const confidence = hasBullyingWords ? 0.7 + Math.random() * 0.3 : 0.1 + Math.random() * 0.4
      const prediction = confidence > 0.5 ? "bullying" : "non-bullying"
      const riskLevel = confidence > 0.8 ? "high" : confidence > 0.6 ? "medium" : "low"

      const result: BatchResult = {
        id: i + 1,
        text: line,
        prediction,
        confidence,
        riskLevel,
      }

      batchResults.push(result)

      if (prediction === "bullying") {
        bullyingCount++
        if (riskLevel === "high") highRiskCount++
      } else {
        nonBullyingCount++
      }

      setResults([...batchResults])
      setProgress(((i + 1) / lines.length) * 100)
    }

    setProcessingStats({
      total: lines.length,
      bullying: bullyingCount,
      nonBullying: nonBullyingCount,
      highRisk: highRiskCount,
    })

    setIsProcessing(false)
  }

  const exportResults = () => {
    const csv = [
      "ID,Text,Prediction,Confidence,Risk Level",
      ...results.map(
        (r) => `${r.id},"${r.text.replace(/"/g, '""')}",${r.prediction},${r.confidence.toFixed(3)},${r.riskLevel}`,
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "batch_analysis_results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const sampleData = `You're amazing, keep up the great work!
Thanks for sharing this helpful information.
You're so stupid and worthless, nobody likes you.
Great job on your presentation today.
Just give up already, you're pathetic.
Looking forward to working together on this project.
Go kill yourself, loser.
I appreciate your help with this task.`

  return (
    <div className="space-y-6">
      {/* Batch Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Batch Text Processing
          </CardTitle>
          <CardDescription>Process multiple texts at once for cyberbullying detection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="Enter multiple texts, one per line..."
            className="min-h-32 resize-none"
            disabled={isProcessing}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setBatchText(sampleData)} disabled={isProcessing}>
                Load Sample Data
              </Button>
              <Badge variant="outline">{batchText.split("\n").filter((line) => line.trim()).length} texts</Badge>
            </div>

            <Button
              onClick={processBatch}
              disabled={isProcessing || !batchText.trim()}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Process Batch
                </>
              )}
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing batch...</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Stats */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{processingStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bullying Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{processingStats.bullying}</div>
              <p className="text-xs text-muted-foreground">
                {((processingStats.bullying / processingStats.total) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Safe Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{processingStats.nonBullying}</div>
              <p className="text-xs text-muted-foreground">
                {((processingStats.nonBullying / processingStats.total) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{processingStats.highRisk}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Batch Results</CardTitle>
                <CardDescription>Analysis results for {results.length} texts</CardDescription>
              </div>
              <Button variant="outline" onClick={exportResults} className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border ${
                    result.prediction === "bullying"
                      ? "border-destructive/20 bg-destructive/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Badge variant={result.prediction === "bullying" ? "destructive" : "default"} className="text-xs">
                      {result.prediction === "bullying" ? "BULLYING" : "SAFE"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.riskLevel.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span className="text-muted-foreground">#{result.id}:</span> "{result.text}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Risk Summary */}
      {processingStats.highRisk > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{processingStats.highRisk} high-risk detections</strong> found in this batch. These require
            immediate attention and review.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
