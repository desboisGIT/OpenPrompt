"use client"

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import UnauthenticatedPage from '@/app/_components/pages/unauthenticated'
import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'

const Dashboard = () => {
  const params = useParams<{ teamId: string }>() ?? { teamId: "None" };

  const { status, data: session } = useSession()

  const { mutate: newPrompt, error: newPromptError, status: newPromptStatus } = api.teams.createPrompt.useMutation();

  if (status !== "authenticated") {
    return <UnauthenticatedPage />
  }

  return (
    <div className="px-8 py-4 flex flex-col space-y-12">

      {/* Create Prompt */}
      <div className="">
        {newPromptError && <pre>{newPromptError.message}</pre>}
        {newPromptStatus} <br />
        <span>Create a prompt for team {params.teamId}</span>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const prompt = formData.get("prompt")
          const title = formData.get("prompt")
          const description = formData.get("prompt")

          newPrompt({ aiPrompt: prompt!.toString(), title: title!.toString(), description: description!.toString(), teamId: params.teamId })

          console.log("Made new prompt");

        }}>
          <input name="prompt" placeholder='prompt' required className='border' />
          <input name="title" placeholder='title' required className='border' />
          <input name="description" placeholder='description' required className='border' />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard
