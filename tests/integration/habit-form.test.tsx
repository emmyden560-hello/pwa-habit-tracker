import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HabitForm from '@/components/habits/HabitForm';

describe('Habit Form Integration', () => {
    beforeEach(() => {
        cleanup();
        localStorage.clear();
        // Mocking session so the form doesn't error out
        localStorage.setItem('habit-tracker-session', JSON.stringify({
            userId: 'user-123',
            email: 'test@example.com'
        }));
    });

    it('should create a new habit and persist to local storage', () => {
        const onSuccess = vi.fn();
        render(<HabitForm onSuccess={onSuccess} />);

        // 1. Target exact data-testids from TRD
        const nameInput = screen.getByTestId('habit-name-input');
        const descInput = screen.getByTestId('habit-description-input');
        const saveBtn = screen.getByTestId('habit-save-button');

        // 2. Simulate User Input
        fireEvent.change(nameInput, { target: { value: 'Morning Run' } });
        fireEvent.change(descInput, { target: { value: '5km around the park' } });
        fireEvent.click(saveBtn);

        // 3. Verify Persistence Contract
        const habitsStr = localStorage.getItem('habit-tracker-habits');
        const habits = JSON.parse(habitsStr || '[]');

        expect(habits).toHaveLength(1);
        expect(habits[0].name).toBe('Morning Run');
        expect(habits[0].userId).toBe('user-123');
        expect(onSuccess).toHaveBeenCalled();
    });

    it('should show error message when habit name is empty', () => {
        render(<HabitForm onSuccess={() => { }} />);

        const saveBtn = screen.getByTestId('habit-save-button');
        fireEvent.click(saveBtn);

        // TRD Requirement: "Habit name is required"
        expect(screen.getByText(/habit name is required/i)).toBeDefined();

        // Ensure nothing was saved
        const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
        expect(habits).toHaveLength(0);
    });
});
