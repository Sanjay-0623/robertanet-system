"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const confusionData = [
  [1750, 97], // Non-bullying: [TN, FP]
  [112, 1041], // Bullying: [FN, TP]
]

const classNames = ["Non-Bullying", "Bullying"]

export default function ConfusionMatrix() {
  const total = confusionData.flat().reduce((a, b) => a + b, 0)

  const getIntensity = (value: number, max: number) => {
    const intensity = value / max
    return intensity
  }

  const maxValue = Math.max(...confusionData.flat())

  return (
    <div className="space-y-6">
      {/* Confusion Matrix Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix</CardTitle>
          <CardDescription>Model prediction accuracy breakdown by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Matrix */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Header */}
                <div></div>
                <div className="font-medium text-sm">Predicted Non-Bullying</div>
                <div className="font-medium text-sm">Predicted Bullying</div>

                {/* Rows */}
                {confusionData.map((row, i) => (
                  <>
                    <div key={`label-${i}`} className="font-medium text-sm flex items-center">
                      Actual {classNames[i]}
                    </div>
                    {row.map((value, j) => {
                      const intensity = getIntensity(value, maxValue)
                      const isCorrect = i === j
                      return (
                        <div
                          key={`cell-${i}-${j}`}
                          className={`
                            w-24 h-24 flex items-center justify-center rounded-lg border-2 text-lg font-bold
                            ${
                              isCorrect
                                ? "border-primary bg-primary/20 text-primary"
                                : "border-destructive bg-destructive/20 text-destructive"
                            }
                          `}
                          style={{
                            opacity: 0.3 + intensity * 0.7,
                          }}
                        >
                          {value}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/40 border-2 border-primary rounded"></div>
                <span>Correct Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive/40 border-2 border-destructive rounded"></div>
                <span>Incorrect Predictions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Classification Report */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Report</CardTitle>
            <CardDescription>Detailed performance metrics per class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Non-Bullying Class */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Non-Bullying Class</h4>
                  <Badge variant="default">1,847 samples</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Precision</p>
                    <p className="text-lg font-semibold">94.7%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recall</p>
                    <p className="text-lg font-semibold">94.8%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">F1-Score</p>
                    <p className="text-lg font-semibold">94.7%</p>
                  </div>
                </div>
              </div>

              {/* Bullying Class */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Bullying Class</h4>
                  <Badge variant="destructive">1,153 samples</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Precision</p>
                    <p className="text-lg font-semibold">91.5%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recall</p>
                    <p className="text-lg font-semibold">90.3%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">F1-Score</p>
                    <p className="text-lg font-semibold">90.9%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Error Analysis</CardTitle>
            <CardDescription>Common patterns in misclassified examples</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">False Positives (97 cases)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sarcastic comments (34%)</li>
                  <li>• Competitive gaming language (28%)</li>
                  <li>• Informal slang usage (23%)</li>
                  <li>• Context-dependent phrases (15%)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">False Negatives (112 cases)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Subtle indirect threats (41%)</li>
                  <li>• Coded language/euphemisms (29%)</li>
                  <li>• Misspelled offensive words (18%)</li>
                  <li>• Cultural context variations (12%)</li>
                </ul>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Improvement areas:</strong> Better handling of sarcasm detection and cultural context
                  understanding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
