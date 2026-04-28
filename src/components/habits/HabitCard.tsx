"use client";

import { useMemo } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";

interface HabitCardProps {
    habit: Habit;
    onUpdate?: () => void; // Used to refresh the list after a state change
    onEdit?: (habit: Habit) => void; // Called when edit button is clicked
    onDelete?: (habitId: string) => void; // Called when delete button is clicked
}

export default function HabitCard({ habit, onUpdate, onEdit, onDelete }: HabitCardProps) {
    // UI Contract: Use the slug utility for test IDs
    const slug = useMemo(() => getHabitSlug(habit.name), [habit.name]);

    // Logic: Get today's date in YYYY-MM-DD format for streak and completion checks
    const today = new Array(new Date().toISOString().split("T")[0])[0];

    const streak = useMemo(() =>
        calculateCurrentStreak(habit.completions, today),
        [habit.completions, today]
    );

    const isCompletedToday = habit.completions.includes(today);

    const handleToggle = () => {
        const allHabitsStr = localStorage.getItem("habit-tracker-habits");
        const allHabits: Habit[] = allHabitsStr ? JSON.parse(allHabitsStr) : [];

        // Use the required utility for the update
        const updatedHabit = toggleHabitCompletion(habit, today);

        const updatedAllHabits = allHabits.map((h) =>
            h.id === habit.id ? updatedHabit : h
        );

        localStorage.setItem("habit-tracker-habits", JSON.stringify(updatedAllHabits));
        if (onUpdate) onUpdate();
    };

    const handleEdit = () => {
        if (onEdit) onEdit(habit);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(habit.id);
    };

    return (
        <div
            data-testid={`habit-card-${slug}`}
            className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold capitalize">{habit.name}</h3>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                </div>

                {/* UI Contract: Streak display */}
                <div data-testid={`habit-streak-${slug}`} className="text-sm font-medium">
                    Streak: {streak}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                {/* UI Contract: Completion toggle */}
                <button
                    data-testid={`habit-complete-${slug}`}
                    onClick={handleToggle}
                    className={`px-4 py-2 rounded transition-colors ${isCompletedToday
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    {isCompletedToday ? "Completed" : "Mark Complete"}
                </button>

                <button
                    data-testid={`habit-edit-${slug}`}
                    onClick={handleEdit}
                    className="text-blue-600 text-sm font-medium"
                >
                    Edit
                </button>

                <button
                    data-testid={`habit-delete-${slug}`}
                    onClick={handleDelete}
                    className="text-red-600 text-sm font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
