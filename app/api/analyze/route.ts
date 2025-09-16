import { type NextRequest, NextResponse } from "next/server"

// Simulated model prediction function
// In production, this would call the actual RoBERTaNET model
function simulateModelPrediction(text: string) {
  const startTime = Date.now()

  // Simple heuristic for demonstration
  const bullyingKeywords = [
    "stupid",
    "idiot",
    "loser",
    "ugly",
    "hate",
    "kill",
    "die",
    "worthless",
    "pathetic",
    "trash",
    "disgusting",
    "failure",
    "nobody",
    "disappear",
  ]

  const positiveKeywords = [
    "amazing",
    "great",
    "wonderful",
    "love",
    "beautiful",
    "awesome",
    "fantastic",
    "excellent",
    "good",
    "nice",
    "helpful",
    "kind",
  ]

  const words = text.toLowerCase().split(/\s+/)
  const wordCount = words.length

  let bullyingScore = 0
  let positiveScore = 0

  words.forEach((word) => {
    if (bullyingKeywords.some((keyword) => word.includes(keyword))) {
      bullyingScore += 1
    }
    if (positiveKeywords.some((keyword) => word.includes(keyword))) {
      positiveScore += 1
    }
  })

  // Calculate probabilities based on keyword analysis
  const totalKeywords = bullyingScore + positiveScore
  let bullyingProbability = 0.1 // Base probability

  if (totalKeywords > 0) {
    bullyingProbability = bullyingScore / totalKeywords
  }

  // Add some randomness for demonstration
  bullyingProbability += (Math.random() - 0.5) * 0.2
  bullyingProbability = Math.max(0, Math.min(1, bullyingProbability))

  const nonBullyingProbability = 1 - bullyingProbability
  const prediction = bullyingProbability > 0.5 ? "bullying" : "non-bullying"
  const confidence = Math.max(bullyingProbability, nonBullyingProbability)

  // Determine risk level
  let riskLevel: "low" | "medium" | "high"
  if (bullyingProbability > 0.7) {
    riskLevel = "high"
  } else if (bullyingProbability > 0.4) {
    riskLevel = "medium"
  } else {
    riskLevel = "low"
  }

  const processingTime = Date.now() - startTime

  return {
    prediction,
    confidence,
    bullying_probability: bullyingProbability,
    non_bullying_probability: nonBullyingProbability,
    processing_time: processingTime,
    word_count: wordCount,
    risk_level: riskLevel,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "Text is too long. Maximum 5000 characters allowed." }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const result = simulateModelPrediction(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error during analysis" }, { status: 500 })
  }
}
