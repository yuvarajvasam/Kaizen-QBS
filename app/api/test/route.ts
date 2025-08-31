import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Test API route working',
        timestamp: new Date().toISOString(),
        commit: '1d6722a',
        status: 'success'
    });
}
