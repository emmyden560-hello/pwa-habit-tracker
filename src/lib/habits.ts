import { Habit } from '../types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
    const existingDates = [...new Set(habit.completions)]; // deduplicate input defensively

    const newCompletions = existingDates.includes(date)
        ? existingDates.filter((d) => d !== date)       // remove if already exists
        : [...new Set([...existingDates, date])];        // add, then deduplicate

    return {
        ...habit,
        completions: newCompletions,
    };
}