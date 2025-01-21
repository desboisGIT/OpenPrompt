"use client"

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import UnauthenticatedPage from '@/app/_components/pages/unauthenticated'
import { api } from '@/trpc/react'

const Dashboard = () => {
  const { status, data: session } = useSession()

  const { mutate: newTeam, error: newTeamError, status: newTeamStatus } = api.teams.createTeam.useMutation();

  if (status !== "authenticated") {
    return <UnauthenticatedPage />
  }

  return (
    <div className="px-8 py-4 flex flex-col space-y-12">

      {/* Create Team */}
      <div className="">
        {newTeamError && <pre>{newTeamError.message}</pre>}
        {newTeamStatus} <br />
        <span>Create a team</span>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          newTeam({ name: formData.get('teamName')?.toString() ?? "random" });
          console.log("Made new team");

        }}>
          <input name="teamName" required className='border' />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard
