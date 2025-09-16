"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, Loader2, TrendingUp } from "lucide-react"

interface AnalysisResult {
  prediction: "bullying" | "non-bullying"
  confidence: number
  bullying_probability: number
  non_bullying_probability: number
  processing_time: number
  word_count: number
  risk_level: "low" | "medium" | "high"
}

interface TextAnalyzerProps {
  initialText?: string
}

export default function TextAnalyzer({ initialText = "" }: TextAnalyzerProps) {
  const [text, setText] = useState(initialText)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialText) {
      setText(initialText)
    }
  }, [initialText])

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const analysisResult = await response.json()
      setResult(analysisResult)
    } catch (err) {
      setError("Failed to analyze text. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-secondary"
      case "low":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-destructive" />
      case "medium":
        return <Shield className="w-5 h-5 text-secondary" />
      case "low":
        return <CheckCircle className="w-5 h-5 text-primary" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Text Analysis
          </CardTitle>
          <CardDescription>
            Enter text below to analyze for potential cyberbullying content using our RoBERTaNET model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze for cyberbullying detection..."
            className="min-h-32 resize-none"
            disabled={isAnalyzing}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Powered by GloVe embeddings + RoBERTa contextual analysis</p>
              <Badge variant="outline" className="text-xs">
                {text.length} characters
              </Badge>
            </div>
            <Button
              onClick={analyzeText}
              disabled={isAnalyzing || !text.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRiskIcon(result.risk_level)}
              Analysis Results
            </CardTitle>
            <CardDescription>Detection completed in {result.processing_time}ms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Result */}
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="mb-4">
                <Badge
                  variant={result.prediction === "bullying" ? "destructive" : "default"}
                  className="text-lg px-4 py-2"
                >
                  {result.prediction === "bullying" ? "Cyberbullying Detected" : "No Cyberbullying Detected"}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2 text-foreground">{(result.confidence * 100).toFixed(1)}%</div>
              <p className="text-muted-foreground">Confidence Level</p>
            </div>

            {/* Detailed Probabilities */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cyberbullying</span>
                  <span className="text-sm text-muted-foreground">
                    {(result.bullying_probability * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={result.bullying_probability * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Non-Cyberbullying</span>
                  <span className="text-sm text-muted-foreground">
                    {(result.non_bullying_probability * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={result.non_bullying_probability * 100} className="h-2" />
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Risk Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Risk Level:</span>
                <Badge variant="outline" className={getRiskColor(result.risk_level)}>
                  {result.risk_level.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Text Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{result.word_count}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{result.processing_time}</div>
                <div className="text-xs text-muted-foreground">ms</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{(result.confidence * 100).toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">RoBERTaNET</div>
                <div className="text-xs text-muted-foreground">Model</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
