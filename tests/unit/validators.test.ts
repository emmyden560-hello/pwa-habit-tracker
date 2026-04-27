import { describe, it, expect } from 'vitest';
import { validateHabitName } from '@/lib/validators';
describe('validateHabitName', () => {
    it('should return an error when habit name is empty', () => {
        expect(validateHabitName('')).toBe('Habit name is required.');
    });

    it('should return an error when habit name exceeds 60 characters', () => {
        const longName = 'a'.repeat(61);
        expect(validateHabitName(longName)).toBe('Habit name cannot exceed 60 characters.');
    });

    it('should return a trimmed value when habit name is valid', () => {
        expect(validateHabitName('  Read a book  ')).toBe('Read a book');
    });
})