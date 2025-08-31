<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Question Bank Solver

A Next.js application that uses AI to parse question bank PDFs and generate detailed solutions.

## Features

- Upload and parse question bank PDFs
- AI-powered question structuring and organization
- Generate concise, focused solutions (150 words max per answer)
- **Rich text editing with Tiptap** - Edit and format your solutions with a modern markdown editor
- **PDF export functionality** - Download your solutions as professional PDFs via HTML conversion
- **Markdown export** - Save solutions as .md files
- **HTML export** - Save solutions as HTML files
- **Smart formatting** - Automatic table generation for comparison questions
- Modern, responsive UI built with Tailwind CSS
- Built with Next.js 14 and React 19

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key from Google AI Studio

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-question-bank-solver
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Debug and Testing

Visit `/debug` in your browser to access the PDF debug page, which helps troubleshoot PDF processing issues and shows extracted text content.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── debug/             # Debug and testing pages
│   │   └── page.tsx       # PDF debug page
│   └── globals.css        # Global styles
├── components/             # React components
├── services/               # API services
├── next.config.js         # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Technologies Used

- **Next.js 14** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Tiptap** - Modern rich text editor with markdown support
- **Marked** - Markdown to HTML conversion
- **Google Gemini AI** - AI processing

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key

## Deployment

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js.

## License

This project is licensed under the MIT License.
