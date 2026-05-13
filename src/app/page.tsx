'use client';

import CheckupApp from '@/components/features/checkup/CheckupApp'
import CheckupPage from '@/components/features/checkup/CheckupPage'

export default function HomePage() {
  return (
    <CheckupApp>
      <CheckupPage />
    </CheckupApp>
  )
}