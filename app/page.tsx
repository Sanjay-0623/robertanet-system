"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Zap, BarChart3, Activity } from "lucide-react"
import TextAnalyzer from "@/components/text-analyzer"
import SampleTexts from "@/components/sample-texts"
import Link from "next/link"

export default function HomePage() {
  const [selectedText, setSelectedText] = useState("")

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
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">RoBERTaNET</h1>
        <p className="text-xs text-gray-500">Cyberbullying Detection System</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#analysis" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Analysis</Link>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors">
              <BarChart3 className="w-5 h-5" /> Dashboard
            </Link>
            <Link href="/monitor" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors">
              <Activity className="w-5 h-5" /> Monitor
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
  <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-300 px-4 py-2 text-base font-semibold">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" /> Real-time Detection
          </Badge>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 text-balance">
            Advanced Cyberbullying Detection with <span className="text-yellow-600">GloVe-Enhanced RoBERTa</span>
          </h2>
          <p className="text-2xl text-gray-600 mb-10 text-pretty max-w-2xl mx-auto">
            Combining global semantic relationships with contextual understanding to identify cyberbullying with unprecedented accuracy and speed.
          </p>

          <div className="flex items-center justify-center gap-6 mb-12">
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-800 px-6 py-3 text-lg font-semibold shadow-md hover:bg-yellow-200">
                <BarChart3 className="w-5 h-5 text-yellow-600" /> View Dashboard
              </Button>
            </Link>
            <Link href="/monitor">
              <Button variant="outline" className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-800 px-6 py-3 text-lg font-semibold shadow-md hover:bg-yellow-200">
                <Activity className="w-5 h-5 text-yellow-600" /> Live Monitor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Text Analysis Section */}
      <section id="analysis" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Analysis Interface */}
            <div className="lg:col-span-2">
              <TextAnalyzer key={selectedText} initialText={selectedText} />
            </div>

            {/* Sample Texts Sidebar */}
            <div id="samples">
              <SampleTexts onSelectText={setSelectedText} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
  <section id="features" className="py-20 px-4 bg-white rounded-xl shadow-xl mx-4 mb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">Model Capabilities</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              RoBERTaNET combines the best of both worlds: global semantic understanding and contextual analysis for superior cyberbullying detection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-yellow-100 shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-yellow-800">GloVe Embeddings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Captures global semantic relationships and word associations across large text corpora for comprehensive understanding.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-100 shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-800">RoBERTa Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Provides deep contextual understanding of text sequences and nuanced language patterns in social media content.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-100 shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800">Real-time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Optimized for fast inference to enable real-time monitoring and immediate response to cyberbullying incidents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
  <footer className="bg-white text-gray-700 py-10 px-4 shadow-xl border-t border-gray-200">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="mb-2 text-lg font-bold">RoBERTaNET Cyberbullying Detection System</p>
          <p className="text-base opacity-80">Research prototype for academic and educational purposes</p>
        </div>
      </footer>
    </div>
  )
}
