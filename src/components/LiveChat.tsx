import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Pin, 
  ShieldAlert, 
  ShieldCheck, 
  Mic2, 
  Clock, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Flag, 
  PauseCircle, 
  PlayCircle,
  X,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { chatService, ChatMessage, SLOW_MODE_SECONDS, MAX_CHAT_LENGTH } from '../lib/chat';

interface LiveChatProps {
  isPopout?: boolean;
  onTogglePopout?: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ isPopout = false, onTogglePopout }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem('kenlive_chat_nickname') || '';
  });
  const [showNicknameModal, setShowNicknameModal] = useState<boolean>(false);
  const [tempNickname, setTempNickname] = useState('');
  
  // Mobile collapse state
  const [isCollapsedMobile, setIsCollapsedMobile] = useState<boolean>(false);

  // Slow mode cooldown
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const cooldownTimerRef = useRef<any>(null);

  // Chat paused toggle
  const [isChatPaused, setIsChatPaused] = useState<boolean>(chatService.getIsPaused());

  // Report dialog feedback
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to chat stream
  useEffect(() => {
    const unsubscribe = chatService.subscribe((msgs) => {
      setMessages([...msgs]);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom unless user scrolled up
  useEffect(() => {
    if (!isChatPaused && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatPaused]);

  // Handle slow mode countdown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setCooldownSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [cooldownSeconds]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setShowNicknameModal(true);
      return;
    }

    if (cooldownSeconds > 0) return;
    if (isChatPaused) return;

    const trimmed = inputText.trim();
    if (!trimmed) return;

    const success = await chatService.sendMessage(trimmed, nickname);
    if (success) {
      setInputText('');
      setCooldownSeconds(SLOW_MODE_SECONDS);
    }
  };

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempNickname.trim();
    if (clean.length >= 2) {
      setNickname(clean);
      localStorage.setItem('kenlive_chat_nickname', clean);
      setShowNicknameModal(false);
    }
  };

  const handleReport = (msgId: string) => {
    chatService.reportMessage(msgId);
    setReportedIds(prev => [...prev, msgId]);
    setFeedbackNotice("Message reported to KenLive moderators. Asante.");
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const togglePause = () => {
    const next = chatService.togglePause();
    setIsChatPaused(next);
  };

  const pinnedMsg = messages.find(m => m.isPinned);
  const regularMessages = messages.filter(m => !m.isPinned);

  return (
    <div 
      className={`flex flex-col bg-[#111116] dark:bg-[#111116] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 rounded-2xl overflow-hidden shadow-xl transition-all ${
        isPopout 
          ? 'fixed inset-4 sm:inset-10 z-50 max-w-4xl mx-auto shadow-2xl border-2 border-[#C30D12]' 
          : 'h-[500px] lg:h-full min-h-[460px]'
      }`}
    >
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161D] dark:bg-[#16161D] light:bg-gray-100 border-b border-[#242430] dark:border-[#242430] light:border-gray-200 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-heading font-extrabold uppercase tracking-wide text-sm sm:text-base text-white dark:text-white light:text-gray-900">
              Live Chat
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#20202B] text-gray-300 light:bg-gray-200 light:text-gray-700">
            Slow mode (5s)
          </span>
        </div>

        {/* Header Controls: Pause / Popout / Mobile Collapse */}
        <div className="flex items-center gap-1">
          <button
            onClick={togglePause}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/10 transition-colors"
            title={isChatPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            aria-label="Pause or Resume Chat"
          >
            {isChatPaused ? (
              <PlayCircle className="w-4 h-4 text-amber-400" />
            ) : (
              <PauseCircle className="w-4 h-4" />
            )}
          </button>

          {onTogglePopout && (
            <button
              onClick={onTogglePopout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/10 transition-colors"
              title={isPopout ? "Exit popout" : "Fullscreen popout"}
              aria-label="Popout chat"
            >
              {isPopout ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Collapse Toggle */}
          <button
            onClick={() => setIsCollapsedMobile(!isCollapsedMobile)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Toggle chat collapse"
          >
            {isCollapsedMobile ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main chat body when not collapsed */}
      {!isCollapsedMobile && (
        <>
          {/* Pinned Broadcast Announcement */}
          {pinnedMsg && (
            <div className="flex items-start gap-2.5 px-3 py-2 bg-gradient-to-r from-[#C30D12]/20 via-[#1C1520] to-[#121218] border-b border-[#C30D12]/30 text-xs text-white">
              <Pin className="w-4 h-4 text-[#C30D12] shrink-0 mt-0.5 fill-current" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 font-bold font-heading text-[11px] text-[#C30D12] uppercase tracking-wider">
                  <span>PINNED ANNOUNCEMENT</span>
                  <span className="text-gray-400 font-normal lowercase">• {pinnedMsg.sender}</span>
                </div>
                <p className="text-gray-200 text-xs mt-0.5 leading-snug">
                  {pinnedMsg.text}
                </p>
              </div>
            </div>
          )}

          {/* Feedback notice toast */}
          {feedbackNotice && (
            <div className="px-3 py-1.5 bg-emerald-900/60 text-emerald-200 text-xs border-b border-emerald-500/30 flex items-center justify-between">
              <span>{feedbackNotice}</span>
              <button onClick={() => setFeedbackNotice(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Message List */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs"
          >
            {regularMessages.map((msg) => {
              const isPresenter = msg.badge === 'presenter';
              const isModerator = msg.badge === 'moderator';

              return (
                <div 
                  key={msg.id}
                  className={`group flex items-start gap-2.5 rounded-lg p-1.5 transition-colors ${
                    isPresenter 
                      ? 'bg-[#C30D12]/10 border border-[#C30D12]/20' 
                      : isModerator 
                      ? 'bg-[#0B5CAB]/10 border border-[#0B5CAB]/20'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Colored Avatar */}
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: msg.avatarColor || '#C30D12' }}
                  >
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-semibold tracking-tight ${
                          isPresenter 
                            ? 'text-[#C30D12] font-bold' 
                            : isModerator 
                            ? 'text-blue-400 font-bold' 
                            : 'text-gray-300 dark:text-gray-300 light:text-gray-900'
                        }`}>
                          {msg.sender}
                        </span>

                        {/* Badges */}
                        {isPresenter && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-heading font-extrabold uppercase bg-[#C30D12] text-white">
                            <Mic2 className="w-2.5 h-2.5" /> PRESENTER
                          </span>
                        )}
                        {isModerator && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-heading font-extrabold uppercase bg-[#0B5CAB] text-white">
                            <ShieldCheck className="w-2.5 h-2.5" /> MOD
                          </span>
                        )}
                      </div>

                      {/* Time & Report button */}
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => handleReport(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                          title="Report message"
                          aria-label="Report message"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-200 dark:text-gray-200 light:text-gray-800 break-words mt-0.5 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Paused Notification */}
          {isChatPaused && (
            <div className="bg-amber-500/10 border-t border-amber-500/30 px-3 py-1.5 text-center text-[11px] text-amber-300 font-medium">
              Chat auto-scroll is paused. Scroll down or click resume.
            </div>
          )}

          {/* Bottom Input Area */}
          <div className="p-3 bg-[#14141A] dark:bg-[#14141A] light:bg-gray-50 border-t border-[#242430] dark:border-[#242430] light:border-gray-200">
            {/* Nickname pill or Prompt */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Posting as:</span>
                {nickname ? (
                  <button
                    onClick={() => {
                      setTempNickname(nickname);
                      setShowNicknameModal(true);
                    }}
                    className="font-bold text-white dark:text-white light:text-gray-900 hover:text-[#C30D12] transition-colors flex items-center gap-1"
                  >
                    <span>{nickname}</span>
                    <span className="text-[10px] text-gray-400 underline font-normal">(change)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowNicknameModal(true)}
                    className="font-bold text-[#C30D12] underline hover:text-[#A0090E]"
                  >
                    Set your nickname to chat
                  </button>
                )}
              </div>

              {/* Character Counter */}
              <span className={`font-mono ${
                inputText.length > 180 ? 'text-[#C30D12] font-bold' : 'text-gray-500'
              }`}>
                {inputText.length}/{MAX_CHAT_LENGTH}
              </span>
            </div>

            {/* Input & Send Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                maxLength={MAX_CHAT_LENGTH}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  cooldownSeconds > 0 
                    ? `Wait ${cooldownSeconds}s before sending...`
                    : "Say something / Toa maoni yako..."
                }
                disabled={cooldownSeconds > 0}
                className="flex-1 bg-[#1A1A22] dark:bg-[#1A1A22] light:bg-white text-white dark:text-white light:text-gray-900 placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-[#2B2B38] dark:border-[#2B2B38] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] disabled:opacity-50 min-h-[44px]"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || cooldownSeconds > 0}
                className="px-4 py-2.5 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] active:scale-95 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:hover:bg-[#C30D12] min-h-[44px]"
                aria-label="Send message"
              >
                {cooldownSeconds > 0 ? (
                  <span className="font-mono text-xs">{cooldownSeconds}s</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Nickname First-Time / Change Modal */}
      {showNicknameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#16161D] dark:bg-[#16161D] light:bg-white border border-[#2B2B38] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#C30D12]/20 text-[#C30D12]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg uppercase text-white dark:text-white light:text-gray-900">
                    KenLive Live Chat
                  </h3>
                  <p className="text-xs text-gray-400">Choose your public screen name</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNicknameModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Nickname / Jina Lako:
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={24}
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  placeholder="e.g. Wanjiku_NBO, Kipchumba"
                  className="w-full bg-[#1F1F2A] light:bg-gray-100 text-white light:text-black text-sm px-3.5 py-2.5 rounded-xl border border-[#313142] focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
                  autoFocus
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Keep it respectful. Moderators remove spam or offensive language.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNicknameModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tempNickname.trim().length < 2}
                  className="px-5 py-2 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg disabled:opacity-40"
                >
                  Join Live Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;

