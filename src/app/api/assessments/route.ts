import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { extractUserFromRequest } from '@/lib/auth/extractUser'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const userPayload = extractUserFromRequest(request as unknown as NextRequest)
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = userPayload.role === 'admin' 
      ? (status ? { status: status as string } : {})
      : { userId: userPayload.userId }

    const assessments = await db.assessment.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true },
        },
        scores: true,
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = assessments.map(a => ({
      id: a.id,
      name: a.name,
      position: a.position,
      phone: a.phone,
      email: a.email,
      establishmentType: a.establishmentType,
      bedCount: a.bedCount,
      cmeProfessionals: a.cmeProfessionals,
      region: a.region,
      state: a.state,
      totalScore: a.totalScore,
      status: a.status,
      createdAt: a.createdAt.toISOString(),
      userId: a.userId,
      userName: a.user?.name ?? null,
      userEmail: a.user?.email ?? null,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações' },
      { status: 500 }
    )
  }
}