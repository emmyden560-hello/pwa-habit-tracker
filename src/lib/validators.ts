export const validateHabitName = (name: string): string => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return 'Habit name is required.';
    }

    if (trimmedName.length < 3) {
        return 'Habit name must be at least 3 characters long.';
    }

    if (trimmedName.length > 60) {
        return 'Habit name cannot exceed 60 characters.';
    }

    return trimmedName;
};