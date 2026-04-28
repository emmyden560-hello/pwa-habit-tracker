"use client";

import React, { useEffect, useState, useCallback } from "react";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";

export default function HabitList() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const loadHabits = useCallback(() => {
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

    useEffect(() => {
        loadHabits();
    }, []);

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
    };

    const handleDelete = (habitId: string) => {
        const allHabitsStr = localStorage.getItem("habit-tracker-habits");
        const allHabits: Habit[] = allHabitsStr ? JSON.parse(allHabitsStr) : [];

        const updatedHabits = allHabits.filter((h) => h.id !== habitId);
        localStorage.setItem("habit-tracker-habits", JSON.stringify(updatedHabits));

        loadHabits();
    };

    const handleEditSuccess = () => {
        setEditingHabit(null);
        loadHabits();
    };

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
        <div className="flex flex-col gap-4 w-full">
            {editingHabit && (
                <div className="border-2 border-blue-500 p-4 rounded bg-blue-50">
                    <h3 className="font-bold mb-2">Editing: {editingHabit.name}</h3>
                    <HabitForm
                        initialData={editingHabit}
                        onSuccess={handleEditSuccess}
                    />
                    <button
                        onClick={() => setEditingHabit(null)}
                        className="mt-2 text-sm text-gray-600 underline"
                    >
                        Cancel Edit
                    </button>
                </div>
            )}
            <div className="grid gap-4 w-full">
                {habits.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onUpdate={loadHabits}
                    />
                ))}
            </div>
        </div>
    );
}
