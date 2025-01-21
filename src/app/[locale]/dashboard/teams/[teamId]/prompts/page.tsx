"use client";

import UnauthenticatedPage from '@/app/_components/pages/unauthenticated';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const TeamPage = () => {
    const params = useParams<{ teamId: string }>() ?? { teamId: "None" };

    const { status, data: session } = useSession()
    
    
    const { data: team, status: promptStatus, error } = api.teams.getTeam.useQuery(
        { teamId: params.teamId },
        {
            retry: false
        }
    );
    
    useEffect(() => {
        if (promptStatus === "error" || error) {
            window.location.assign("/dashboard");
        }
    }, [status, error]);
    
    if (status !== "authenticated") {
        return <UnauthenticatedPage />
    }
    
    return (
        <div>
            {JSON.stringify(error?.message)}
            {!error && (
                <>
                    <pre>Prompts</pre>
                    <pre>{JSON.stringify(team?.prompts, null, 2)}</pre>
                </>
            )}
        </div>
    );
};

export default TeamPage;
