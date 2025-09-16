"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, MessageSquare } from "lucide-react"

interface SampleText {
  text: string
  category: "bullying" | "non-bullying"
  description: string
}

const sampleTexts: SampleText[] = [
  {
    text: "You're such an amazing person, keep up the great work!",
    category: "non-bullying",
    description: "Positive encouragement",
  },
  {
    text: "Thanks for sharing this helpful information with everyone.",
    category: "non-bullying",
    description: "Appreciation message",
  },
  {
    text: "You're so stupid and worthless, nobody likes you.",
    category: "bullying",
    description: "Personal attack with insults",
  },
  {
    text: "Just give up already, you're pathetic and always will be.",
    category: "bullying",
    description: "Discouragement and harassment",
  },
  {
    text: "Looking forward to collaborating on this project together!",
    category: "non-bullying",
    description: "Professional collaboration",
  },
  {
    text: "Go kill yourself, loser. The world would be better without you.",
    category: "bullying",
    description: "Severe threat and harassment",
  },
]

interface SampleTextsProps {
  onSelectText: (text: string) => void
}

export default function SampleTexts({ onSelectText }: SampleTextsProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Sample Texts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {sampleTexts.map((sample, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge variant={sample.category === "bullying" ? "destructive" : "default"} className="text-xs">
                  {sample.category === "bullying" ? "Bullying" : "Safe"}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sample.text)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onSelectText(sample.text)}>
                    Use Text
                  </Button>
                </div>
              </div>
              <p className="text-sm text-foreground mb-2 leading-relaxed">"{sample.text}"</p>
              <p className="text-xs text-muted-foreground">{sample.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
