/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wand2, 
  Eye, 
  Code2, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle,
  Hash,
  Sparkles,
  Terminal,
  Layout,
  Command
} from 'lucide-react';
import katex from 'katex';
import { fixLatexCode, LatexFixResponse } from './services/geminiService';

export default function App() {
  const [latex, setLatex] = useState<string>(
    '\\begin{equation}\ne = mc^2\n\\end{equation}\n\n% Broken code example:\n\\frac{1}{0 % missing bracket'
  );
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [isFixing, setIsFixing] = useState(false);
  const [suggestion, setSuggestion] = useState<LatexFixResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [showExamples, setShowExamples] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const EXAMPLES = [
    { name: 'Missing Brace', code: '\\frac{1}{2 % missing bracket' },
    { name: 'Invalid Symbol', code: 'The energy formula is E = mc^2 & that is it.' },
    { name: 'Matrix Error', code: '\\begin{matrix} 1 & 2 \\\\ 3 & 4 % missing end' },
    { name: 'Unclosed Env', code: '\\begin{equation}\nx^2 + y^2 = z^2' },
  ];

  // KaTeX rendering logic
  useEffect(() => {
    try {
      // We try to render the whole block. 
      // For a real formatter, we might want to split by environments, 
      // but here we render it as a single block for simplicity of the preview.
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
      setRenderedHtml(html);
    } catch (err) {
      console.error('KaTeX rendering error:', err);
    }
  }, [latex]);

  const handleFix = async () => {
    if (!latex.trim()) return;
    setIsFixing(true);
    setSuggestion(null);
    try {
      const result = await fixLatexCode(latex);
      setSuggestion(result);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsFixing(false);
    }
  };

  const applyFix = () => {
    if (suggestion) {
      setLatex(suggestion.fixedCode);
      setSuggestion(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--accent)] selection:text-[var(--bg)] font-sans">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg)] z-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[var(--accent)] rounded-sm flex items-center justify-center text-[var(--bg)] font-bold text-xs">
            TX
          </div>
          <h1 className="text-sm font-medium tracking-widest uppercase text-[var(--accent)]">
            TeXFix <span className="text-[#6b6b63] font-normal italic ml-2 transform lowercase tracking-normal">v3.1</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#171715] rounded border border-[var(--border)] p-0.5">
            <button 
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 ${viewMode === 'editor' ? 'bg-[var(--border)] text-[var(--accent)]' : 'text-[#666] hover:text-[#999]'}`}
            >
              Editor
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 ${viewMode === 'split' ? 'bg-[var(--border)] text-[var(--accent)]' : 'text-[#666] hover:text-[#999]'}`}
            >
              Split
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 ${viewMode === 'preview' ? 'bg-[var(--border)] text-[var(--accent)]' : 'text-[#666] hover:text-[#999]'}`}
            >
              Preview
            </button>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded hover:bg-[#1c1c1a] transition-colors text-[#666] hover:text-[var(--fg)]"
            title="Copy LaTeX"
          >
            {copied ? <Check className="w-4 h-4 text-[var(--accent)]" /> : <Copy className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowExamples(!showExamples)}
              className="p-2 rounded hover:bg-[#1c1c1a] transition-colors text-[#666] hover:text-[var(--fg)]"
              title="Examples"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showExamples && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 5 }}
                  className="absolute right-0 mt-2 w-48 bg-[#1c1c1a] border border-[var(--border)] rounded shadow-2xl z-[100] overflow-hidden"
                >
                  <div className="px-4 py-2 text-[9px] font-bold text-[#6b6b63] border-b border-[var(--border)] uppercase tracking-widest">Repository</div>
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex.name}
                      onClick={() => {
                        setLatex(ex.code);
                        setShowExamples(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[11px] text-[#a3a398] hover:bg-[#262624] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)] last:border-0"
                    >
                      {ex.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setLatex('');
                      setShowExamples(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[11px] text-[var(--error)]/70 hover:bg-[var(--error)]/5 transition-colors uppercase tracking-widest font-bold"
                  >
                    Reset Environment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleFix}
            disabled={isFixing}
            className="px-4 py-1.5 rounded bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-sm"
          >
            {isFixing ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            Analyze
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`${viewMode === 'split' ? 'w-[620px]' : 'w-full'} flex flex-col border-r border-[var(--border)] bg-[#121211]`}>
            <div className="h-10 flex items-center justify-between px-4 bg-[#171715] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#8c8c82]">
                <Terminal className="w-3 h-3" /> main.tex
              </div>
              <div className="text-[10px] text-[#4d4d48] font-mono tracking-tighter uppercase">
                {latex.length} Bytes
              </div>
            </div>
            <div className="flex-1 overflow-auto relative flex">
              <div className="w-12 bg-[#171715] text-[#4d4d48] py-8 text-right pr-3 border-r border-[var(--border)] select-none font-mono text-[11px] leading-relaxed">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={editorRef}
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                className="flex-1 p-8 bg-transparent text-[#a3a398] font-mono text-[13px] resize-none focus:outline-none leading-relaxed"
                placeholder="Paste LaTeX source..."
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`flex-1 flex flex-col bg-[#171715] overflow-hidden`}>
            <div className="h-10 flex items-center justify-between px-4 bg-[#1c1c1a] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#8c8c82]">
                <Eye className="w-3 h-3" /> Live Preview
              </div>
              <div className="text-[10px] text-[#6b6b63] italic">Compiling...</div>
            </div>
            <div className="flex-1 overflow-auto p-12 flex justify-center bg-[radial-gradient(#2d2d2a_1px,transparent_1px)] [background-size:24px_24px]">
              <div 
                className="max-w-2xl w-full bg-white p-12 rounded-sm border border-[var(--border)] shadow-xl h-fit min-h-[400px] text-black"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        )}

        {/* AI Suggestion Layer */}
        <AnimatePresence>
          {suggestion && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-6 z-[60]"
            >
              <div className="bg-[#1c1c1a] border border-[var(--border)] rounded-lg shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="p-4 bg-[#262624] border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-tr from-[#6b6b63] to-[var(--accent)] rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Gemini AI Fixer</span>
                  </div>
                  <button 
                    onClick={() => setSuggestion(null)}
                    className="text-[#4d4d48] hover:text-[#6b6b63]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="p-6">
                  {suggestion.errors.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[9px] text-[#8c8c82] uppercase mb-1.5 tracking-tighter">Analysis</p>
                      <p className="text-[13px] leading-relaxed text-[#d1d1c7]">
                        {suggestion.errors[0]}. <span className="text-[var(--error)] font-bold italic underline underline-offset-4 decoration-[var(--error)]/30">{suggestion.explanation}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <p className="text-[9px] text-[#8c8c82] uppercase mb-1.5 tracking-tighter">Suggested Fix</p>
                    <div className="font-mono text-xs bg-[#171715] p-3 rounded border border-[var(--border)] text-[#8fbc8f] overflow-x-auto whitespace-pre">
                      {suggestion.fixedCode}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={applyFix}
                      className="flex-1 py-3 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded active:scale-[0.98] transition-all hover:bg-white"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer bar */}
      <footer className="h-8 border-t border-[var(--border)] bg-[var(--bg)] flex items-center justify-between px-6 text-[9px] text-[#4d4d48] font-medium tracking-tighter uppercase">
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>LaTeX v3.1</span>
          <span className="hidden sm:inline">Engine: XeLaTeX</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#6b6b63]">Gemini Pro API Connected</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
        </div>
      </footer>
    </div>
  );
}
