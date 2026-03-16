import React from 'react'
import AdminPage from '@/components/pages/admin'
import { auth } from '@/auth'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Admin() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return redirect('/login');
    }

    const { email } = session.user || {};
    if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
        return redirect('/');
    }

    return (
        <AdminPage />
    )
}
