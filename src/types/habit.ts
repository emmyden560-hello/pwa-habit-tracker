export interface Habit {
    id: string;
    userId: string;
    name: string;
    description: string;
    frequency: 'daily';
    createdAt: string;
    completions: string[];
}

export interface HabitFormData {
    name: string;
    description: string;
}
