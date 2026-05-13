import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractUserFromRequest } from '@/lib/auth/extractUser'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = extractUserFromRequest(request)
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { questionId, answer, allResponses, registrationData, consentGiven } = body

    const assessment = await db.assessment.findUnique({
      where: { id },
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é dono da avaliação
    if (assessment.userId !== userPayload.userId) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      )
    }

    // Se tem allResponses, salva tudo
    if (allResponses) {
      const responsesObj = typeof allResponses === 'string' 
        ? JSON.parse(allResponses) 
        : allResponses

      // Salvar ou atualizar cada resposta
      for (const [qId, ans] of Object.entries(responsesObj)) {
        await db.assessmentResponse.upsert({
          where: {
            assessmentId_questionId: {
              assessmentId: id,
              questionId: qId,
            },
          },
          create: {
            assessmentId: id,
            questionId: qId,
            answer: ans as number,
          },
          update: {
            answer: ans as number,
          },
        })
      }

      // Atualizar status para in_progress se ainda não estiver
      if (assessment.status === 'pending') {
        await db.assessment.update({
          where: { id },
          data: { status: 'in_progress' },
        })
      }
    } else if (questionId !== undefined && answer !== undefined) {
      // Salvar resposta única
      await db.assessmentResponse.upsert({
        where: {
          assessmentId_questionId: {
            assessmentId: id,
            questionId,
          },
        },
        create: {
          assessmentId: id,
          questionId,
          answer,
        },
        update: {
          answer,
        },
      })

      // Atualizar status
      if (assessment.status === 'pending') {
        await db.assessment.update({
          where: { id },
          data: { status: 'in_progress' },
        })
      }
    }

    // Atualizar dados de registro se fornecidos
    if (registrationData || consentGiven !== undefined) {
      const updateData: Record<string, unknown> = {}
      if (registrationData) {
        if (registrationData.name !== undefined) updateData.name = registrationData.name
        if (registrationData.position !== undefined) updateData.position = registrationData.position
        if (registrationData.phone !== undefined) updateData.phone = registrationData.phone
        if (registrationData.email !== undefined) updateData.email = registrationData.email
        if (registrationData.establishmentType !== undefined) updateData.establishmentType = registrationData.establishmentType
        if (registrationData.bedCount !== undefined) updateData.bedCount = registrationData.bedCount
        if (registrationData.cmeProfessionals !== undefined) updateData.cmeProfessionals = registrationData.cmeProfessionals
        if (registrationData.region !== undefined) updateData.region = registrationData.region
        if (registrationData.state !== undefined) updateData.state = registrationData.state
      }
      if (consentGiven !== undefined) {
        updateData.consentGiven = consentGiven
      }
      if (Object.keys(updateData).length > 0) {
        await db.assessment.update({
          where: { id },
          data: updateData,
        })
      }
    }

    // Contar respostas
    const responseCount = await db.assessmentResponse.count({
      where: { assessmentId: id },
    })

    return NextResponse.json({ 
      saved: true, 
      responseCount,
      status: 'in_progress' 
    })
  } catch (error) {
    console.error('Error in PUT /api/assessment/[id]/progress:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    )
  }
}