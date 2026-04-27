'use client';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import { clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        clearSession();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className="p-4 max-w-md mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">My Habits</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 font-medium"
                    >
                        Logout
                    </button>
                </header>

                <HabitList />
            </div>
        </ProtectedRoute>
    );
}
