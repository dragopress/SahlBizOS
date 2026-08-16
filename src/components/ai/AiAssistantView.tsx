import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  FileSpreadsheet,
  Calculator,
  Mail,
  Loader2,
  CheckCircle,
  Copy,
  Trash2,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const AiAssistantView: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChat, language, invoices, quotes, customers, t } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const message = (textToSend || input).trim();
    if (!message || isTyping) return;

    setInput('');
    setIsTyping(true);
    try {
      await sendChatMessage(message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      title: 'Email de relance de facture impayée',
      prompt:
        'Rédige un email professionnel et courtois pour relancer un client marocain dont la facture FA-2026-0002 de 14 400 MAD est arrivée à échéance.',
      icon: Mail,
      color: 'text-amber-500',
    },
    {
      title: 'صياغة رسالة واتساب للزبون بالدارجة',
      prompt: 'اكتب رسالة واتساب لطيفة ومهنية بالدارجة المغربية لتذكير الزبون بتحويل مستحقات الفاتورة.',
      icon: Lightbulb,
      color: 'text-emerald-500',
    },
    {
      title: 'Simulation Déclaration TVA Trimestrielle',
      prompt:
        'Explique-moi les règles de la déduction de TVA au Maroc (régime des encaissements vs débits) et comment optimiser ma trésorerie.',
      icon: Calculator,
      color: 'text-purple-500',
    },
    {
      title: 'Clause de réserve de propriété Devis',
      prompt:
        'Rédige une clause juridique de réserve de propriété conforme au droit commercial marocain à insérer au bas de mes devis.',
      icon: FileSpreadsheet,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-[#0C0C0C] rounded-lg border border-white/10 shadow-2xl overflow-hidden animate-in fade-in duration-200">
      {/* Assistant Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Intelligence Engine
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white/10 text-zinc-300 border border-white/10">
                Gemini 2.5 Flash
              </span>
            </div>
            <h2 className="font-serif italic text-white text-base leading-tight mt-0.5">
              SahlBiz Moroccan Copilot
            </h2>
          </div>
        </div>

        {chatMessages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Effacer la discussion"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif italic text-white text-xl">
                {language === 'ar'
                  ? 'مرحباً بك في المساعد الذكي لمقاولتك'
                  : 'Comment puis-je vous assister ?'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'اطرح أسئلتك حول الفواتير، صياغة الإيميلات، حساب الضريبة على القيمة المضافة، أو تحسين المبيعات.'
                  : 'Posez des questions sur vos finances, générez des lettres de relance, optimisez vos devis ou analysez vos marges.'}
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left rtl:text-right">
              {quickPrompts.map((qp, idx) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.prompt)}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-xs group text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                      <span className="font-mono text-zinc-300 group-hover:text-white text-xs">
                        {qp.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {qp.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded p-4 text-xs leading-relaxed relative group font-sans ${
                    isUser
                      ? 'bg-white text-black font-medium'
                      : 'bg-[#080808] text-zinc-200 border border-white/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="absolute bottom-2 right-2 p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copier le texte"
                    >
                      {copiedId === msg.id ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-4 py-2.5 rounded bg-[#080808] border border-white/10 flex items-center gap-2 text-zinc-400 text-xs font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>SahlBiz AI analyse et rédige la réponse...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-white/10 bg-[#080808]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'اسأل الذكاء الاصطناعي حول الإدارة، الضرائب، أو صياغة المراسلات...'
                : 'Posez une question sur la fiscalité, rédigez un email ou analysez vos chiffres...'
            }
            className="flex-1 px-4 py-2.5 rounded bg-[#0C0C0C] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};
