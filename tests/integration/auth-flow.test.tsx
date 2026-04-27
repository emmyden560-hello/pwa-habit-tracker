import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '@/components/auth/LoginForm';
import { STORAGE_KEYS } from '@/lib/constants';

// 1. Mock the Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
    }),
}));

describe('Auth Flow Integration', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should successfully login and redirect to dashboard with valid credentials', async () => {
        // Setup: Pre-register a user in localStorage
        const testUser = { email: 'wizard@test.com', password: 'password123', id: '1' };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([testUser]));

        render(<LoginForm />);

        // Action: Fill out and submit form
        fireEvent.change(screen.getByTestId('login-email'), { target: { value: 'wizard@test.com' } });
        fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByTestId('login-submit'));

        // Assert: Check if session was created and user redirected
        await waitFor(() => {
            const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
            expect(session.email).toBe('wizard@test.com');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should display an error message for non-existent users', async () => {
        render(<LoginForm />);

        fireEvent.change(screen.getByTestId('login-email'), { target: { value: 'unknown@test.com' } });
        fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
        fireEvent.click(screen.getByTestId('login-submit'));

        await waitFor(() => {
            expect(screen.getByTestId('login-error')).toBeDefined();
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});
