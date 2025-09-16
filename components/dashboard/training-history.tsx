"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const trainingData = [
  { epoch: 1, train_loss: 0.68, val_loss: 0.62, train_acc: 0.72, val_acc: 0.75 },
  { epoch: 2, train_loss: 0.45, val_loss: 0.41, train_acc: 0.84, val_acc: 0.86 },
  { epoch: 3, train_loss: 0.32, val_loss: 0.29, train_acc: 0.89, val_acc: 0.91 },
  { epoch: 4, train_loss: 0.24, val_loss: 0.22, train_acc: 0.92, val_acc: 0.93 },
  { epoch: 5, train_loss: 0.19, val_loss: 0.18, train_acc: 0.94, val_acc: 0.94 },
  { epoch: 6, train_loss: 0.16, val_loss: 0.16, train_acc: 0.95, val_acc: 0.95 },
  { epoch: 7, train_loss: 0.14, val_loss: 0.15, train_acc: 0.96, val_acc: 0.95 },
  { epoch: 8, train_loss: 0.12, val_loss: 0.14, train_acc: 0.96, val_acc: 0.95 },
  { epoch: 9, train_loss: 0.11, val_loss: 0.14, train_acc: 0.97, val_acc: 0.95 },
  { epoch: 10, train_loss: 0.1, val_loss: 0.13, train_acc: 0.97, val_acc: 0.96 },
]

const learningRateData = [
  { epoch: 1, lr: 2e-5 },
  { epoch: 2, lr: 1.8e-5 },
  { epoch: 3, lr: 1.6e-5 },
  { epoch: 4, lr: 1.4e-5 },
  { epoch: 5, lr: 1.2e-5 },
  { epoch: 6, lr: 1.0e-5 },
  { epoch: 7, lr: 8e-6 },
  { epoch: 8, lr: 6e-6 },
  { epoch: 9, lr: 4e-6 },
  { epoch: 10, lr: 2e-6 },
]

export default function TrainingHistory() {
  return (
    <div className="space-y-6">
      {/* Loss Curves */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Validation Loss</CardTitle>
          <CardDescription>Model loss progression during training</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="train_loss"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Training Loss"
              />
              <Line
                type="monotone"
                dataKey="val_loss"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                name="Validation Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Accuracy Curves */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Validation Accuracy</CardTitle>
          <CardDescription>Model accuracy progression during training</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trainingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" />
              <YAxis domain={[0.7, 1.0]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="train_acc"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                name="Training Accuracy"
              />
              <Area
                type="monotone"
                dataKey="val_acc"
                stackId="2"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
                fillOpacity={0.3}
                name="Validation Accuracy"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Learning Rate Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Rate Schedule</CardTitle>
            <CardDescription>Learning rate decay during training</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={learningRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="lr" stroke="hsl(var(--accent))" strokeWidth={2} name="Learning Rate" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Training Summary</CardTitle>
            <CardDescription>Key training statistics and milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Epochs</p>
                <p className="text-2xl font-bold text-primary">10</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Training Time</p>
                <p className="text-2xl font-bold text-primary">2.3h</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Best Epoch</p>
                <p className="text-2xl font-bold text-primary">8</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Final Val Acc</p>
                <p className="text-2xl font-bold text-primary">96.0%</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Training Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Early stopping at epoch 8</li>
                <li>• No overfitting observed</li>
                <li>• Stable convergence achieved</li>
                <li>• Model saved at best validation accuracy</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
