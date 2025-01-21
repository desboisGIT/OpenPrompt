import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const UnauthenticatedPage = () => {
    return (
        <div className='flex flex-col h-screen w-full justify-center items-center bg-gray-100 px-6'>
            <div className="flex flex-col justify-center items-center space-y-6 bg-white p-10 shadow-lg rounded-lg border border-gray-200">
                <Image
                    src="/branding/alternative-icon.png"
                    className='shadow-lg rounded-md'
                    onClick={() => (window.location.assign("/"))}
                    alt='Icon'
                    width={80}
                    height={80}
                />
                <span className='text-5xl font-bold text-red-500'>
                    401
                </span>
                <span className='text-lg text-gray-600 text-center'>
                    You don't have permission to access this resource.
                </span>
            </div>
        </div>

    )
}

export default UnauthenticatedPage