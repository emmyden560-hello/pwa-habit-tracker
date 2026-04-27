"use client";

/* 
  Engineering Note: 
  This page handles the Login Flow as per Section 11 of the TRD.
  It uses the required localStorage key 'habit-tracker-session'.
*/

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SplashScreen from "@/components/shared/SplashScreen";

export default function LoginPage() {
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // 1. Check for existing session (Persistence Contract)
        const session = localStorage.getItem("habit-tracker-session");

        if (session) {
            // If session exists, redirect to dashboard
            router.push("/dashboard");
        } else {
            // Simulate splash screen delay (800ms - 2000ms range per TRD)
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [router]);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Log in to track your habits and maintain your streaks.
                    </p>
                </div>

                {/* LoginForm handles the actual email/password state and validation */}
                <LoginForm />

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => router.push("/signup")}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
}
