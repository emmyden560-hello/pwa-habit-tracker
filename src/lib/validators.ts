export const validateHabitName = (name: string): { isValid: boolean; error?: string } => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return { isValid: false, error: 'Habit name is required.' };
    }
    
    if (trimmedName.length < 3) {
        return { isValid: false, error: 'Habit name must be at least 3 characters long.' };
    }

    if (trimmedName.length > 60) {
        return { isValid: false, error: 'Habit name must be less than 60 characters.' };
    }

    return { isValid: true };
};