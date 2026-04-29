"use client";

import React, { useState } from "react";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";
import { validateHabitName } from "@/lib/validators";

interface HabitFormProps {
    initialData?: Habit; // For Edit mode
    onSuccess: () => void;
}

export default function HabitForm({ initialData, onSuccess }: HabitFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 1. Logic: Validate name using the required utility
        const validation = validateHabitName(name);
        if (!validation.valid) {
            setError(validation.error || 'Validation failed');
            return;
        }

        // 2. Auth: Ensure habit belongs to current user
        const sessionStr = localStorage.getItem("habit-tracker-session");
        const session: Session | null = sessionStr ? JSON.parse(sessionStr) : null;

        if (!session) {
            setError("You must be logged in to save habits.");
            return;
        }

        const allHabitsStr = localStorage.getItem("habit-tracker-habits");
        const allHabits: Habit[] = allHabitsStr ? JSON.parse(allHabitsStr) : [];

        if (initialData) {
            // Edit Habit Rule: Retain same id, userId, createdAt, and completions
            const updatedHabits = allHabits.map((h) =>
                h.id === initialData.id
                    ? { ...h, name: validation.value, description }
                    : h
            );
            localStorage.setItem("habit-tracker-habits", JSON.stringify(updatedHabits));
        } else {
            // Create Habit Rule: Default frequency to 'daily'
            const newHabit: Habit = {
                id: crypto.randomUUID(),
                userId: session.userId,
                name: validation.value,
                description,
                frequency: "daily",
                createdAt: new Date().toISOString(),
                completions: [],
            };
            localStorage.setItem("habit-tracker-habits", JSON.stringify([...allHabits, newHabit]));
        }

        onSuccess();
    };

    return (
        <form
            onSubmit={handleSubmit}
            data-testid="habit-form"
            className="flex flex-col gap-4 p-4 border rounded bg-gray-50"
        >
            <div className="flex flex-col gap-1">
                <label htmlFor="habit-name" className="text-sm font-medium text-blue-600">Habit Name</label>
                <input
                    id="habit-name"
                    data-testid="habit-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded text-gray-900"
                    placeholder="e.g. Drink Water"
                />
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="habit-desc" className="text-sm font-medium text-blue-600">Description (Optional)</label>
                <textarea
                    id="habit-desc"
                    data-testid="habit-description-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded text-gray-900"
                    placeholder="Stay hydrated throughout the day"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="habit-freq" className="text-sm font-medium text-blue-600">Frequency</label>
                <select
                    id="habit-freq"
                    data-testid="habit-frequency-select"
                    disabled
                    value="daily"
                    className="p-2 border rounded bg-gray-200 text-gray-900"
                >
                    <option value="daily">Daily</option>
                </select>
            </div>

            <button
                type="submit"
                data-testid="habit-save-button"
                className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition-colors"
            >
                {initialData ? "Update Habit" : "Save Habit"}
            </button>
        </form>
    );
}
