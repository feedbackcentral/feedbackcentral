import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CheckEmailPage: NextPage = ({ }) => {
    const router = useRouter();

    useEffect(() => {
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if(event == "SIGNED_IN") {
                router.push("/app")
            }
        })
    }, [])

    return (
        <div className="w-full h-full bg-white">
            <div className="min-h-full flex">
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <img
                                className="h-12 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                alt="Workflow"
                            />
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check your emails</h2>
                        </div>

                        <div className="mt-2 text-gray-800 space-y-4">
                            <div>
                                We have sent a magic login link to your email, please check your emails and click the link you were sent to login to your account.
                            </div>
                            <div>
                                If you haven&lsquo;t received an email, check your spam folder. If the email is not there please go back to the <span className="text-indigo-600 hover:underline"><Link href="/auth/login">login page</Link></span> and try again.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block relative w-0 flex-1">
                    {/* TODO Change Image */}
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

// TODO redirect if already authenticated

export default CheckEmailPage;