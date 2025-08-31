import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { html, filename } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Return the HTML content for client-side PDF generation
        return NextResponse.json({
            success: true,
            html: html,
            filename: filename || 'solution.pdf'
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json(
            { error: 'Failed to process PDF request' }, 
            { status: 500 }
        );
    }
}
