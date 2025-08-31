import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
    try {
        const { html, filename } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Launch Puppeteer with serverless-optimized settings
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-extensions'
            ]
        });

        const page = await browser.newPage();

        // Set content and wait for it to load
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF with proper settings
        const pdfBuffer = await page.pdf({
            format: 'A4',
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
