npm <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Kaizen Question Bank Solver

An AI-powered application that transforms question bank PDFs into comprehensive study guides with detailed solutions. Built with Next.js, React, and Google's Gemini AI.

## Features

- 📄 **PDF Upload & Processing**: Drag and drop PDF question banks for AI analysis
- 🧠 **AI-Powered Solutions**: Generate detailed answers using Google's Gemini AI
- 📚 **Module Organization**: Automatically structure questions into modules and parts
- 📊 **Part-Based Solutions**: Clear separation of Part A, B, and C solutions with proper numbering
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📤 **Multiple Export Formats**: Download solutions as Markdown, HTML, or PDF
- ⚡ **Real-time Processing**: Instant AI analysis and solution generation

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI
- **PDF Processing**: PDF.js, Puppeteer
- **Markdown**: React Markdown, Remark GFM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-question-bank-solver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Prerequisites
- Vercel account
- Google Gemini API key

### Deployment Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   
   **Option A: Using Vercel Dashboard**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Add environment variable `GEMINI_API_KEY` in Vercel dashboard
   - Deploy

   **Option B: Using Vercel CLI**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   In your Vercel project settings, add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Configure Function Timeout**
   The PDF generation function is configured with a 30-second timeout in `vercel.json`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Usage

1. **Upload PDF**: Drag and drop your question bank PDF
2. **Select Module**: Choose the module you want to solve
3. **Select Parts**: Choose which parts (A, B, C) to include
4. **Generate Solutions**: Click "Generate Solution" to get AI-powered answers
5. **Export**: Download your solutions in Markdown, HTML, or PDF format

## Project Structure

```
ai-question-bank-solver/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Button.tsx         # Reusable button component
│   ├── Card.tsx           # Card layout component
│   ├── FileUploader.tsx   # PDF upload component
│   ├── ModuleSelector.tsx # Module selection component
│   ├── SolutionDisplay.tsx # Solution display component
│   └── ...                # Other components
├── services/              # Business logic
│   └── geminiService.ts   # AI service integration
├── public/                # Static assets
├── vercel.json            # Vercel configuration
└── next.config.js         # Next.js configuration
```

## API Routes

- `POST /api/generate-pdf`: Generates PDF from HTML content using Puppeteer

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository.

---

**Made with ❤️ by [Yuvaraj Vasam](https://www.linkedin.com/in/yuvarajvasam/)**
