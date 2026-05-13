import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const session = await db.userSession.findFirst({
      where: {
        userId: payload.userId,
        token,
        expiresAt: { gt: new Date() },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão expirada' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Usuário inativo ou não encontrado' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error in GET /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar usuário' },
      { status: 500 }
    )
  }
}