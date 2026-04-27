"use client";

import React, { useEffect, useState } from "react";
import HabitCard from "./HabitCard";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";

export default function HabitList() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Get current session to filter habits by owner
        const sessionStr = localStorage.getItem("habit-tracker-session");
        const session: Session | null = sessionStr ? JSON.parse(sessionStr) : null;

        if (session) {
            // 2. Load and filter habits
            const allHabitsStr = localStorage.getItem("habit-tracker-habits");
            const allHabits: Habit[] = allHabitsStr ? JSON.parse(allHabitsStr) : [];

            const userHabits = allHabits.filter((h) => h.userId === session.userId);
            setHabits(userHabits);
        }

        setIsLoading(false);
    }, []);

    if (isLoading) return null;

    // UI Contract: Render empty state when there are no habits for the user
    if (habits.length === 0) {
        return (
            <div data-testid="empty-state" className="flex flex-col items-center justify-center p-10 text-gray-500">
                <p>No habits created yet. Start by adding one!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 w-full">
            {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
            ))}
        </div>
    );
}
