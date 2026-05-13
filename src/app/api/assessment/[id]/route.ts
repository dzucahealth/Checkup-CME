import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractUserFromRequest } from '@/lib/auth/extractUser'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = extractUserFromRequest(request)
    
    if (!userPayload || userPayload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso restrito' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status, adminObservation, economyMinEdited, economyMaxEdited, financialRiskLevelEdited, financialLossEdited, resultJson, visibleSections } = body

    console.log('[PUT] Body recebido:', JSON.stringify({ 
      status, 
      adminObservation: adminObservation ? 'sim' : 'não',
      economyMinEdited, 
      economyMaxEdited, 
      financialRiskLevelEdited,
      financialLossEdited,
      hasVisibleSections: !!visibleSections,
      visibleSections 
    }))

    const existingAssessment = await db.assessment.findUnique({
      where: { id },
    })

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (status) updateData.status = status
    if (status === 'released') {
      updateData.releasedAt = new Date()
    }

    await db.assessment.update({
      where: { id },
      data: updateData,
    })

    const existingResult = await db.assessmentResult.findUnique({
      where: { assessmentId: id },
    })
    console.log('[PUT] existingResult:', existingResult ? JSON.stringify({ 
      resultJson: existingResult.resultJson?.substring(0, 200),
      economyMinEdited: existingResult.economyMinEdited,
      economyMaxEdited: existingResult.economyMaxEdited,
      financialRiskLevelEdited: existingResult.financialRiskLevelEdited 
    }) : 'null')

    let finalResultJson = null
    console.log('[PUT] visibleSections antes do if:', visibleSections)
    console.log('[PUT] existing resultJson:', existingResult?.resultJson ? 'sim' : 'não')
    if (visibleSections) {
      const existing = existingResult?.resultJson ? JSON.parse(existingResult.resultJson) : {}
      console.log('[PUT] existing parseado keys:', Object.keys(existing))
      finalResultJson = { ...existing, visibleSections }
      console.log('[PUT] finalResultJson com visibleSections keys:', Object.keys(finalResultJson))
    } else if (resultJson) {
      finalResultJson = resultJson
    } else if (existingResult?.resultJson) {
      finalResultJson = JSON.parse(existingResult.resultJson)
    }

    console.log('[PUT] finalResultJson:', finalResultJson ? JSON.stringify(finalResultJson).substring(0, 300) : 'null')

    if (existingResult) {
      await db.assessmentResult.update({
        where: { assessmentId: id },
        data: {
          adminObservation,
          economyMinEdited,
          economyMaxEdited,
          financialRiskLevelEdited,
          financialLossEdited,
          resultJson: finalResultJson ? JSON.stringify(finalResultJson) : undefined,
          ...(status === 'released' && { releasedAt: new Date() }),
        },
      })
    } else if (adminObservation || resultJson || visibleSections) {
      await db.assessmentResult.create({
        data: {
          assessmentId: id,
          adminObservation,
          economyMinEdited,
          economyMaxEdited,
          financialRiskLevelEdited,
          financialLossEdited,
          resultJson: finalResultJson ? JSON.stringify(finalResultJson) : null,
          ...(status === 'released' && { releasedAt: new Date() }),
        },
      })
    }

    // Log final para confirmar salvamento
    const updatedResult = await db.assessmentResult.findUnique({ where: { assessmentId: id } })
    console.log('[PUT] Resultado após salvar:', updatedResult ? JSON.stringify({ 
      resultJson: updatedResult.resultJson?.substring(0, 300),
      economyMinEdited: updatedResult.economyMinEdited,
      economyMaxEdited: updatedResult.economyMaxEdited,
      financialRiskLevelEdited: updatedResult.financialRiskLevelEdited
    }) : 'não encontrado')

    return NextResponse.json({ message: 'Avaliação atualizada com sucesso' })
  } catch (error) {
    console.error('Error in PUT /api/assessment/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = extractUserFromRequest(request)
    const { id } = await params

    const assessment = await db.assessment.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        scores: true,
        responses: true,
        result: true,
      },
    })

    // Se avaliação não existe
    if (!assessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Se avaliação não está liberada, precisa de autenticação
    if (assessment.status !== 'released' && assessment.status !== 'sent' && !userPayload) {
      return NextResponse.json(
        { error: 'Resultado não disponível' },
        { status: 403 }
      )
    }

    // Se tem token, verifica acesso
    if (userPayload && userPayload.role !== 'admin' && assessment.userId !== userPayload.userId) {
      return NextResponse.json(
        { error: 'Acesso restrito' },
        { status: 403 }
      )
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error in GET /api/assessment/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    )
  }
}