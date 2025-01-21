"use client"

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import UnauthenticatedPage from '@/app/_components/pages/unauthenticated'
import { api } from '@/trpc/react'

const Dashboard = () => {
  const { status, data: session } = useSession()

  const { mutate: newTeam, error: newTeamError } = api.teams.createTeam.useMutation();

  const { data: teamData } = api.teams.getUserTeams.useQuery()

  const [prompt, setPrompt] = useState('')


  if (status !== "authenticated") {
    return <UnauthenticatedPage />
  }

  return (
    <div className="px-8 py-4 flex flex-col space-y-12">
      <span>Loadinng Status: {status}</span>

      {/* Enrolled Teams */}
      <div className="">
        <span>Teams</span>
        <pre>{JSON.stringify(teamData, null, 2) ?? <pre>Loading...</pre>}</pre>
      </div>

      {/* Account Information */}
      <div className="">
        <span>
          Account Information
        </span>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Dashboard
