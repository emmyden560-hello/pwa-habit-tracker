'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';
import { clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [refreshList, setRefreshList] = useState(0);

    const handleLogout = () => {
        clearSession();
        router.push('/login');
    };

    const handleHabitCreated = () => {
        setRefreshList(prev => prev + 1);
    };

    return (
        <ProtectedRoute>
            <div className="p-4 max-w-md mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-900">My Habits</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 font-medium"
                    >
                        Logout
                    </button>
                </header>

                <HabitForm onSuccess={handleHabitCreated} />
                <HabitList key={refreshList} />
            </div>
        </ProtectedRoute>
    );
}
