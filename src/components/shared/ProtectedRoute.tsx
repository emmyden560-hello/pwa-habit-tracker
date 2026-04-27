'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/lib/constants';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const session = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (!session) {
            router.replace('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) return null;

    return <>{children}</>;
}
