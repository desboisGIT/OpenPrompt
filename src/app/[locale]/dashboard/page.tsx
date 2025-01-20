"use client"

import { useSession } from 'next-auth/react'
import React from 'react'
import DashboardUnauthenticated from './pages/unauthenticated'

const Dashboard = () => {
  const { status, data: session } = useSession()


  if (status != "authenticated") {
    return <DashboardUnauthenticated />
  }

  return <div>

    You&lsquo;re authenticated. Sign out?
    <button onClick={() => { window.location.assign("/") }}>Log out</button>

  </div>
}

export default Dashboard