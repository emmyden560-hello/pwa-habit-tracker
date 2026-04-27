import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
    it('returns lowercase hyphenated slug for a basic habit name', () => {
        expect(getHabitSlug('Morning Run')).toBe('morning-run');
    });

    it('trims outer spaces and collapses repeated internal spaces', () => {
        expect(getHabitSlug('  Drink  water  ')).toBe('drink-water');
    });

    it('removes non alphanumeric characters except hyphens', () => {
        expect(getHabitSlug('Read 10% Daily!')).toBe('read-10-daily');
    });
});
