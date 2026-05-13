import { NextRequest } from 'next/server'
import { verifyToken, TokenPayload } from './jwt'

export function extractUserFromRequest(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) return null
  
  return verifyToken(token)
}