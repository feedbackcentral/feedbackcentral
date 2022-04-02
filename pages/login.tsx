import { NextPage } from "next";
import { useUser, Auth } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useEffect, useState } from 'react';

const LoginPage: NextPage = () => {
    const { user, error } = useUser();

    return (
        <div className="w-full h-full flex justify-center items-center bg-gray-50">
            <div className="w-1/2">
                {error && <p>{error.message}</p>}
                {/* TODO Replace with a custom made UI */}
                <Auth
                    supabaseClient={supabaseClient}
                    providers={['twitter']}
                    socialColors={true}
                    magicLink={true}
                    socialLayout="horizontal"
                    socialButtonSize="xlarge"
                    className="p-4 bg-white rounded-xl shadow-light-500"
                />
            </div>
        </div>
    );
}

export default LoginPage;