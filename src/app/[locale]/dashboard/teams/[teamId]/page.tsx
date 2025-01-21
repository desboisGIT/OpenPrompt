"use client";

import UnauthenticatedPage from '@/app/_components/pages/unauthenticated';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const TeamPage = () => {

    const { status } = useSession()

    const params = useParams<{ teamId: string }>() ?? { teamId: "None" };

    const { data: team, status: teamStatus, error } = api.teams.getTeam.useQuery(
        { teamId: params.teamId },
        {
            retry: false
        }
    );

    useEffect(() => {
        if (teamStatus === "error" || error) {
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
                    <pre>{params.teamId}</pre>
                    <pre>{status}</pre>
                    <pre>{JSON.stringify(team, null, 2)}</pre>
                </>
            )}
        </div>
    );
};

export default TeamPage;
