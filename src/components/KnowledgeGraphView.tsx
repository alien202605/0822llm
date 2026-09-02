import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Filter,
  Maximize2,
  Sparkles,
  Info,
  ExternalLink,
  BookOpen,
  Zap,
  RotateCcw
} from 'lucide-react';
import { WikiPage, RawDocument, EntityType } from '../types';

interface KnowledgeGraphViewProps {
  wikiPages: WikiPage[];
  rawDocs: RawDocument[];
  onNavigateToWikiPage: (path: string) => void;
}

interface NodePosition {
  id: string;
  label: string;
  type: EntityType | 'raw' | 'dangling';
  path: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number;
}

interface EdgeLink {
  source: string;
  target: string;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  wikiPages,
  rawDocs,
  onNavigateToWikiPage
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodePosition | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodePosition | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showRawNodes, setShowRawNodes] = useState<boolean>(true);
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState<boolean>(false);

  // Graph state references
  const nodesRef = useRef<NodePosition[]>([]);
  const edgesRef = useRef<EdgeLink[]>([]);
  const animFrameId = useRef<number>(0);

  const entityColors: Record<string, string> = {
    sop: '#10b981', // emerald
    product: '#3b82f6', // blue
    project: '#8b5cf6', // purple
    term: '#f59e0b', // amber
    synthesis: '#f43f5e', // rose
    raw: '#64748b', // slate
    dangling: '#ef4444' // red
  };

  // Initialize node positions & edges
  useEffect(() => {
    const nodes: NodePosition[] = [];
    const edges: EdgeLink[] = [];

    const width = 800;
    const height = 540;

    // Add Wiki nodes
    wikiPages.forEach((p, idx) => {
      const angle = (idx / (wikiPages.length || 1)) * Math.PI * 2;
      const dist = 140 + (idx % 3) * 60;
      nodes.push({
        id: p.path,
        label: p.frontmatter.title,
        type: p.frontmatter.type,
        path: p.path,
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: p.frontmatter.type === 'synthesis' ? 14 : p.frontmatter.type === 'sop' ? 12 : 10,
        connections: p.outgoingLinks.length
      });

      // Wiki to Wiki edges
      p.outgoingLinks.forEach(targetPath => {
        edges.push({
          source: p.path,
          target: targetPath
        });
      });

      // Raw to Wiki edges
      p.frontmatter.sources.forEach(rawSrc => {
        edges.push({
          source: rawSrc,
          target: p.path
        });
      });
    });

    // Add Raw nodes if enabled
    if (showRawNodes) {
      rawDocs.forEach((r, idx) => {
        const angle = ((idx + 0.5) / (rawDocs.length || 1)) * Math.PI * 2;
        nodes.push({
          id: r.path,
          label: r.title,
          type: 'raw',
          path: r.path,
          x: width / 2 + Math.cos(angle) * 260,
          y: height / 2 + Math.sin(angle) * 260,
          vx: 0,
          vy: 0,
          radius: 9,
          connections: r.compiledPagesCount
        });
      });
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [wikiPages, rawDocs, showRawNodes]);

  // Physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // Physics update step
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // 1. Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 220) {
            const force = (220 - dist) / dist * 0.08;
            nodes[i].vx -= dx * force * 0.05;
            nodes[i].vy -= dy * force * 0.05;
            nodes[j].vx += dx * force * 0.05;
            nodes[j].vy += dy * force * 0.05;
          }
        }
      }

      // 2. Attraction along edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 110;
          const force = (dist - targetDist) * 0.003;
          sourceNode.vx += dx * force;
          sourceNode.vy += dy * force;
          targetNode.vx -= dx * force;
          targetNode.vy -= dy * force;
        }
      });

      // 3. Center gravity and bounding box
      nodes.forEach(node => {
        const dx = width / 2 - node.x;
        const dy = height / 2 - node.y;
        node.vx += dx * 0.001;
        node.vy += dy * 0.001;

        // Damping
        node.vx *= 0.88;
        node.vy *= 0.88;

        node.x += node.vx;
        node.y += node.vy;

        // Constrain in bounds
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
      });

      // Drawing
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.8)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        // Filter check
        if (filterType !== 'all') {
          if (sourceNode.type !== filterType && targetNode.type !== filterType) return;
        }

        const isHighlighted =
          hoveredNode &&
          (hoveredNode.id === sourceNode.id || hoveredNode.id === targetNode.id);

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = isHighlighted ? '#6366f1' : 'rgba(203, 213, 225, 0.7)';
        ctx.lineWidth = isHighlighted ? 2.2 : 1.2;
        ctx.stroke();
      });

      // Draw Nodes
      nodes.forEach(node => {
        if (filterType !== 'all' && node.type !== filterType) return;

        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isHovered || isSelected ? 4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = entityColors[node.type] || '#64748b';
        ctx.fill();

        if (isSelected || isHovered) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#1e293b';
          ctx.stroke();
        } else {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
        }

        // Draw Labels
        ctx.font = isHovered || isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isHovered || isSelected ? '#0f172a' : '#475569';
        ctx.textAlign = 'center';
        const displayLabel = node.label.length > 10 ? node.label.slice(0, 10) + '...' : node.label;
        ctx.fillText(displayLabel, node.x, node.y + node.radius + 14);
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId.current);
    };
  }, [filterType, hoveredNode, selectedNode]);

  // Handle Canvas Mouse Interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = nodesRef.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 6;
    });

    setHoveredNode(hit || null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = nodesRef.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 6;
    });

    setSelectedNode(hit || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Legend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Obsidian Graph View
              </span>
              <span className="text-xs text-slate-500 font-mono">
                全景企业双链知识网络图谱
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              交互式双链知识图谱与连通度网络
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              全部节点
            </button>
            <button
              onClick={() => setFilterType('sop')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                filterType === 'sop' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>SOP</span>
            </button>
            <button
              onClick={() => setFilterType('product')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                filterType === 'product' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Product</span>
            </button>
            <button
              onClick={() => setFilterType('term')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                filterType === 'term' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Term</span>
            </button>
            <button
              onClick={() => setFilterType('synthesis')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                filterType === 'synthesis' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Synthesis</span>
            </button>
            <button
              onClick={() => setShowRawNodes(!showRawNodes)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition border ${
                showRawNodes
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-white text-slate-500 border-slate-300'
              }`}
            >
              {showRawNodes ? '隐藏 Raw 节点' : '显示 Raw 溯源'}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-sans">
          <span className="font-bold text-slate-700">图例说明:</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>SOP 流程</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Product 产品</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Project 项目</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Term 术语</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Synthesis 综述</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Raw 原始文件</span>
          </span>
        </div>
      </div>

      {/* Canvas & Node Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas (8 cols) */}
        <div className={`${isControlPanelCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white rounded-2xl border border-slate-200 p-2 shadow-sm relative overflow-hidden flex items-center justify-center`}>
          <canvas
            ref={canvasRef}
            width={780}
            height={520}
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
            className="cursor-crosshair rounded-xl"
          />

          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-slate-700 pointer-events-none">
            💡 提示: 移动鼠标可高亮关联双链；点击节点可在右侧速览
          </div>
        </div>

        {/* Control Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <button
            onClick={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
            className="w-full flex items-center justify-center gap-2 text-xs font-mono py-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm"
          >
            <span className="text-base font-bold">{isControlPanelCollapsed ? '>' : '<'}</span>
            <span>{isControlPanelCollapsed ? '展开控制面板' : '收起控制面板'}</span>
          </button>

          {!isControlPanelCollapsed && (
            <div className="space-y-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${entityColors[selectedNode.type]}20`,
                      color: entityColors[selectedNode.type]
                    }}
                  >
                    {selectedNode.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedNode.connections} 条关联
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  {selectedNode.label}
                </h3>
                <div className="text-xs text-slate-500 font-mono truncate">
                  {selectedNode.path}
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">所属层级:</span>
                  <span className="font-medium text-slate-800">
                    {selectedNode.type === 'raw' ? 'Layer 1: raw/ 原始资料' : 'Layer 2: wiki/ 编译网络'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">双链引用数:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {selectedNode.connections}
                  </span>
                </div>
              </div>

              {selectedNode.type !== 'raw' && (
                <button
                  onClick={() => onNavigateToWikiPage(selectedNode.path)}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>打开该 Wiki 页面正文</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 shadow-sm space-y-2">
              <Sparkles className="w-8 h-8 text-indigo-300 mx-auto" />
              <p className="text-xs font-medium text-slate-600">点击图谱中任意节点</p>
              <p className="text-[11px] text-slate-400">
                即可在此处查看该节点的双链引用、所属实体及快速跳转
              </p>
            </div>
          )}

          {/* Graph Statistics */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>知识网络连通度分析</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">总节点数:</span>
                <span className="text-lg font-bold text-white">
                  {wikiPages.length + (showRawNodes ? rawDocs.length : 0)}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">图谱密度:</span>
                <span className="text-lg font-bold text-emerald-400">
                  {(wikiPages.reduce((acc, p) => acc + p.outgoingLinks.length, 0) / (wikiPages.length || 1)).toFixed(1)}x
                </span>
              </div>
            </div>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
