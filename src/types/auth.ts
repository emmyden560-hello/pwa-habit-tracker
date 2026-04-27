export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface Session {
    userId: string;
    email: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
