import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

describe('calculateCurrentStreak', () => {
    it('should returns 0 when completions is empty', () => {
        expect(calculateCurrentStreak([])).toBe(0);
    });

    it('should returns 0 when today is not completed', () => {
        const completions = ['2024-04-24', '2024-04-23', '2024-04-22'];
        expect(calculateCurrentStreak(completions)).toBe(0);
    });



    it('should returns the correct streak for consecutive completed days', () => {
        const completions = ['2024-04-25', '2024-04-24', '2024-04-23'];
        expect(calculateCurrentStreak(completions)).toBe(3);
    });

    it('should ignores duplicate completion dates', () => {
        const completions = ['2024-04-25', '2024-04-25', '2024-04-25'];
        expect(calculateCurrentStreak(completions)).toBe(1);
    });

    it('should breaks the streak when a calendar day is missing', () => {
        const completions = ['2024-04-25', '2024-04-23', '2024-04-22'];
        expect(calculateCurrentStreak(completions)).toBe(0);
    });
});
