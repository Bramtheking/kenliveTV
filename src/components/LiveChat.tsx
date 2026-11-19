import { useState, useEffect, useRef } from "react";
import {
  Send, Pin, ShieldCheck, Mic2, Maximize2, Minimize2,
  ChevronDown, ChevronUp, Flag, PauseCircle, PlayCircle,
  X, MessageSquare,
} from "lucide-react";
import { chatService, type ChatMessage, SLOW_MODE_SECONDS, MAX_CHAT_LENGTH } from "@/lib/chat";

interface LiveChatProps {
  isPopout?: boolean;
  onTogglePopout?: () => void;
}

const LiveChat = ({ isPopout = false, onTogglePopout }: LiveChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [nickname, setNickname] = useState<string>(() => localStorage.getItem("kenlive_chat_nick") || "");
  const [showNickModal, setShowNickModal] = useState(false);
  const [tempNick, setTempNick] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isPaused, setIsPaused] = useState(() => chatService.getIsPaused());
  const [notice, setNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cooldownRef = useRef<any>(null);

  useEffect(() => {
    const unsub = chatService.subscribe(msgs => setMessages([...msgs]));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isPaused && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPaused]);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => { if (cooldownRef.current) clearTimeout(cooldownRef.current); };
  }, [cooldown]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) { setShowNickModal(true); return; }
    if (cooldown > 0 || isPaused || !inputText.trim()) return;
    const ok = await chatService.sendMessage(inputText, nickname);
    if (ok) { setInputText(""); setCooldown(SLOW_MODE_SECONDS); }
  };

  const saveNick = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempNick.trim();
    if (clean.length >= 2) {
      setNickname(clean);
      localStorage.setItem("kenlive_chat_nick", clean);
      setShowNickModal(false);
    }
  };

  const report = (id: string) => {
    chatService.reportMessage(id);
    setNotice("Message reported to KenLive moderators. Asante.");
    setTimeout(() => setNotice(null), 3500);
  };

  const togglePause = () => { const next = chatService.togglePause(); setIsPaused(next); };

  const pinned = messages.find(m => m.isPinned);
  const regular = messages.filter(m => !m.isPinned);

  return (
    <div className={`flex flex-col bg-white dark:bg-[#111116] border border-border rounded-2xl overflow-hidden shadow-xl transition-all duration-200 ${
      isPopout ? "fixed inset-4 sm:inset-10 z-50 max-w-4xl mx-auto shadow-2xl border-2 border-primary" : "h-[500px] lg:h-full min-h-[460px]"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border select-none">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-bold uppercase tracking-wide text-sm text-secondary-foreground">Live Chat</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">Slow mode (5s)</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={togglePause} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title={isPaused ? "Resume" : "Pause"}>
            {isPaused ? <PlayCircle className="w-4 h-4 text-amber-500" /> : <PauseCircle className="w-4 h-4" />}
          </button>
          {onTogglePopout && (
            <button onClick={onTogglePopout} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {isPopout ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Pinned message */}
          {pinned && (
            <div className="flex items-start gap-2.5 px-3 py-2 bg-primary/10 border-b border-primary/30 text-xs">
              <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5 fill-current" />
              <div className="flex-1">
                <div className="font-bold text-[11px] text-primary uppercase tracking-wider">PINNED • {pinned.sender}</div>
                <p className="text-foreground text-xs mt-0.5 leading-snug">{pinned.text}</p>
              </div>
            </div>
          )}

          {/* Notice toast */}
          {notice && (
            <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs border-b border-emerald-300 flex items-center justify-between">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {regular.map(msg => {
              const isPresenter = msg.badge === "presenter";
              const isMod = msg.badge === "moderator";
              return (
                <div key={msg.id} className={`group flex items-start gap-2.5 rounded-lg p-1.5 transition-colors ${
                  isPresenter ? "bg-primary/10 border border-primary/20" :
                  isMod ? "bg-blue-50 border border-blue-200" :
                  "hover:bg-muted"
                }`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-sm" style={{ backgroundColor: msg.avatarColor || "#C30D12" }}>
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-semibold tracking-tight ${isPresenter ? "text-primary font-bold" : isMod ? "text-blue-600" : "text-foreground"}`}>
                          {msg.sender}
                        </span>
                        {isPresenter && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 rounded text-[9px] font-extrabold uppercase bg-primary text-primary-foreground">
                            <Mic2 className="w-2.5 h-2.5" /> PRESENTER
                          </span>
                        )}
                        {isMod && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 rounded text-[9px] font-extrabold uppercase bg-blue-600 text-white">
                            <ShieldCheck className="w-2.5 h-2.5" /> MOD
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <button onClick={() => report(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity">
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-muted-foreground break-words mt-0.5 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {isPaused && (
            <div className="bg-amber-50 border-t border-amber-300 px-3 py-1.5 text-center text-[11px] text-amber-800 font-medium">
              Chat paused. Scroll down or click resume.
            </div>
          )}

          {/* Input area */}
          <div className="p-3 bg-secondary border-t border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
              <div className="flex items-center gap-1.5">
                <span>Posting as:</span>
                {nickname ? (
                  <button onClick={() => { setTempNick(nickname); setShowNickModal(true); }} className="font-bold text-foreground hover:text-primary flex items-center gap-1">
                    {nickname} <span className="text-[10px] text-muted-foreground underline font-normal">(change)</span>
                  </button>
                ) : (
                  <button onClick={() => setShowNickModal(true)} className="font-bold text-primary underline hover:opacity-80">
                    Set nickname to chat
                  </button>
                )}
              </div>
              <span className={`font-mono ${inputText.length > 180 ? "text-destructive font-bold" : ""}`}>
                {inputText.length}/{MAX_CHAT_LENGTH}
              </span>
            </div>
            <form onSubmit={send} className="flex items-center gap-2">
              <input
                type="text" value={inputText} maxLength={MAX_CHAT_LENGTH}
                onChange={e => setInputText(e.target.value)}
                placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Say something / Toa maoni yako..."}
                disabled={cooldown > 0}
                className="flex-1 bg-background text-foreground placeholder:text-muted-foreground text-xs px-3 py-2.5 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 min-h-[44px]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || cooldown > 0}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-40 min-h-[44px]"
              >
                {cooldown > 0 ? <span className="font-mono text-xs">{cooldown}s</span> : <><Send className="w-3.5 h-3.5" /><span className="hidden sm:inline">Send</span></>}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Nickname modal */}
      {showNickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/15 text-primary"><MessageSquare className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-extrabold text-lg uppercase text-foreground">KenLive Live Chat</h3>
                  <p className="text-xs text-muted-foreground">Choose your screen name</p>
                </div>
              </div>
              <button onClick={() => setShowNickModal(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveNick} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Your Nickname / Jina Lako:</label>
                <input
                  type="text" required minLength={2} maxLength={24} value={tempNick}
                  onChange={e => setTempNick(e.target.value)}
                  placeholder="e.g. Wanjiku_NBO, Kipchumba"
                  className="w-full bg-muted text-foreground text-sm px-3.5 py-2.5 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground mt-1">Keep it respectful. Moderators remove spam.</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNickModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={tempNick.trim().length < 2} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-lg disabled:opacity-40">
                  Join Chat
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
