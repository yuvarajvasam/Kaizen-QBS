import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(request: NextRequest) {
    try {
        const { html, filename } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Launch Puppeteer with @sparticuz/chromium for Vercel compatibility
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: {
                width: 1200,
                height: 800,
                deviceScaleFactor: 1,
            },
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();

        // Set content and wait for it to load
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF with proper settings
        const pdfBuffer = await page.pdf({
            format: 'a4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });

        await browser.close();

        // Return the PDF as a response
        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename || 'solution.pdf'}"`,
                'Content-Length': Buffer.byteLength(pdfBuffer).toString()
            }
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' }, 
            { status: 500 }
        );
    }
}
