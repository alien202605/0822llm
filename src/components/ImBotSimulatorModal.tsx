import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Paperclip,
  Smile,
  Bot,
  User,
  CheckCircle2,
  Share2,
  Copy,
  Terminal
} from 'lucide-react';

type IMPlatform = 'feishu' | 'dingtalk' | 'wecom';

export const ImBotSimulatorModal: React.FC = () => {
  const [platform, setPlatform] = useState<IMPlatform>('feishu');
  const [imMessages, setImMessages] = useState<
    { id: string; sender: 'user' | 'bot'; text: string; time: string; card?: any }[]
  >([
    {
      id: '1',
      sender: 'bot',
      text: 'OmniWiki 知识库机器人已接入！你可以直接在群里 @我 提问，或者直接丢 PDF/Word/飞书文档 给我，我将自动编织编译进企业活字典。',
      time: '18:30'
    },
    {
      id: '2',
      sender: 'user',
      text: '@OmniWiki 请问最新差旅补贴多少？怎么报销？',
      time: '18:32'
    },
    {
      id: '3',
      sender: 'bot',
      text: '根据 2026 最新制度：\n- 一线城市补贴 220 元/天；二线城市 160 元/天。\n- 需先提报 BIZ-TRIP-REQ 事前申请单，事后 7 天内贴票。\n详细指引请查阅 [[wiki/sops/travel-reimbursement.md]]',
      time: '18:32',
      card: {
        title: '差旅费用报销 SOP (wiki/sops/travel-reimbursement.md)',
        badge: 'SOP 流程',
        actionText: '在 Web Portal 中查看完整双链'
      }
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = {
      id: `${Date.now()}-u`,
      sender: 'user' as const,
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setImMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      const botMsg = {
        id: `${Date.now()}-b`,
        sender: 'bot' as const,
        text: `已通过 \`qmd\` 混合检索召回相关知识。回答已基于企业标准 Wiki 校验生成，且支持反向追溯 Layer 1 原始规章出处。`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setImMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  const platformMeta = {
    feishu: {
      name: '飞书 (Feishu) 机器人',
      themeColor: 'border-blue-500 bg-blue-600',
      headerBg: 'bg-blue-600',
      bubbleBg: 'bg-blue-50 border-blue-200 text-blue-900',
      avatarBg: 'bg-blue-500'
    },
    dingtalk: {
      name: '钉钉 (DingTalk) 智能助理',
      themeColor: 'border-cyan-500 bg-cyan-600',
      headerBg: 'bg-cyan-600',
      bubbleBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
      avatarBg: 'bg-cyan-500'
    },
    wecom: {
      name: '企业微信 (WeCom) 知识助手',
      themeColor: 'border-emerald-500 bg-emerald-600',
      headerBg: 'bg-emerald-600',
      bubbleBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      avatarBg: 'bg-emerald-500'
    }
  };

  const current = platformMeta[platform];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Client Terminals
              </span>
              <span className="text-xs text-slate-500 font-mono">
                飞书 / 钉钉 / 企微 IM 机器人无缝接入
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              企业 IM 机器人多端交互模拟终端
            </h2>
            <p className="text-xs text-slate-500">
              员工在日常沟通中随手提问或抛入文件，无需离开 IM 客户端即可完成知识库摄入与秒级检索。
            </p>
          </div>

          {/* Platform Switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setPlatform('feishu')}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                platform === 'feishu' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              飞书 (Feishu)
            </button>
            <button
              onClick={() => setPlatform('dingtalk')}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                platform === 'dingtalk' ? 'bg-white text-cyan-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              钉钉 (DingTalk)
            </button>
            <button
              onClick={() => setPlatform('wecom')}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                platform === 'wecom' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              企业微信 (WeCom)
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: IM Chat Window (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[620px]">
          {/* Chat Header */}
          <div className={`p-4 ${current.headerBg} text-white flex items-center justify-between shadow-xs`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{current.name}</h4>
                <p className="text-[10px] text-white/80 font-mono">agent alien 知识库 Hybrid Agent · 在线</p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
            {imMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    msg.sender === 'user' ? 'bg-slate-700' : current.avatarBg
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="max-w-[80%] space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.card && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{msg.card.title}</span>
                          <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-mono">
                            {msg.card.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-indigo-600 font-medium cursor-pointer hover:underline">
                          🔗 {msg.card.actionText}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1 font-mono">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center space-x-3 text-slate-400 text-xs px-1">
              <span className="flex items-center space-x-1 cursor-pointer hover:text-slate-600">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="text-[11px]">发送附件 (触发 Ingest)</span>
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="在群聊中提问，例如: @OmniWiki 如何申领差旅补贴？"
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none bg-slate-50"
              />
              <button
                onClick={handleSend}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        {/* Right: Webhook & Integration Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>IM 机器人集成参数与 Webhook 契约</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block">Webhook 回调 URL (接收消息与附件):</label>
                <code className="text-[11px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-200 block text-indigo-700 mt-1 truncate">
                  POST https://api.omniwiki.corp/v1/webhook/{platform}
                </code>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block">触发模式 (Trigger Mode):</label>
                <div className="mt-1 space-y-1.5 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>单聊即问即答 (1:1 直接对话)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>群聊 @机器人 唤醒或群文件自动 Ingest 编译</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>零摩擦知识资产沉淀</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              员工在日常办公沟通中沉淀的问答与会议附件，均自动通过后端 Ingest 与 Lint 引擎转化为标准 Wiki，实现企业知识资产复利增长。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
