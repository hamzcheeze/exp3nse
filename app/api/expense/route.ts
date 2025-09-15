import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const collection = await db.collection('expense');

        // Calculate the date 30 days ago from now
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const query = {
            date: {
                $gte: thirtyDaysAgo.toISOString().split('T')[0]
            }
        };

        const documents = await collection
            .find(query)
            .sort({ "date": -1 })
            .toArray();

        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error fetching details:', error);
        return NextResponse.json(
            { error: 'Error fetching details' },
            { status: 500 }
        );
    }
}
