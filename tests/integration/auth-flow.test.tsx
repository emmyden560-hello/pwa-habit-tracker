import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { STORAGE_KEYS } from '@/lib/constants';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
    }),
}));

describe('auth flow', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('submits the signup form and creates a session', async () => {
        render(<SignupForm />);

        fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByTestId('auth-signup-submit'));

        await waitFor(() => {
            const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
            expect(session.email).toBe('test@example.com');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('shows an error for duplicate signup email', async () => {
        // Pre-register a user
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([{
            id: '1',
            email: 'existing@example.com',
            password: 'Pass123!',
            createdAt: new Date().toISOString()
        }]));

        render(<SignupForm />);

        fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'existing@example.com' } });
        fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByTestId('auth-signup-submit'));

        await waitFor(() => {
            expect(screen.getByText(/User already exists/i)).toBeDefined();
        });
    });

    it('submits the login form and stores the active session', async () => {
        // Pre-register a user
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([{
            id: '1',
            email: 'user@example.com',
            password: 'Password123!',
            createdAt: new Date().toISOString()
        }]));

        render(<LoginForm />);

        fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByTestId('auth-login-submit'));

        await waitFor(() => {
            const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
            expect(session.email).toBe('user@example.com');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('shows an error for invalid login credentials', async () => {
        render(<LoginForm />);

        fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'WrongPass123!' } });
        fireEvent.click(screen.getByTestId('auth-login-submit'));

        await waitFor(() => {
            expect(screen.getByText(/Invalid email or password/i)).toBeDefined();
        });
    });
});
