import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
    it('adds a completion date when the date is not present', () => {
        const habit = {
            id: '1',
            name: 'Read a book',
            completions: [],
        } as unknown as Habit;
        const newHabit = toggleHabitCompletion(habit, '2022-01-01');
        expect(newHabit.completions).toContain('2022-01-01');
    });

    it('removes a completion date when the date already exists', () => {
        const habit = {
            id: '1',
            name: 'Read a book',
            completions: ['2022-01-01'],
        } as unknown as Habit;
        const newHabit = toggleHabitCompletion(habit, '2022-01-01');
        expect(newHabit.completions).not.toContain('2022-01-01');
    });

    it('does not mutate the original habit object', () => {
        const habit = {
            id: '1',
            name: 'Read a book',
            completions: [],
        } as unknown as Habit;
        const newHabit = toggleHabitCompletion(habit, '2022-01-01');
        expect(habit).not.toBe(newHabit);
    });

    it('does not return duplicate completion dates', () => {
        const habit = {
            id: '1',
            name: 'Read a book',
            completions: ['2022-01-01'],
        } as unknown as Habit;
        const newHabit = toggleHabitCompletion(habit, '2022-01-01');
        expect(newHabit.completions).toHaveLength(1);
    });
});

