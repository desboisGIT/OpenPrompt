"use client";

import { api } from '@/trpc/react';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const SettingsPage = () => {
    const params = useParams<{ teamId: string }>() ?? { teamId: "None" };

    const { data: settings, status, error } = api.users.getSettings.useQuery()

    useEffect(() => {
        if (status === "error" || error) {
            window.location.assign("/dashboard");
        }
    }, [status, error]);

    return (
        <div>
            {JSON.stringify(error?.message)}
            {!error && (
                <>
                    <pre>Settings</pre>
                    <pre>{JSON.stringify(settings, null, 2)}</pre>
                </>
            )}
        </div>
    );
};

export default SettingsPage;
