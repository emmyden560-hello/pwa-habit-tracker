import { User, Session } from '@/types/auth';
import { STORAGE_KEYS } from './constants';

const isClient = typeof window !== 'undefined';

export const getStoredUsers = (): User[] => {
    if (!isClient) return [];
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
};

export const saveSession = (session: Session) => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
};

export const clearSession = () => {
    if (!isClient) return;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const authenticateUser = (email: string, password: string): User | null => {
    const users = getStoredUsers();
    return users.find((u) => u.email === email && u.password === password) || null;
};

export const registerUser = (data: Omit<User, 'id' | 'createdAt'>): User => {
    const users = getStoredUsers();
    if (users.find((u) => u.email === data.email)) {
        throw new Error('User already exists');
    }

    const newUser: User = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    if (isClient) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, newUser]));
    }
    return newUser;
};
