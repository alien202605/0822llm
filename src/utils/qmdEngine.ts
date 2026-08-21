import { WikiPage, QmdSearchResult } from '../types';

/**
 * Lightweight local hybrid search engine simulator (qmd)
 * Combines BM25 token-level exact match with semantic vector similarity
 */

// Simple tokenizer for Chinese and English keywords
function tokenize(text: string): string[] {
  const normalized = text.toLowerCase();
  const words = normalized
    .replace(/[#*`_\[\]()|:\-—\n]/g, ' ')
    .split(/\s+/)
    .filter(w => w.trim().length > 0);
  
  // Chinese 2-gram and single characters
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const bigrams: string[] = [];
  for (let i = 0; i < chineseChars.length - 1; i++) {
    bigrams.push(chineseChars[i] + chineseChars[i + 1]);
  }

  return Array.from(new Set([...words, ...chineseChars, ...bigrams]));
}

// Calculate BM25-like lexical score
function calculateBM25(query: string, page: WikiPage): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const fullText = (
    page.frontmatter.title + ' ' +
    (page.frontmatter.tags || []).join(' ') + ' ' +
    (page.frontmatter.aliases || []).join(' ') + ' ' +
    page.content + ' ' +
    page.rawMarkdown
  ).toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (!token) continue;
    
    // Title match boost
    if (page.frontmatter.title.toLowerCase().includes(token)) {
      score += 3.5;
    }
    // Tag / Alias match boost
    if (
      page.frontmatter.tags.some(t => t.toLowerCase().includes(token)) ||
      (page.frontmatter.aliases && page.frontmatter.aliases.some(a => a.toLowerCase().includes(token)))
    ) {
      score += 2.5;
    }
    // Content occurrence
    const count = (fullText.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    if (count > 0) {
      score += Math.min(count * 0.4, 4.0);
    }
  }

  return Math.min(score, 10.0);
}

// Calculate simulated vector cosine similarity score (0.0 to 1.0)
function calculateVectorSimilarity(query: string, page: WikiPage): number {
  const semanticDomainMap: Record<string, string[]> = {
    '差旅': ['出差', '报销', '补贴', 'per diem', '城市', '合规', '发票', 'oa', 'biz-trip'],
    '报销': ['补贴', '差旅', '财务', '发票', '流程', 'sop', '审批', '核销', '贴票'],
    '补贴': ['per diem', '生活补助', '一线城市', '220', '160', '标准', '上调', '津贴'],
    '客服': ['ai', 'agent', '坐席', 'qwen', '准确率', '工单', '转接', '异常', '应急'],
    '架构': ['技术选型', 'qmd', 'rag', '本地', '向量', 'bm25', '轻量', 'node', 'git'],
    'qmd': ['混合检索', '本地搜索', 'bm25', '向量', 'embedding', 'mcp', 'cli', 'update'],
    'rag': ['向量数据库', '切片', 'chunk', '知识库', 'llm wiki', '选型', '对比', '召回'],
    '定价': ['收费', '版本', '标准版', '企业版', 'saas', 'faq', '售前', '费用', '万元'],
    '术语': ['黑话', '缩写', '定义', '概念', 'per diem', 'qmd', 'multi-touch']
  };

  const lowerQuery = query.toLowerCase();
  let semanticMatches = 0;
  let totalKeywords = 0;

  for (const [domain, keywords] of Object.entries(semanticDomainMap)) {
    if (lowerQuery.includes(domain)) {
      totalKeywords += keywords.length;
      for (const kw of keywords) {
        if (page.rawMarkdown.toLowerCase().includes(kw)) {
          semanticMatches += 1;
        }
      }
    }
  }

  // Base semantic baseline
  let baseScore = 0.45;
  if (totalKeywords > 0) {
    baseScore += (semanticMatches / totalKeywords) * 0.5;
  }

  // Length & recency gentle bias
  const lengthFactor = Math.min(page.wordCount / 1000, 0.05);
  return Math.min(Math.max(baseScore + lengthFactor, 0.2), 0.98);
}

// Find matching snippets
function findSnippets(query: string, page: WikiPage): string[] {
  const lines = page.rawMarkdown.split('\n');
  const tokens = tokenize(query).filter(t => t.length >= 2);
  const snippets: string[] = [];

  for (const line of lines) {
    if (line.startsWith('---') || line.trim() === '') continue;
    for (const token of tokens) {
      if (line.toLowerCase().includes(token)) {
        snippets.push(line.trim());
        break;
      }
    }
    if (snippets.length >= 3) break;
  }

  if (snippets.length === 0) {
    snippets.push(page.content.slice(0, 120) + '...');
  }

  return snippets;
}

export function searchQmd(query: string, pages: WikiPage[], topK: number = 5): QmdSearchResult[] {
  if (!query || query.trim() === '') return [];

  const results: QmdSearchResult[] = pages.map(page => {
    const bm25 = calculateBM25(query, page);
    const vector = calculateVectorSimilarity(query, page);

    // Hybrid score weighting: 60% BM25 (scaled 0-1) + 40% Vector
    const normalizedBM25 = Math.min(bm25 / 10.0, 1.0);
    const hybrid = normalizedBM25 * 0.6 + vector * 0.4;

    let matchType: 'exact_keyword' | 'semantic_vector' | 'hybrid' = 'hybrid';
    if (normalizedBM25 > 0.7 && vector < 0.5) matchType = 'exact_keyword';
    else if (normalizedBM25 < 0.2 && vector > 0.6) matchType = 'semantic_vector';

    return {
      page,
      bm25Score: Number(bm25.toFixed(2)),
      vectorScore: Number(vector.toFixed(2)),
      hybridScore: Number(hybrid.toFixed(3)),
      matchedSnippets: findSnippets(query, page),
      matchType
    };
  });

  // Sort descending by hybrid score
  return results
    .filter(r => r.hybridScore > 0.3 || r.bm25Score > 0.5)
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, topK);
}
