import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, hashPassword } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso restrito' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, email, role, isActive, password } = body

    const updateData: Record<string, unknown> = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (typeof isActive === 'boolean') updateData.isActive = isActive
    if (password) updateData.password = await hashPassword(password)

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in PUT /api/users/[id]:', error)
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso restrito' }, { status: 403 })
    }

    const { id } = await params

    if (id === payload.userId) {
      return NextResponse.json(
        { error: 'Não é possível desativar seu próprio usuário' },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Usuário desativado com sucesso' })
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error)
    return NextResponse.json({ error: 'Erro ao desativar usuário' }, { status: 500 })
  }
}