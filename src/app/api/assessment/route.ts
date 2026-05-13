import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractUserFromRequest } from '@/lib/auth/extractUser'

export async function POST(request: NextRequest) {
  try {
    const userPayload = extractUserFromRequest(request)
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { registrationData, responses, result, createOnly } = body

    // Se createOnly=true, cria avaliação vazia (para progresso automático)
    if (createOnly) {
      const assessment = await db.assessment.create({
        data: {
          userId: userPayload.userId,
          name: registrationData?.name || '',
          position: registrationData?.position || '',
          phone: registrationData?.phone || '',
          email: registrationData?.email || '',
          establishmentType: registrationData?.establishmentType || '',
          bedCount: registrationData?.bedCount || '',
          cmeProfessionals: registrationData?.cmeProfessionals || '',
          region: registrationData?.region || '',
          state: registrationData?.state || '',
          consentGiven: registrationData?.consentGiven || false,
          status: 'pending',
          totalScore: 0,
        },
      })
      return NextResponse.json({ id: assessment.id }, { status: 201 })
    }

    if (!registrationData || !responses || !result) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes' },
        { status: 400 }
      )
    }

    const responsesObj: Record<string, number> = {}
    if (responses instanceof Map) {
      responses.forEach((val: number, key: string) => { responsesObj[key] = val })
    } else if (typeof responses === 'object') {
      Object.assign(responsesObj, responses)
    }

    const managementScore = result.categoryScores?.find((c: { category: string }) => c.category === 'gestao')?.percentage ?? null
    const processScore = result.categoryScores?.find((c: { category: string }) => c.category === 'processo')?.percentage ?? null
    const technologyScore = result.categoryScores?.find((c: { category: string }) => c.category === 'tecnologia')?.percentage ?? null
    const financialScore = result.categoryScores?.find((c: { category: string }) => c.category === 'financeiro')?.percentage ?? null

    const assessment = await db.assessment.create({
      data: {
        userId: userPayload.userId,
        name: registrationData.name,
        position: registrationData.position,
        phone: registrationData.phone,
        email: registrationData.email,
        establishmentType: registrationData.establishmentType,
        bedCount: registrationData.bedCount,
        cmeProfessionals: registrationData.cmeProfessionals,
        region: registrationData.region,
        state: registrationData.state,
        consentGiven: true,
        status: 'completed',
        totalScore: result.totalPercentage ?? result.totalScore ?? 0,
      },
    })

    await db.assessmentScore.createMany({
      data: [
        { assessmentId: assessment.id, category: 'gestao', score: result.categoryScores?.find((c: { category: string }) => c.category === 'gestao')?.score ?? 0, maxScore: result.categoryScores?.find((c: { category: string }) => c.category === 'gestao')?.maxScore ?? 0, percentage: managementScore ?? 0 },
        { assessmentId: assessment.id, category: 'processo', score: result.categoryScores?.find((c: { category: string }) => c.category === 'processo')?.score ?? 0, maxScore: result.categoryScores?.find((c: { category: string }) => c.category === 'processo')?.maxScore ?? 0, percentage: processScore ?? 0 },
        { assessmentId: assessment.id, category: 'tecnologia', score: result.categoryScores?.find((c: { category: string }) => c.category === 'tecnologia')?.score ?? 0, maxScore: result.categoryScores?.find((c: { category: string }) => c.category === 'tecnologia')?.maxScore ?? 0, percentage: technologyScore ?? 0 },
        { assessmentId: assessment.id, category: 'financeiro', score: result.categoryScores?.find((c: { category: string }) => c.category === 'financeiro')?.score ?? 0, maxScore: result.categoryScores?.find((c: { category: string }) => c.category === 'financeiro')?.maxScore ?? 0, percentage: financialScore ?? 0 },
      ],
    })

    const responseData = Object.entries(responsesObj).map(([questionId, answer]) => ({
      assessmentId: assessment.id,
      questionId,
      answer,
    }))
    
    if (responseData.length > 0) {
      await db.assessmentResponse.createMany({ data: responseData })
    }

    await db.assessmentResult.create({
      data: {
        assessmentId: assessment.id,
        managementScore,
        processScore,
        technologyScore,
        financialScore,
        resultJson: JSON.stringify(result),
      },
    })

    return NextResponse.json({ id: assessment.id }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/assessment:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar avaliação' },
      { status: 500 }
    )
  }
}