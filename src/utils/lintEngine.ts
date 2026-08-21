import { WikiPage, LintIssue } from '../types';

export function runLintScan(pages: WikiPage[]): LintIssue[] {
  const issues: LintIssue[] = [];
  const existingPaths = new Set(pages.map(p => p.path));

  // Count incoming links to find orphan nodes
  const incomingLinkCount: Record<string, number> = {};
  pages.forEach(p => {
    incomingLinkCount[p.path] = 0;
  });

  pages.forEach(p => {
    // 1. Schema check
    if (!p.frontmatter.title || p.frontmatter.title.trim() === '') {
      issues.push({
        id: `schema-title-${p.id}`,
        type: 'schema_error',
        severity: 'high',
        sourcePath: p.path,
        message: `页面缺少必要 YAML Frontmatter: title 属性`,
        suggestedFix: `补充页面标题 Frontmatter 声明`,
        autoFixable: true
      });
    }

    if (!p.frontmatter.sources || p.frontmatter.sources.length === 0) {
      issues.push({
        id: `schema-source-${p.id}`,
        type: 'schema_error',
        severity: 'medium',
        sourcePath: p.path,
        message: `页面未声明溯源 Layer 1: sources 字段`,
        suggestedFix: `根据 Ingest 记录补充 raw/ 文件来源引用`,
        autoFixable: true
      });
    }

    // 2. Dangling links check
    for (const link of p.outgoingLinks) {
      if (!existingPaths.has(link)) {
        issues.push({
          id: `dangling-${p.id}-${link.replace(/[^a-zA-Z0-9]/g, '_')}`,
          type: 'dangling_link',
          severity: 'high',
          sourcePath: p.path,
          targetRef: link,
          message: `悬空死链：引用的目标页面 [[${link}]] 不存在`,
          suggestedFix: `在 ${link.startsWith('wiki/terms/') ? 'wiki/terms/' : '对应目录'} 下自动生成标准草稿页，或移除该无效双链引用`,
          autoFixable: true
        });
      } else {
        incomingLinkCount[link] = (incomingLinkCount[link] || 0) + 1;
      }
    }

    // 3. Contradiction / Outdated content check
    if (p.rawMarkdown.includes('120 元/天') && !p.rawMarkdown.includes('已废止') && !p.rawMarkdown.includes('已更正')) {
      issues.push({
        id: `contra-${p.id}-120perdiem`,
        type: 'contradiction',
        severity: 'medium',
        sourcePath: p.path,
        message: `疑似政策冲突：检测到可能过时的补贴标准 (120元/天)，与2026年最新制度冲突`,
        suggestedFix: `标注 [⚠️ 疑似与 raw/2026-08-10 制度冲突] 标签并更正为 160/220 元标准`,
        autoFixable: true
      });
    }
  });

  // 4. Orphan nodes check
  pages.forEach(p => {
    // syntheses or top-level entries might have lower incoming links, but SOPs/terms shouldn't be isolated
    if (incomingLinkCount[p.path] === 0) {
      issues.push({
        id: `orphan-${p.id}`,
        type: 'orphan_node',
        severity: 'low',
        sourcePath: p.path,
        message: `孤岛节点：该页面未被任何其他 Wiki 页面引用`,
        suggestedFix: `在 wiki/index.md 索引中强化关联，或在相关 SOP/Synthesis 综述中建立双链`,
        autoFixable: true
      });
    }
  });

  return issues;
}

export function calculateHealthScore(pagesCount: number, issues: LintIssue[]): {
  score: number;
  grade: 'A+ 极优' | 'A 良好' | 'B 需维护' | 'C 亚健康';
  breakdown: { dangling: number; orphan: number; contradiction: number; schema: number };
} {
  const dangling = issues.filter(i => i.type === 'dangling_link' && !i.fixed).length;
  const orphan = issues.filter(i => i.type === 'orphan_node' && !i.fixed).length;
  const contradiction = issues.filter(i => i.type === 'contradiction' && !i.fixed).length;
  const schema = issues.filter(i => i.type === 'schema_error' && !i.fixed).length;

  let deduction = dangling * 8 + contradiction * 6 + schema * 4 + orphan * 2;
  let score = Math.max(100 - deduction, 40);

  let grade: 'A+ 极优' | 'A 良好' | 'B 需维护' | 'C 亚健康' = 'A+ 极优';
  if (score >= 95) grade = 'A+ 极优';
  else if (score >= 85) grade = 'A 良好';
  else if (score >= 70) grade = 'B 需维护';
  else grade = 'C 亚健康';

  return {
    score,
    grade,
    breakdown: { dangling, orphan, contradiction, schema }
  };
}
