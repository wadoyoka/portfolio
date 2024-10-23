// lib/DateFether.ts

import { adminDb } from '@/lib/firebase-admin';

async function fetchData(username: string) {
    const snapshot = await adminDb.collection('PortfolioPass')
        .where('UserName', '==', username)
        .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function DataFetcher(username: string) {
    const data = await fetchData(username);
    return data;
}