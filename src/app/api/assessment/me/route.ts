import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractUserFromRequest } from '@/lib/auth/extractUser'

export async function GET(request: NextRequest) {
  try {
    const userPayload = extractUserFromRequest(request)
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Buscar avaliação em andamento ou pendente mais recente
    const assessment = await db.assessment.findFirst({
      where: {
        userId: userPayload.userId,
        status: { in: ['pending', 'in_progress'] },
      },
      include: {
        responses: true,
        scores: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    if (!assessment) {
      return NextResponse.json({ assessment: null })
    }

    // Converter respostas para objeto
    const responsesObj: Record<string, number> = {}
    assessment.responses.forEach(r => {
      responsesObj[r.questionId] = r.answer
    })

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        name: assessment.name,
        position: assessment.position,
        phone: assessment.phone,
        email: assessment.email,
        establishmentType: assessment.establishmentType,
        bedCount: assessment.bedCount,
        cmeProfessionals: assessment.cmeProfessionals,
        region: assessment.region,
        state: assessment.state,
        consentGiven: assessment.consentGiven,
        status: assessment.status,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt,
      },
      responses: responsesObj,
      scores: assessment.scores,
    })
  } catch (error) {
    console.error('Error in GET /api/assessment/me:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    )
  }
}