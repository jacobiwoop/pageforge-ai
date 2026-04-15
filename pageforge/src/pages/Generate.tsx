import React, { useState } from 'react';
import { Link2, FileText, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Generate() {
  const [mode, setMode] = useState<'link' | 'text'>('link');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">GENERATE_PAGE</h1>
        <p className="text-sm font-mono text-gray-500 uppercase">AI_POWERED_PRODUCT_CREATION_ENGINE</p>
      </div>

      <div className="bg-white brutalist-border p-8">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setMode('link')}
            className={cn(
              "flex-1 py-4 brutalist-border flex items-center justify-center gap-2 font-bold uppercase transition-all",
              mode === 'link' ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-gray-50 hover:bg-gray-100"
            )}
          >
            <Link2 className="w-5 h-5" />
            IMPORT_FROM_URL
          </button>
          <button 
            onClick={() => setMode('text')}
            className={cn(
              "flex-1 py-4 brutalist-border flex items-center justify-center gap-2 font-bold uppercase transition-all",
              mode === 'text' ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-gray-50 hover:bg-gray-100"
            )}
          >
            <FileText className="w-5 h-5" />
            TEXT_DESCRIPTION
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {mode === 'link' ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider">SOURCE_URL (ALIBABA, ALIEXPRESS, ETC)</label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="url" 
                  required
                  placeholder="https://www.alibaba.com/product-detail/..." 
                  className="w-full pl-12 pr-4 py-4 brutalist-border bg-[#f4f4f5] font-mono text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-neon)]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider">PRODUCT_DESCRIPTION</label>
              <textarea 
                required
                rows={5}
                placeholder="Describe the product, key features, target audience, and desired tone..." 
                className="w-full p-4 brutalist-border bg-[#f4f4f5] font-mono text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-neon)] resize-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-black">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider">TARGET_LANGUAGE</label>
              <select className="w-full p-3 brutalist-border bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-neon)]">
                <option>ENGLISH (US)</option>
                <option>FRENCH (FR)</option>
                <option>SPANISH (ES)</option>
                <option>GERMAN (DE)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider">PAGE_TEMPLATE</label>
              <select className="w-full p-3 brutalist-border bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-neon)]">
                <option>HIGH_CONVERTING_V1</option>
                <option>MINIMAL_BRUTALIST</option>
                <option>STORYTELLING_LONGFORM</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isGenerating}
            className="w-full py-5 bg-black text-[var(--color-neon)] brutalist-border brutalist-shadow flex items-center justify-center gap-3 font-bold text-lg uppercase hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[4px_4px_0px_0px_#000]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                PROCESSING_NEURAL_DATA...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                INITIATE_GENERATION
                <ArrowRight className="w-6 h-6 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white brutalist-border p-6">
          <h3 className="font-bold uppercase mb-2">1. DATA_EXTRACTION</h3>
          <p className="text-xs font-mono text-gray-600">AI agents scrape product details, images, and specifications from the source URL.</p>
        </div>
        <div className="bg-white brutalist-border p-6">
          <h3 className="font-bold uppercase mb-2">2. CONTENT_SYNTHESIS</h3>
          <p className="text-xs font-mono text-gray-600">Generating high-converting copy, SEO metadata, and structuring the page layout.</p>
        </div>
        <div className="bg-white brutalist-border p-6">
          <h3 className="font-bold uppercase mb-2">3. SANDBOX_DEPLOY</h3>
          <p className="text-xs font-mono text-gray-600">Instant deployment to a secure Vercel sandbox environment for preview and testing.</p>
        </div>
      </div>
    </div>
  );
}
