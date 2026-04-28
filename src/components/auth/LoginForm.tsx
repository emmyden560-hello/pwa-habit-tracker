'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, saveSession } from '@/lib/auth';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const user = authenticateUser(email, password);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Create session as required by TRD
            saveSession({ userId: user.id, email: user.email });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
            <div>
                <input
                    data-testid="auth-login-email"
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
                    data-testid="auth-login-password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-gray-900"
                />
            </div>
            {error && (
                <p data-testid="auth-login-error" className="text-red-500 text-sm">
                    {error}
                </p>
            )}
            <button
                data-testid="auth-login-submit"
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded font-bold"
            >
                Login
            </button>
        </form>
    );
}
