'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, saveSession } from '@/lib/auth';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Register the user (Logic in lib/auth.ts checks if exists)
            const newUser = registerUser({ email, password });

            // 2. Auto-login by creating session
            saveSession({ userId: newUser.id, email: newUser.email });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-4 w-full max-w-sm">
            <div>
                <input
                    data-testid="auth-signup-email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-gray-900"
                />
            </div>
            <div>
                <input
                    data-testid="auth-signup-password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-gray-900"
                />
            </div>
            {error && (
                <p data-testid="auth-signup-error" className="text-red-500 text-sm">
                    {error}
                </p>
            )}
            <button
                data-testid="auth-signup-submit"
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded font-bold"
            >
                Create Account
            </button>
        </form>
    );
}
