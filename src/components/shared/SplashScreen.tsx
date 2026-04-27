"use client";

import React from "react";

export default function SplashScreen() {
    return (
        <div
            data-testid="splash-screen"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
            <div className="flex flex-col items-center gap-4">
                {/* Replace with your actual icon later */}
                <div className="w-20 h-20 bg-blue-600 rounded-2xl animate-bounce" />
                <h1 className="text-2xl font-bold text-gray-800">Habit Tracker</h1>
                <p className="text-gray-500 animate-pulse">Loading your progress...</p>
            </div>
        </div>
    );
}
