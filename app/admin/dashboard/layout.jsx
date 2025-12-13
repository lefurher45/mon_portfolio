// app/admin/dashboard/layout.jsx
"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_auth') === 'true'
    if (!isLoggedIn) {
      router.push('/admin')
    }
  }, [router])

  return <>{children}</>
}