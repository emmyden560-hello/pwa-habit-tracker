"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";
import SplashScreen from "@/components/shared/SplashScreen";

export default function SignupPage() {
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // 1. Persistence Check: If a session exists, the user shouldn't be here.
        const session = localStorage.getItem("habit-tracker-session");

        if (session) {
            router.replace("/dashboard");
        } else {
            // 2. Branding/UX: Apply the required splash delay (800ms - 2000ms)
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 1000); // 1s is safe within the TRD range
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Join the Habit Tracker Wizards and start your journey.
                    </p>
                </div>

                {/* SignupForm handles the user creation and local persistence */}
                <SignupForm />

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={() => router.push("/login")}
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
}
