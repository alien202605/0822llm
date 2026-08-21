import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Cpu, CheckCircle2, FileText } from 'lucide-react';
import { WikiPage, QmdSearchResult } from '../types';
import { searchQmd } from '../utils/qmdEngine';

interface QmdSimpleSearchViewProps {
  wikiPages: WikiPage[];
  onNavigateToWikiPage: (path: string) => void;
}

export const QmdSimpleSearchView: React.FC<QmdSimpleSearchViewProps> = ({
  wikiPages,
  onNavigateToWikiPage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<QmdSearchResult[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const suggestedQueries = [
    '差旅补贴',
    '智能客服系统',
    '自媒体直播带货复盘',
    'SaaS 定价与商业模式',
    '合规与违禁词拦截',
    'Per Diem 制度定义'
  ];

  const handlePerformSearch = (queryText: string) => {
    const q = (queryText || searchQuery).trim();
    if (!q) return;
    if (queryText) setSearchQuery(queryText);

    setIsSearching(true);
    setErrorMsg(null);

    try {
      // Use the exact same robust local hybrid QMD engine (BM25 + Vector scoring + RRF) as the overview dashboard testbench
      const results = searchQmd(q, wikiPages, 5);
      setSearchResults(results);
    } catch (err: any) {
      setErrorMsg(`检索失败: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">


      {/* Search Bar & Button */}
      <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center space-x-3">
        <div className="pl-3 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePerformSearch(searchQuery)}
          placeholder="输入关键词进行 qmd 混合检索 (例如: 差旅补贴、智能客服...)"
          className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
        />
        <button
          onClick={() => handlePerformSearch(searchQuery)}
          disabled={isSearching}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isSearching ? (
            <span>检索中...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>开始搜索</span>
            </>
          )}
        </button>
      </div>

      {/* Suggested Search Queries */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          建议搜索内容与热门词汇
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handlePerformSearch(tag)}
              className="px-3.5 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-medium rounded-xl border border-slate-200 transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Search className="w-3 h-3 text-slate-400" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Search Results */}
      {searchResults !== null && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>qmd 混合召回结果 (共 {searchResults.length} 条)</span>
            <span className="text-emerald-600 font-bold">Vector + BM25 RRF Fusion</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <p className="text-xs text-slate-500">未找到相关 Wiki 页面，请尝试其他关键词。</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-[10px] flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {item.page.frontmatter.title}
                        </h4>
                      </div>
                      <span className="font-mono text-[11px] text-indigo-600 block pl-7">
                        {item.page.path}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200 font-bold">
                        Score: {item.hybridScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    {item.matchedSnippets[0] || item.page.content.slice(0, 120)}
                  </p>

                  <div className="pl-7 pt-2 flex items-center justify-end">
                    <button
                      onClick={() => onNavigateToWikiPage(item.page.path)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>打开 Wiki 文档阅读</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
