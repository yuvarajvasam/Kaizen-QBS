import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Kaizen Question Bank Solver API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
}
