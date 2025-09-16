import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'training_results.json')
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const json = JSON.parse(data)
    return NextResponse.json(json)
  } catch (error) {
    const errMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)
    return NextResponse.json({ error: 'Could not read training_results.json', details: errMsg }, { status: 500 })
  }
}

