import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { html, filename } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Get browserless.io API key from environment variables
        const browserlessApiKey = process.env.BROWSERLESS_API_KEY;
        
        if (!browserlessApiKey) {
            console.error('BROWSERLESS_API_KEY not configured');
            return NextResponse.json(
                { error: 'PDF generation service not configured' }, 
                { status: 500 }
            );
        }

        // Create a complete HTML document with proper styling
        const completeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${filename || 'Solution'}</title>
                <meta charset="utf-8">
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6; 
                        margin: 20px; 
                        color: #333;
                        max-width: 800px;
                        margin: 20px auto;
                    }
                    h1, h2, h3 { 
                        color: #2c3e50; 
                        padding-bottom: 10px;
                    }
                    h1 { font-size: 2em; margin-top: 0; }
                    h2 { font-size: 1.5em; }
                    h3 { font-size: 1.2em; }
                    
                    table { 
                        border-collapse: collapse; 
                        width: 100%; 
                        margin: 20px 0;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    th { 
                        background-color: #3498db; 
                        color: white; 
                        padding: 12px 8px; 
                        text-align: left; 
                        font-weight: bold;
                    }
                    td { 
                        border: 1px solid #ddd; 
                        padding: 12px 8px; 
                        text-align: left; 
                    }
                    tr:nth-child(even) { background-color: #f8f9fa; }
                    
                    ul, ol { 
                        margin: 15px 0; 
                        padding-left: 30px; 
                    }
                    ol { 
                        counter-reset: item;
                        list-style-type: decimal;
                    }
                    ol li { 
                        margin: 8px 0; 
                        display: list-item;
                        list-style-position: outside;
                    }
                    ul li { 
                        margin: 8px 0; 
                        display: list-item;
                    }
                    
                    p { margin: 15px 0; }
                    
                    code { 
                        background-color: #f4f4f4; 
                        padding: 2px 6px; 
                        border-radius: 4px; 
                        font-family: 'Courier New', monospace;
                    }
                    
                    pre { 
                        background-color: #f8f9fa; 
                        padding: 15px; 
                        border-radius: 8px; 
                        overflow-x: auto;
                        border-left: 4px solid #3498db;
                    }
                    
                    blockquote { 
                        border-left: 4px solid #3498db; 
                        margin: 20px 0; 
                        padding: 10px 20px; 
                        background-color: #f8f9fa;
                        font-style: italic;
                    }
                    
                    .header { 
                        text-align: center; 
                        margin-bottom: 40px; 
                        border-bottom: 3px solid #3498db; 
                        padding-bottom: 30px; 
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 40px; 
                        font-size: 14px; 
                        color: #7f8c8d; 
                        border-top: 1px solid #ddd; 
                        padding-top: 20px; 
                    }
                    .content { margin: 0 auto; }
                    
                    @media print {
                        .page-break { page-break-before: always; }
                        body { margin: 15px; }
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    ${html}
                </div>
            </body>
            </html>
        `;

        // Call browserless.io API to generate PDF
        const response = await fetch(`https://production-sfo.browserless.io/pdf?token=${browserlessApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: completeHtml,
                options: {
                    format: 'A4',
                    margin: {
                        top: '20mm',
                        right: '20mm',
                        bottom: '20mm',
                        left: '20mm'
                    },
                    printBackground: true,
                    preferCSSPageSize: true
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Browserless API error:', errorText);
            throw new Error(`Browserless API error: ${response.status} ${errorText}`);
        }

        const pdfBuffer = await response.arrayBuffer();

        // Return the PDF as a downloadable file
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename || 'solution.pdf'}"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' }, 
            { status: 500 }
        );
    }
}
