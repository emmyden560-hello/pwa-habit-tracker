"use client";

import { useMemo } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";
import { storage, STORAGE_KEYS } from "@/lib/storage";

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
    const today = new Date().toISOString().split("T")[0];

    const streak = useMemo(() =>
        calculateCurrentStreak(habit.completions, today),
        [habit.completions, today]
    );

    const isCompletedToday = habit.completions.includes(today);

    const handleToggle = () => {
        const allHabits: Habit[] = storage.get<Habit[]>(STORAGE_KEYS.HABITS) || [];

        // Use the required utility for the update
        const updatedHabit = toggleHabitCompletion(habit, today);

        const updatedAllHabits = allHabits.map((h) => (h.id === habit.id ? updatedHabit : h));

        storage.set(STORAGE_KEYS.HABITS, updatedAllHabits);
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
                    <h3 className="text-lg font-bold text-blue-700 capitalize">{habit.name}</h3>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                </div>

                {/* UI Contract: Streak display */}
                <div data-testid={`habit-streak-${slug}`} className="text-sm font-medium text-gray-500">
                    Streak: {streak}
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                {/* UI Contract: Completion toggle */}
                <button
                    data-testid={`habit-complete-${slug}`}
                    onClick={handleToggle}
                    type="button"
                    className={`px-4 py-2 cursor-pointer rounded transition-colors ${isCompletedToday
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    {isCompletedToday ? "Completed" : "Mark Complete"}
                </button>
                <div className='flex items-center gap-3'>
                    <button
                        data-testid={`habit-edit-${slug}`}
                        onClick={handleEdit}
                        type="button"
                        className="text-blue-600 cursor-pointer text-sm font-medium"
                    >
                        Edit
                    </button>

                    <button
                        data-testid={`habit-delete-${slug}`}
                        onClick={handleDelete}
                        type="button"
                        className="text-red-600 cursor-pointer text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
