import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { html, filename } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Return the HTML content for client-side printing (no server-side PDF generation)
        return NextResponse.json({
            success: true,
            html: html,
            filename: filename || 'solution.pdf'
        });

    } catch (error) {
        console.error('Print preparation error:', error);
        return NextResponse.json(
            { error: 'Failed to prepare print content' }, 
            { status: 500 }
        );
    }
}
