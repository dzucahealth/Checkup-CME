import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { db } from '@/lib/db'
import { extractUserFromRequest } from '@/lib/auth/extractUser'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let browser = null
  try {
    const userPayload = extractUserFromRequest(request)
    const { id } = await params

    const assessment = await db.assessment.findUnique({
      where: { id },
      include: {
        scores: true,
        result: true,
      },
    })

    if (!assessment) {
      return new Response('Avaliação não encontrada', { status: 404 })
    }

    if (assessment.status !== 'released' && assessment.status !== 'sent' && !userPayload) {
      return new Response('Resultado não disponível', { status: 403 })
    }

    const safeName = (assessment.name || 'avaliacao')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    const filename = `checkup-cme-${safeName}.pdf`

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`
    const url = `${baseUrl}/pdf/${id}`

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 800 })
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Wait for logo image to be loaded
    await page.waitForSelector('img[src*="logo"]', { timeout: 5000 }).catch(() => {})
    
    // Additional wait to ensure all resources are loaded
    await new Promise(resolve => setTimeout(resolve, 1000))

    const pdf = await page.pdf({
      printBackground: true,
      scale: 1,
      margin: {
        top: '10px',
        right: '10px',
        bottom: '10px',
        left: '10px',
      },
    })

    await browser.close()

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdf.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    if (browser) {
      await browser.close()
    }
    return new Response('Erro ao gerar PDF', { status: 500 })
  }
}