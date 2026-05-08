# TeXFix

TeXFix is a modern, high-end LaTeX code formatter and error fixer powered by Gemini AI. It provides a seamless environment for writing, previewing, and debugging LaTeX documents with the help of advanced AI analysis.

## Features

- **AI-Powered Error Correction**: Connected to the Gemini API, TeXFix examines your LaTeX code, identifies syntax errors or missing delimiters, and suggests precise fixes.
- **Live Typesetting Preview**: Utilizes KaTeX for instantaneous, high-performance rendering of your LaTeX source.
- **Multiple View Modes**:
  - **Split View**: Edit and preview side-by-side.
  - **Editor View**: Focus entirely on your source code.
  - **Preview View**: See your typeset document in full glory.
- **High-End "Natural Tones" UI**: A sophisticated, dark-themed interface designed for focus and aesthetic pleasure, featuring custom scrollbars and a professional typography system.
- **Code Repository**: Load common LaTeX error examples to see the AI fixer in action.
- **One-Click Application**: Apply AI suggestions directly to your source code with a single click.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **AI**: Google Gemini API (@google/genai)
- **Math Rendering**: KaTeX

## Getting Started

1. **Configure API Key**: Ensure your `GEMINI_API_KEY` is set in the Secrets panel or `.env` file.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

1. Paste your LaTeX code into the editor.
2. Click **"Analyze"** to let Gemini AI scan for improvements or errors.
3. Review the suggested fix in the AI Fixer overlay.
4. Click **"Apply Suggestion"** to update your source code.
5. Use the view toggles in the header to switch between different workspace layouts.

## GitHub Deployment

To ensure the AI features work after deploying to GitHub:

1. Go to your GitHub Repository **Settings**.
2. Navigate to **Secrets and variables** > **Actions**.
3. Add a **New repository secret** with Name: `GEMINI_API_KEY` and Value: `your_api_key_here`.
4. Go to **Settings** > **Pages**.
5. Set **Build and deployment** > **Source** to `GitHub Actions`.
6. The site will automatically deploy on your next push to `main`.
